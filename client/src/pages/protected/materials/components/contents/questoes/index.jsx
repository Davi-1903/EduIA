import { useEffect, useRef, useState } from 'react';
import Explanation from './components/Explanation';
import Display from './components/Display';
import Options from './components/Options';
import End from './components/End';
import clsx from 'clsx';

export default function Questions({ content, setContent }) {
    const materialRef = useRef(null);
    const [isClose, setClose] = useState(false);
    const [currentQuestionId, setCurrentQuestionId] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);
    const [answerId, setAnswerId] = useState(null);
    const [corrects, setCorrects] = useState(0);

    function nextQuestion() {
        setCurrentQuestionId(prev => prev + 1);
        setShowAnswer(false);
        setAnswerId(null);
    }

    function handleRestart() {
        setCurrentQuestionId(0);
        setShowAnswer(false);
        setAnswerId(null);
        setCorrects(0);
    }

    function toRespond(id) {
        if (answerId !== null) return;

        setShowAnswer(true);
        setAnswerId(id);
        if (id === content[currentQuestionId].correctAnswerId) setCorrects(prev => prev + 1);
    }

    useEffect(() => {
        function handleClick(event) {
            if (!materialRef.current?.contains(event.target)) setClose(true);
        }

        function handleKey(event) {
            if (event.key === 'Escape') setClose(true);
        }

        document.addEventListener('mousedown', handleClick);
        document.addEventListener('keydown', handleKey);
        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('keydown', handleKey);
        };
    }, []);

    return (
        <div
            onAnimationEnd={() => isClose && setContent(null)}
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
                {currentQuestionId < content.length ? (
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
                    <article className='grid h-full place-items-center'>
                        <End
                            questions={content}
                            corrects={corrects}
                            handleRestart={handleRestart}
                            setClose={setClose}
                        />
                    </article>
                )}
            </main>
        </div>
    );
}
