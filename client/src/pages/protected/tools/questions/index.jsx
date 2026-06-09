import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

export default function GenerateQuestions({ setOpen }) {
    const articleRef = useRef(null);
    const [isClose, setClose] = useState(false);

    function handleAnimationEnd() {
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
    }, []);

    return (
        <div
            onAnimationEnd={handleAnimationEnd}
            className={clsx(
                'fixed inset-0 z-7 grid place-items-center bg-gray-800/20 backdrop-blur-sm',
                isClose ? 'animate-fade-out' : 'animate-fade-in',
            )}
        >
            <form
                ref={articleRef}
                className='flex w-xl flex-col gap-6 rounded-2xl bg-color4-200 px-6 py-12'
            >
                <h2 className='bg-linear-to-tr from-color1-100 to-color4-100 bg-clip-text font-primary text-4xl font-bold text-transparent'>
                    Questões
                </h2>
                <div>
                    <label
                        className='block font-secundary text-base font-bold text-color1-100'
                        htmlFor='disciplina'
                    >
                        Disciplina
                    </label>
                    <select
                        id='disciplina'
                        className='h-12 w-full rounded-lg bg-color4-100 px-4 font-medium text-[#757575] outline-none'
                    >
                        <option value='1'>Opção 1</option>
                        <option value='2'>Opção 2</option>
                        <option value='3'>Opção 3</option>
                        <option value='4'>Opção 4</option>
                        <option value='5'>Opção 5</option>
                        <option value='6'>Opção 6</option>
                    </select>
                </div>
                <div>
                    <label
                        className='block font-secundary text-base font-bold text-color1-100'
                        htmlFor='conteudo'
                    >
                        Conteúdo
                    </label>
                    <input
                        type='text'
                        id='conteudo'
                        placeholder='Descreva o assunto das questões'
                        className='h-12 w-full rounded-lg bg-color4-100 px-4 font-medium outline-none'
                        required
                    />
                </div>
                <div>
                    <label
                        className='block font-secundary text-base font-bold text-color1-100'
                        htmlFor='dificuldade'
                    >
                        Dificuldade
                    </label>
                    <input
                        type='range'
                        id='dificuldade'
                        className='w-full'
                    />
                </div>
                <div>
                    <label
                        className='block font-secundary text-base font-bold text-color1-100'
                        htmlFor='quantidade'
                    >
                        Quantidade
                    </label>
                    <input
                        type='range'
                        id='dificuldade'
                        className='w-full'
                    />
                </div>
                <div>
                    <label
                        className='block font-secundary text-base font-bold text-color1-100'
                        htmlFor='observacoes'
                    >
                        Observações
                    </label>
                    <textarea
                        id='observacoes'
                        className='h-24 w-full resize-none rounded-lg bg-color4-100 px-4 py-2 font-medium outline-none'
                        placeholder='Caso deseje, descreva aqui suas observações'
                    ></textarea>
                </div>
                <button className='h-12 cursor-pointer rounded-lg bg-button text-xl text-color4-100'>Gerar</button>
            </form>
        </div>
    );
}
