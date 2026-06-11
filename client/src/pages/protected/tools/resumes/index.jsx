import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

export default function GenerateResumes({ setOpen }) {
    const articleRef = useRef(null);
    const [isClose, setClose] = useState(null);

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
            <form
                ref={articleRef}
                className='flex w-xl flex-col gap-5 rounded-2xl bg-white p-8 shadow-lg'
            >
                <h2 className='bg-linear-to-tr from-color1-100 to-color4-100 bg-clip-text font-primary text-4xl font-bold text-transparent'>
                    Resumos
                </h2>
                <div className='flex flex-col gap-5'>
                    <div>
                        <label
                            htmlFor='disciplina'
                            className='block font-secundary text-base font-bold text-color1-100'
                        >
                            Disciplina
                        </label>
                        <select
                            name='disciplina'
                            id='discipina'
                            className='h-12 w-full rounded-lg border border-gray-300 px-4 font-medium text-color1-100 outline-none'
                        >
                            <option value='1'>Opção 1</option>
                        </select>
                    </div>
                    <div>
                        <label
                            htmlFor='conteudo'
                            className='block font-secundary text-base font-bold text-color1-100'
                        >
                            Assunto
                        </label>
                        <input
                            type='text'
                            placeholder='Descreva o assunto'
                            className='w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-color1-400'
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor='observacao'
                            className='font-secundary text-base font-bold text-color1-100'
                        >
                            Observação
                        </label>
                        <textarea
                            name='observacao'
                            placeholder='Caso deseje, escreva suas observações'
                            className='block h-30 w-full resize-none rounded-lg bg-color4-200 p-3 outline-none focus:ring-2 focus:ring-color1-400'
                        ></textarea>
                    </div>
                </div>
                <button className='h-12 cursor-pointer rounded-lg bg-button text-xl text-color4-100 transition-all duration-150 hover:shadow-lg-hard'>
                    Gerar
                </button>
            </form>
        </div>
    );
}
