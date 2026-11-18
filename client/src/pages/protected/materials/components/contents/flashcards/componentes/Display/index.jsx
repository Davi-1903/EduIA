import clsx from 'clsx';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remakerBreaks from 'remark-breaks';

export default function Display({ cards, currentCardID }) {
    const [flipped, setFlipped] = useState(false);
    const normalize = str => str.replace(/\\n/g, '\n');

    useEffect(() => {
        setFlipped(false);
    }, [currentCardID]);

    return (
        <div className='flex h-full w-full flex-col items-center justify-center px-7 py-13'>
            <div className='relative flex h-full w-full items-center justify-center font-secundary text-base font-semibold perspective-[1000px]'>
                <div
                    className={clsx(
                        'absolute h-full w-full translate-x-2 translate-y-2 rotate-2 rounded-2xl bg-color1-200 shadow-md transition-opacity duration-500',
                    )}
                />
                <div
                    className={clsx(
                        'relative z-10 h-full w-full transition-transform duration-500 transform-3d',
                        'relative z-10 h-full w-full transition-transform duration-500 transform-3d',
                        flipped && 'rotate-y-180',
                    )}
                    onClick={() => setFlipped(prev => !prev)}
                >
                    <div className='absolute inset-0 flex items-center justify-center rounded-2xl bg-color1-100 px-4 text-center text-color4-100 shadow-md backface-hidden'>
                        <ReactMarkdown remarkPlugins={[remakerBreaks]}>
                            {normalize(cards[currentCardID].question)}
                        </ReactMarkdown>
                    </div>
                    <div className='absolute inset-0 flex rotate-y-180 items-center justify-center rounded-2xl bg-color4-100 px-4 text-justify text-color1-100 shadow-md backface-hidden'>
                        <ReactMarkdown remarkPlugins={[remakerBreaks]}>
                            {normalize(cards[currentCardID].answer)}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    );
}
