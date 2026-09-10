import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import Display from './Display';

export default function FlashCards({ discipline, subject, difficulty, content, setContent }) {
    const materialRef = useRef(null);
    const [isClose, setClose] = useState(false);
    const [currentCardID, setCurrentCardID] = useState(0);

    function nextCard() {
        if (currentCardID >= content.length - 1) {
            setCurrentCardID(content.length);
        } else {
            setCurrentCardID(prev => prev + 1);
        }
    }

    function handleAnimationEnd(event) {
        if (event.target !== event.currentTarget) return;
        if (isClose) setContent(null);
    }

    useEffect(() => {
        function handleClick() {
            setClose(true);
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
                <Display
                    cards={content}
                    currentCardsID={currentCardID}
                />
            </main>
        </div>
    );
}
