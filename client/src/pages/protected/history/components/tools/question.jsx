import { useEffect, useRef, useState } from 'react';
import InputRange from '../../../../../components/inputRange';
import clsx from 'clsx';

export default function QuestionForm({ discipline, subject, difficulty, amount, note, setOpen }) {
    const articleRef = useRef(null);
    const [isClose, setClose] = useState(false);
    const difficulties = ['Muito fácil', 'Fácil', 'Médio', 'Difícil', 'Muito difícil'];

    function formatQuantidade(value) {
        return String(value).padStart(2, '0');
    }

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
            <article
                ref={articleRef}
                className='flex w-full max-w-xl flex-col gap-6 rounded-2xl bg-color4-200 px-4 py-8 lg:px-6'
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
                    <input
                        type='text'
                        id='disciplina'
                        className='h-12 w-full rounded-lg border border-color4-25 px-4 font-medium text-color1-100 outline-none'
                        readOnly
                        value={discipline}
                    />
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
                        className='h-12 w-full rounded-lg border border-color4-25 px-4 font-medium outline-none focus:ring-2 focus:ring-color1-400'
                        readOnly
                        value={subject}
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
                    <InputRange
                        value={difficulty}
                        trueValue={difficulties.indexOf(difficulty)}
                        setValue={() => {}}
                        steps={1}
                        min={0}
                        max={4}
                    />
                </div>
                <div>
                    <label
                        className='block font-secundary text-base font-bold text-color1-100'
                        htmlFor='quantidade'
                    >
                        Quantidade
                    </label>
                    <InputRange
                        value={amount}
                        trueValue={amount}
                        setValue={() => {}}
                        formatValue={formatQuantidade}
                        max={50}
                        min={5}
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
                        className='h-24 w-full resize-none rounded-lg border border-color4-25 px-4 py-2 outline-none focus:ring-2 focus:ring-color1-400'
                        placeholder='Nenhuma observação'
                        readOnly
                        value={note}
                    ></textarea>
                </div>
            </article>
        </div>
    );
}
