import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import Introduction from './components/introduction';

export default function Guided_exercises({ discipline, subject, difficulty, content, setContent }) {
    const materialRef = useRef(null);
    const [start, setStart] = useState(false);
    const [isClose, setClose] = useState(false);

    function handleStart() {
        setStart(true);
    }

    function handleAnimationEnd(event) {
        if (event.target !== event.currentTarget) return;
        if (isClose) setContent(null);
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
                        questionsLength={content?.length}
                        handleClose={() => setClose(true)}
                        handleStart={handleStart}
                    />
                ) : (
                    <div className='flex flex-1 flex-col items-center justify-center gap-6'>
                        <p className='font-primary text-4xl font-extrabold text-color1-100'>aaaaa</p>
                        <button
                            className='cursor-pointer rounded-xl border-3 border-color1-100 px-8 py-2 font-secundary text-lg font-bold text-color1-100'
                            onClick={() => setClose(true)}
                        >
                            Fechar
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}