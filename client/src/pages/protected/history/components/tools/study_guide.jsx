import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

export default function StudyGuideForm({ discipline, subject, note, setOpen }) {
    const articleRef = useRef(null);
    const [isClose, setClose] = useState(false);

    useEffect(() => {
        function handleClick(event) {
            if (!articleRef.current.contains(event.target)) setClose(true);
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
            onAnimationEnd={() => isClose && setOpen(false)}
            className={clsx(
                'fixed inset-0 z-7 grid place-items-center bg-gray-800/20 backdrop-blur-sm',
                isClose ? 'animate-fade-out' : 'animate-fade-in',
            )}
        >
            <article
                ref={articleRef}
                className='flex w-full max-w-xl flex-col gap-6 rounded-2xl bg-color4-200 px-4 py-8 lg:px-6'
            >
                <h2 className='bg-linear-to-tr from-color1-100 to-color4-100 bg-clip-text font-primary text-4xl font-bold text-transparent'>
                    Roteiro de estudo
                </h2>
                <div>
                    <label className='font-secundary font-bold text-color1-100'>Disciplina</label>
                    <input
                        className='h-12 w-full rounded-lg border border-color4-25 px-4 font-medium outline-none'
                        readOnly
                        value={discipline}
                    />
                </div>
                <div>
                    <label className='font-secundary font-bold text-color1-100'>Conteúdo</label>
                    <input
                        className='h-12 w-full rounded-lg border border-color4-25 px-4 font-medium outline-none'
                        readOnly
                        value={subject}
                    />
                </div>
                <div>
                    <label className='font-secundary font-bold text-color1-100'>Observações</label>
                    <textarea
                        className='h-24 w-full resize-none rounded-lg border border-color4-25 px-4 py-2 outline-none'
                        readOnly
                        value={note}
                    />
                </div>
            </article>
        </div>
    );
}
