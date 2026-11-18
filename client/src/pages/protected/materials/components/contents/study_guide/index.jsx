import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import Introduction from './components/Introduction';
import Guide from './components/Guide';

export default function StudyGuide({ discipline, subject, grade, duration, content, setContent }) {
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
                className={clsx(
                    'flex max-h-170 w-full max-w-160 flex-col gap-6 overflow-y-auto rounded-2xl lg:w-4/5',
                    !start && 'bg-white p-6 shadow-2xl shadow-color1-100/15',
                )}
            >
                {!start ? (
                    <Introduction
                        discipline={discipline}
                        subject={subject}
                        grade={grade}
                        duration={duration}
                        handleClose={() => setClose(true)}
                        handleStart={handleStart}
                    />
                ) : (
                    <Guide
                        discipline={discipline}
                        subject={subject}
                        content={content}
                    />
                )}
            </main>
        </div>
    );
}
