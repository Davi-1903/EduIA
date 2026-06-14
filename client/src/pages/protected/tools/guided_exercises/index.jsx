import { useEffect, useState, useRef } from 'react';
import { disciplinasList } from '../../../../../public/assets/data/disciplinas';
import InputRange from '../../../../components/inputRange';
import clsx from 'clsx';

export default function GenerateQuidedExercises({ setOpen }) {
    const articleRef = useRef(null);
    const [isClose, setClose] = useState(false);
    const [dificuldade, setDificuldade] = useState(0);
    const [quantidade, setQuantidade] = useState(5);
    const dificuldades = ['Muito fácil', 'Fácil', 'Médio', 'Difícil', 'Muito difícil'];

    function handleAnimationEnd() {
        if (isClose) setOpen(false);
    }

    function formatQuantidade(value) {
        return String(value).padStart(2, '0');
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
                className='flex w-xl flex-col gap-6 rounded-2xl bg-color4-200 px-6 py-12'
                ref={articleRef}
            >
                <h2 className='bg-linear-to-tr from-color1-100 to-color4-100 bg-clip-text font-primary text-4xl font-bold text-transparent'>
                    Plano de aula
                </h2>
                <div>
                    <label className='font-secundary font-bold text-color1-100'>Disciplina</label>
                    <select
                        id='disciplina'
                        className='h-12 w-full rounded-lg border border-gray-300 px-4 font-medium text-color1-100 outline-none'
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
                <div className='flex flex-col'>
                    <label className='font-secundary font-bold text-color1-100'>Conteúdo</label>
                    <input
                        type='text'
                        placeholder='Descreva o assunto da aula'
                        className='required rounded-lg border border-gray-300 bg-color4-200 px-4 py-2 outline-none focus:ring-2 focus:ring-color1-400'
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
                    <label className='font-secundary font-bold text-color1-100'>Formato dos exercícios</label>
                    <div className='grid grid-cols-2 gap-x-8 pl-2'>
                        <label className='flex items-center gap-2 font-secundary text-sm text-color1-100'>
                            <input
                                type='checkbox'
                                name='recursos'
                                value='quadro'
                                className='accent-color1-100'
                            />
                            Múltipla escolha
                        </label>

                        <label className='flex items-center gap-2 font-secundary text-sm text-color1-100'>
                            <input
                                type='checkbox'
                                name='recursos'
                                value='projetor'
                                className='accent-color1-100'
                            />
                            Verdadeiro ou falso
                        </label>

                        <label className='flex items-center gap-2 font-secundary text-sm text-color1-100'>
                            <input
                                type='checkbox'
                                name='recursos'
                                value='atividades'
                                className='accent-color1-100'
                            />
                            Discursivo
                        </label>
                    </div>
                </div>
                <div className='flex flex-col'>
                    <label className='font-secundary font-bold text-color1-100'>Observação</label>
                    <textarea
                        placeholder='Escreva algo específico que deseja nos exercícios...'
                        className='resize-none rounded-lg border border-gray-300 bg-color4-200 px-4 py-2 outline-none focus:ring-2 focus:ring-color1-400'
                    ></textarea>
                </div>
                <button className='h-12 cursor-pointer rounded-lg bg-button text-xl text-color4-100 transition-all duration-150 hover:shadow-lg-hard'>
                    Gerar
                </button>
            </form>
        </div>
    );
}
