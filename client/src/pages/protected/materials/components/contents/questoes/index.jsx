import { useEffect, useRef, useState } from 'react';
import Explanation from './components/Explanation';
import Display from './components/Display';
import Options from './components/Options';
import End from './components/End';
import clsx from 'clsx';
import Introduction from './components/Introduction';

export default function Questions({ discipline, subject, difficulty, content, setContent }) {
    const materialRef = useRef(null);
    const [start, setStart] = useState(false);
    const [isClose, setClose] = useState(false);
    const [currentQuestionId, setCurrentQuestionId] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);
    const [answerId, setAnswerId] = useState(null);
    const [corrects, setCorrects] = useState(0);
    const [time, setTime] = useState(0);

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
        setCurrentQuestionId(0);
        setTime(performance.now());
        setShowAnswer(false);
        setAnswerId(null);
        setCorrects(0);
        setShowExplanation(false);
    }

    function toRespond(id) {
        if (answerId !== null) return;

        setShowAnswer(true);
        setAnswerId(id);
        if (id === content[currentQuestionId].correctAnswerId) setCorrects(prev => prev + 1);
    }

    useEffect(() => {
        function handleClick(event) {
            if (showExplanation) return;
            if (!materialRef.current?.contains(event.target)) setClose(true);
        }

        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [showExplanation]);

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
                className='flex h-170 w-full max-w-160 flex-col gap-6 rounded-2xl bg-white p-6 shadow-2xl shadow-color1-100/15 lg:w-4/5'
            >
                {!start ? (
                    <Introduction
                        discipline={discipline}
                        subject={subject}
                        difficulty={difficulty}
                        questionsLength={content.length}
                        handleClose={() => setClose(true)}
                        handleStart={handleStart}
                    />
                ) : currentQuestionId < content.length ? (
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
                        />
                    </>
                ) : (
                    <End
                        questions={content}
                        corrects={corrects}
                        subject={subject}
                        difficulty={difficulty}
                        time={time}
                        handleRestart={handleRestart}
                        setClose={setClose}
                    />
                )}
            </main>
        </div>
    );
}
