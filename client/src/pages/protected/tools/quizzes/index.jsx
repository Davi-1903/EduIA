import { useEffect, useRef, useState } from 'react';
import { disciplinasList } from '../../../../../public/assets/data/disciplinas';
import InputRange from '../../../../components/inputRange';
import clsx from 'clsx';

export default function GenerateQuizzes({ setOpen }) {
    const articleRef = useRef(null);
    const [isClose, setClose] = useState(false);
    const [dificuldade, setDificuldade] = useState(0);
    const [quantidade, setQuantidade] = useState(5);
    const [time, setTime] = useState(10);
    const dificuldades = ['Muito fácil', 'Fácil', 'Médio', 'Difícil', 'Muito difícil'];

    function formatTime(value) {
        return `${value}s`;
    }

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
            <form
                ref={articleRef}
                className='flex w-xl flex-col gap-6 rounded-2xl bg-color4-200 px-6 py-12'
            >
                <h2 className='bg-linear-to-tr from-color1-100 to-color4-100 bg-clip-text font-primary text-4xl font-bold text-transparent'>
                    Quizzes
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
                        className='h-12 w-full rounded-lg border border-color4-25 px-4 font-medium text-color1-100 outline-none'
                    >
                        {Object.entries(disciplinasList).map(([key, disciplinas]) => (
                            <optgroup label={key}>
                                {disciplinas.map(disciplina => (
                                    <option value={disciplina}>{disciplina}</option>
                                ))}
                            </optgroup>
                        ))}
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
                        className='h-12 w-full rounded-lg border border-color4-25 px-4 font-medium outline-none'
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
                        value={dificuldades[dificuldade]}
                        trueValue={dificuldade}
                        setValue={setDificuldade}
                        steps={1}
                        min={0}
                        max={4}
                    />
                </div>
                <div>
                    <label
                        className='block font-secundary text-base font-bold text-color1-100'
                        htmlFor='tempo'
                    >
                        Tempo por pergunta
                    </label>
                    <InputRange
                        value={time}
                        trueValue={time}
                        setValue={setTime}
                        formatValue={formatTime}
                        min={10}
                        max={60}
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
                        value={quantidade}
                        trueValue={quantidade}
                        setValue={setQuantidade}
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
                        className='h-24 w-full resize-none rounded-lg border border-color4-25 px-4 py-2 font-medium outline-none'
                        placeholder='Caso deseje, descreva aqui suas observações'
                    ></textarea>
                </div>
                <button className='h-12 cursor-pointer rounded-lg bg-button text-xl text-color4-100 transition-all duration-150 hover:shadow-lg-hard'>
                    Gerar
                </button>
            </form>
        </div>
    );
}
