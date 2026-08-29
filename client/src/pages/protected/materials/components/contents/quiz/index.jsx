import { useEffect, useRef, useState } from 'react';
import Introduction from './components/Introduction';
import Display from './components/Display';
import Options from './components/Options';
import End from './components/End';
import clsx from 'clsx';

export default function Quiz({ discipline, subject, difficulty, time, content, setContent }) {
    const materialRef = useRef(null);
    const [start, setStart] = useState(false);
    const [isClose, setClose] = useState(false);
    const [questionId, setQuestionId] = useState(0);
    const [answeredId, setAnsweredId] = useState(null);
    const [itsWrong, setWrong] = useState(false);
    const [corrects, setCorrests] = useState(0);
    const [timeSpent, setTimeSpent] = useState(0);

    function handleStart() {
        setTimeSpent(performance.now());
        setStart(true);
    }

    function handleAnimationEnd(event) {
        if (event.target !== event.currentTarget) return;
        if (isClose) setContent(null);
    }

    function toRespond(isCorrect) {
        if (questionId >= content.length - 1) {
            setTimeSpent(prev => performance.now() - prev);
            setQuestionId(content.length);
        } else {
            setQuestionId(prev => prev + 1);
        }
        if (isCorrect && !itsWrong) setCorrests(prev => prev + 1);
        setAnsweredId(null);
        setWrong(false);
    }

    function handleRestart() {
        setTimeSpent(performance.now());
        setQuestionId(0);
        setCorrests(0);
        setAnsweredId(null);
    }

    function onAnimationEnd() {
        if (answeredId === null) setWrong(true);
        setAnsweredId(content[questionId].correctAnswerId);
    }

    function handleClick(id) {
        if (answeredId === null) setAnsweredId(id);
    }

    useEffect(() => {
        function handleClick(event) {
            if (!materialRef.current?.contains(event.target)) setClose(true);
        }

        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

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
                className='flex h-170 w-full max-w-160 flex-col gap-6 rounded-2xl bg-white p-6 shadow-2xl shadow-color1-100/15 lg:w-4/5'
            >
                {!start ? (
                    <Introduction
                        discipline={discipline}
                        subject={subject}
                        difficulty={difficulty}
                        time={time}
                        questionsLength={content.length}
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
