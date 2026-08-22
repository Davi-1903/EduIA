import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

export default function ExplanationForm({ discipline, subject, questions, setOpen }) {
    const articleRef = useRef(null);
    const [isClose, setClose] = useState(false);

    function handleAnimatedEnd() {
        if (isClose) setOpen(false);
    }

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
    });

    return (
        <div
            onAnimationEnd={handleAnimatedEnd}
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
                    Explicação
                </h2>
                <div className='flex flex-col gap-5'>
                    <div>
                        <label
                            htmlFor='discipline'
                            className='block font-primary font-bold text-color1-100'
                        >
                            Disciplina
                        </label>
                        <input
                            type='text'
                            id='disciplina'
                            className='h-12 w-full rounded-lg border border-gray-300 px-4 font-medium outline-none'
                            readOnly
                            value={discipline}
                        />
                    </div>
                    <div>
                        <label
                            htmlFor='subject'
                            className='block font-primary font-bold text-color1-100'
                        >
                            Assunto
                        </label>
                        <input
                            type='text'
                            name='subject'
                            placeholder='Descreva o assunto'
                            className='w-full rounded-lg border border-gray-300 px-4 py-2 font-medium outline-none'
                            readOnly
                            value={subject}
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor='questions'
                            className='font-primary font-bold text-color1-100'
                        >
                            Qual a sua dúvida?
                        </label>
                        <textarea
                            name='questions'
                            className='h-30 w-full resize-none rounded-lg border border-color4-25 p-3 outline-none'
                            placeholder='Nenhuma dúvida fornecida'
                            readOnly
                            value={questions}
                        ></textarea>
                    </div>
                </div>
            </article>
        </div>
    );
}
