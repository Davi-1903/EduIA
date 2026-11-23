import { useEffect, useRef, useState } from 'react';
import Introduction from './components/Introduction';
import Display from './components/Display';
import Options from './components/Options';
import End from './components/End';
import PreviousResult from './components/PreviousResult';
import clsx from 'clsx';
import { POST } from '../../../../../../api/materials';

export default function Quiz({
    quizId,
    attempts = [],
    onSaved,
    discipline,
    subject,
    difficulty,
    time,
    content,
    setContent,
}) {
    const materialRef = useRef(null);
    const responsesRef = useRef([]);
    const [start, setStart] = useState(false);
    const [isClose, setClose] = useState(false);
    const [questionId, setQuestionId] = useState(0);
    const [answeredId, setAnsweredId] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [itsWrong, setWrong] = useState(false);
    const [corrects, setCorrests] = useState(0);
    const [timeSpent, setTimeSpent] = useState(0);
    const [retaking, setRetaking] = useState(false);
    const [reviewId, setReviewId] = useState(0);
    const [reviewDone, setReviewDone] = useState(false);

    const lastAttempt = attempts[attempts.length - 1];
    const reviewAnswers = Object.fromEntries(
        (lastAttempt?.details ?? []).map(detail => [detail.questionId, detail.answerId]),
    );
    const isReviewing = !start && attempts.length > 0 && !retaking && !reviewDone;

    async function submitAttempt(answers) {
        try {
            const data = await POST(`/api/materials/quiz/${quizId}/attempts`, { answers });
            if (data.status === 201) onSaved?.();
            else console.error('Falha ao salvar tentativa', data.message);
        } catch (error) {
            console.error('Falha ao salvar tentativa', error);
        }
    }

    function handleStart() {
        responsesRef.current = [];
        setTimeSpent(performance.now());
        setStart(true);
    }

    function handleAnimationEnd(event) {
        if (event.target !== event.currentTarget) return;
        if (isClose) setContent(null);
    }

    function toRespond(isCorrect) {
        responsesRef.current = [...responsesRef.current, { questionId: content[questionId].id, answerId: answeredId }];

        if (questionId >= content.length - 1) {
            setTimeSpent(prev => performance.now() - prev);
            setQuestionId(content.length);
            submitAttempt(responsesRef.current);
        } else {
            setQuestionId(prev => prev + 1);
        }
        if (isCorrect && !itsWrong) setCorrests(prev => prev + 1);
        setAnsweredId(null);
        setShowAnswer(false);
        setWrong(false);
    }

    function handleRestart() {
        responsesRef.current = [];
        setTimeSpent(performance.now());
        setQuestionId(0);
        setCorrests(0);
        setAnsweredId(null);
    }

    function onAnimationEnd() {
        if (answeredId === null) setWrong(true);
        setShowAnswer(true);
    }

    function handleClick(id) {
        if (answeredId === null) setAnsweredId(id);
    }

    function handleReviewNext() {
        if (reviewId >= content.length - 1) setReviewDone(true);
        else setReviewId(prev => prev + 1);
    }

    useEffect(() => {
        function handleClick(event) {
            if (
                !materialRef.current?.contains(event.target) &&
                (!start || questionId >= content.length || confirm('Deseja parar de responder as questões?'))
            )
                setClose(true);
        }

        function handleKey(event) {
            if (
                event.key === 'Escape' &&
                (!start || questionId >= content.length || confirm('Deseja parar de responder as questões?'))
            )
                setClose(true);
        }

        document.addEventListener('mousedown', handleClick);
        document.addEventListener('keydown', handleKey);
        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('keydown', handleKey);
        };
    }, [start, content.length, questionId]);

    return (
        <div
            onAnimationEnd={handleAnimationEnd}
            className={clsx(
                'fixed inset-0 z-7 grid place-items-center bg-gray-800/20 backdrop-blur-sm',
                isClose ? 'animate-fade-out' : 'animate-fade-in',
            )}
        >
            <main
                ref={materialRef}
                className='flex min-h-170 w-full max-w-160 flex-col gap-3 rounded-2xl bg-white p-4 shadow-2xl shadow-color1-100/15 md:gap-6 md:p-6 lg:w-4/5'
            >
                {isReviewing ? (
                    <>
                        <Display currentQuestionId={reviewId} questions={content} review />
                        <Options
                            questions={content}
                            currentQuestionId={reviewId}
                            answeredId={reviewAnswers[content[reviewId].id] ?? null}
                            showAnswer={true}
                            toRespond={handleReviewNext}
                            handleClick={() => {}}
                        />
                    </>
                ) : !start && attempts.length > 0 && !retaking ? (
                    <PreviousResult
                        questions={content}
                        attempts={attempts}
                        onRetake={() => {
                            setRetaking(true);
                            handleStart();
                        }}
                        onBack={() => setClose(true)}
                    />
                ) : !start ? (
                    <Introduction
                        discipline={discipline}
                        subject={subject}
                        difficulty={difficulty}
                        time={time}
                        questionsLength={content.length}
                        handleClose={() => setClose(true)}
                        handleStart={handleStart}
                    />
                ) : questionId < content.length ? (
                    <>
                        <Display
                            currentQuestionId={questionId}
                            questions={content}
                            time={time}
                            onAnimationEnd={onAnimationEnd}
                        />
                        <Options
                            questions={content}
                            currentQuestionId={questionId}
                            answeredId={answeredId}
                            showAnswer={showAnswer}
                            toRespond={toRespond}
                            handleClick={handleClick}
                        />
                    </>
                ) : (
                    <End
                        questions={content}
                        corrects={corrects}
                        subject={subject}
                        difficulty={difficulty}
                        time={timeSpent}
                        handleRestart={handleRestart}
                        setClose={setClose}
                    />
                )}
            </main>
        </div>
    );
}