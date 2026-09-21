import clsx from 'clsx';
import { useEffect, useState } from 'react';

export default function Display({ cards, currentCardID }) {
    const [flipped, setFlipped] = useState(false);

    useEffect(() => {
        setFlipped(false);
    }, [currentCardID]);

    return (
        <div className='flex flex-col h-full w-full items-center justify-center px-7 py-13'>
            <div className='relative flex h-full w-full items-center justify-center font-secundary text-base font-semibold [perspective:1000px]'>
                <div
                    className={clsx(
                        'absolute h-full w-full translate-x-2 translate-y-2 rotate-2 rounded-2xl bg-color1-200 shadow-md transition-opacity duration-500',
                    )}
                />
                <div
                    className={clsx(
                        'relative z-10 h-full w-full transition-transform duration-500 [transform-style:preserve-3d]',
                        flipped && 'rotate-y-180',
                    )}
                    onClick={() => setFlipped(prev => !prev)}
                >
                    <div className='absolute inset-0 flex items-center justify-center rounded-2xl bg-color1-100 text-center text-color4-100 shadow-md [backface-visibility:hidden]'>
                        <span>{cards[currentCardID].question}</span>
                    </div>
                    <div className='absolute inset-0 flex rotate-y-180 items-center justify-center rounded-2xl bg-color4-100 text-center text-color1-100 shadow-md [backface-visibility:hidden]'>
                        <span>{cards[currentCardID].answer}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
