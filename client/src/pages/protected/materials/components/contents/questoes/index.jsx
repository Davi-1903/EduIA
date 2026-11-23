import { useEffect, useRef, useState } from 'react';
import { useMessages } from '../../../../../../context/messagesContext';
import { POST } from '../../../../../../api/materials';
import Introduction from './components/Introduction';
import Explanation from './components/Explanation';
import Display from './components/Display';
import Options from './components/Options';
import End from './components/End';
import clsx from 'clsx';

export default function Questions({ id, discipline, subject, difficulty, content, answers, time_used, setContent }) {
    const materialRef = useRef(null);
    const [start, setStart] = useState(false);
    const [isClose, setClose] = useState(false);
    const [currentQuestionId, setCurrentQuestionId] = useState(answers ? content.length : 0);
    const [showExplanation, setShowExplanation] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);
    const [answersList, setAnswersList] = useState(answers ?? []);
    const [answerId, setAnswerId] = useState(null);
    const [time, setTime] = useState(0);
    const { setMessages } = useMessages();

    function handleStart() {
        setTime(performance.now());
        setStart(true);
    }

    function handleAnimationEnd(event) {
        if (event.target !== event.currentTarget) return;
        if (isClose) setContent(null);
    }

    function nextQuestion() {
        if (currentQuestionId >= content.length - 1) {
            setTime(prev => performance.now() - prev);
            setCurrentQuestionId(content.length);
        } else {
            setCurrentQuestionId(prev => prev + 1);
        }
        setShowAnswer(false);
        setAnswerId(null);
    }

    function handleRestart() {
        if (!confirm('Responder novamente as questões?')) return;

        setCurrentQuestionId(0);
        setTime(performance.now());
        setShowAnswer(false);
        setAnswerId(null);
        setAnswersList([]);
        setShowExplanation(false);
        setStart(false);
    }

    function toRespond(id) {
        if (answerId !== null) return;

        setShowAnswer(true);
        setAnswerId(id);
        setAnswersList(prev => [
            ...prev,
            { id: prev.length + 1, isCorrect: id === content[currentQuestionId].correctAnswerId },
        ]);
    }

    async function saveProgress() {
        try {
            const response = await POST(`/api/materials/questoes/${id}/answer`, {
                answers: answersList,
                time_used: time,
            });
            if (response.status !== 200) throw new Error(response.message);
            setMessages(prev => [...prev, { id: prev.length + 1, message: response.message, type: 'ok' }]);
            nextQuestion();
        } catch (err) {
            setMessages(prev => [...prev, { id: prev.length + 1, message: err.message, type: 'danger' }]);
        }
    }

    useEffect(() => {
        function handleClick(event) {
            if (showExplanation) return;
            if (
                !materialRef.current?.contains(event.target) &&
                (!start || currentQuestionId >= content.length || confirm('Deseja parar de responder as questões?'))
            )
                setClose(true);
        }

        function handleKey(event) {
            if (showExplanation) return;
            if (
                event.key === 'Escape' &&
                (!start || currentQuestionId >= content.length || confirm('Deseja parar de responder as questões?'))
            )
                setClose(true);
        }

        document.addEventListener('mousedown', handleClick);
        document.addEventListener('keydown', handleKey);
        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('keydown', handleKey);
        };
    }, [showExplanation, content.length, currentQuestionId, start, answers]);

    return (
        <div
            onAnimationEnd={handleAnimationEnd}
            className={clsx(
                'fixed inset-0 z-7 grid place-items-center bg-gray-800/20 backdrop-blur-sm',
                isClose ? 'animate-fade-out' : 'animate-fade-in',
            )}
        >
            {showExplanation && (
                <Explanation
                    explanation={content[currentQuestionId].explanation}
                    setShowExplanation={setShowExplanation}
                />
            )}
            <main
                ref={materialRef}
                className='flex h-170 w-full max-w-160 flex-col gap-3 overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl shadow-color1-100/15 md:gap-6 md:p-6 lg:w-4/5'
            >
                {!start && !answers ? (
                    <Introduction
                        discipline={discipline}
                        subject={subject}
                        difficulty={difficulty}
                        questionsLength={content.length}
                        handleClose={() => setClose(true)}
                        handleStart={handleStart}
                    />
                ) : !!answers && currentQuestionId >= content.length ? (
                    <End
                        questions={content}
                        answers={answersList}
                        subject={subject}
                        time={answers ? time_used : time}
                        handleRestart={handleRestart}
                        setClose={setClose}
                    />
                ) : (
                    <>
                        <Display
                            questions={content}
                            currentQuestionId={currentQuestionId}
                        />
                        <Options
                            questions={content}
                            currentQuestionId={currentQuestionId}
                            answerId={answerId}
                            showAnswer={showAnswer}
                            nextQuestion={nextQuestion}
                            toRespond={toRespond}
                            setShowExplanation={setShowExplanation}
                            saveProgress={saveProgress}
                        />
                    </>
                )}
            </main>
        </div>
    );
}
