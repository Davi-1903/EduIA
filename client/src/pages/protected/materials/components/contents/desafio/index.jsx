import { useState } from 'react';
import clsx from 'clsx';
import Display from './components/Display';
import Introduction from './components/Introducion';

export default function Desafio({ id, discipline, subject, difficulty, content, setContent }) {
    const [start, setStart] = useState(false);
    const [isClose, setClose] = useState(false);

    function handleStart() {
        setStart(true);
    }

    function handleAnimationEnd(event) {
        if (event.target !== event.currentTarget) return;
        if (isClose) setContent(null);
    }

    return (
        <div
            onAnimationEnd={handleAnimationEnd}
            className={clsx(
                'fixed inset-0 z-7 grid place-items-center bg-gray-800/20 backdrop-blur-sm',
                isClose ? 'animate-fade-out' : 'animate-fade-in',
            )}
        >
            <main className='flex max-h-[90vh] w-full max-w-2xl flex-col gap-6 overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl shadow-color1-100/15 lg:w-4/5'>
                {!start ? (
                    <Introduction
                        discipline={discipline}
                        subject={subject}
                        difficulty={difficulty}
                        handleClose={() => setClose(true)}
                        handleStart={handleStart}
                    />
                ) : (
                    <Display
                        id={id}
                        content={content}
                        discipline={discipline}
                        subject={subject}
                        setClose={setClose}
                    />
                )}
            </main>
        </div>
    );
}
