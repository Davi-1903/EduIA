import { useEffect, useRef, useState } from 'react';
import { IconCopy } from '@tabler/icons-react';
import clsx from 'clsx';

export default function Explanation({ explanation, setShowExplanation }) {
    const [isClose, setClose] = useState(false);
    const articleRef = useRef(null);

    async function copyExplanation() {
        try {
            await navigator.clipboard.writeText(explanation);
            alert('Explicação copiada!');
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        function handleClick(event) {
            if (!articleRef.current.contains(event.target)) {
                setClose(true);
            }
        }

        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    return (
        <section
            className={clsx(
                'fixed inset-0 z-1 grid place-items-center bg-gray-800/20 backdrop-blur-sm',
                isClose ? 'fade-out-animation' : 'fade-in-animation',
            )}
            onAnimationEnd={() => isClose && setShowExplanation(false)}
        >
            <article
                ref={articleRef}
                className='relative w-sm rounded-2xl bg-white p-8 pt-12 text-center text-[1.2rem] font-semibold text-color1-100 shadow-2xl'
            >
                <button
                    className='absolute top-2 right-2 cursor-pointer rounded-lg p-2 transition-all duration-100 hover:bg-gray-300'
                    onClick={copyExplanation}
                >
                    <IconCopy size={24} />
                </button>
                <p>{explanation}</p>
            </article>
        </section>
    );
}
