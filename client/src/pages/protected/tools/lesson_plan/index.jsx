import { useEffect, useState, useRef } from 'react';
import { disciplinasList } from '../../../../../public/assets/data/disciplinas';
import InputRange from '../../../../components/inputRange';
import clsx from 'clsx';

export default function GenerateLessonPlan({ setOpen }) {
    const articleRef = useRef(null);
    const [isClose, setClose] = useState(false);
    const [time, setTime] = useState(10);

    function handleAnimationEnd() {
        if (isClose) setOpen(false);
    }

    function formatTime(value) {
        return `${value}min`;
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
                className='flex w-full max-w-xl flex-col gap-6 rounded-2xl bg-color4-200 px-4 py-8 lg:px-6'
                ref={articleRef}
            >
                <h2 className='bg-linear-to-tr from-color1-100 to-color4-100 bg-clip-text font-primary text-3xl font-bold text-transparent 2xl:text-4xl'>
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
                <div className='flex flex-col'>
                    <label className='font-secundary font-bold text-color1-100'>Ano/Série</label>
                    <input
                        type='text'
                        placeholder='Ano ou série da turma'
                        className='required rounded-lg border border-gray-300 bg-color4-200 px-4 py-2 outline-none focus:ring-2 focus:ring-color1-400'
                    />
                </div>
                <div className='flex flex-col'>
                    <label className='font-secundary font-bold text-color1-100'>Objetivo</label>
                    <textarea
                        placeholder='Descreva os objetivos da aprendizagem'
                        className='resize-none rounded-lg border border-gray-300 bg-color4-200 px-4 py-2 outline-none focus:ring-2 focus:ring-color1-400'
                    ></textarea>
                </div>
                <div className='flex flex-col'>
                    <label className='font-secundary font-bold text-color1-100'>Duração</label>
                    <InputRange
                        value={time}
                        trueValue={time}
                        setValue={setTime}
                        formatValue={formatTime}
                        min={10}
                        max={90}
                    />
                </div>
                <div>
                    <label className='font-secundary font-bold text-color1-100'>Recursos de ensino</label>
                    <div className='grid grid-cols-2 gap-x-8 pl-2'>
                        <label className='flex items-center gap-2 font-secundary text-sm text-color1-100'>
                            <input
                                type='checkbox'
                                name='recursos'
                                value='quadro'
                                className='accent-color1-100'
                            />
                            Quadro e Giz
                        </label>

                        <label className='flex items-center gap-2 font-secundary text-sm text-color1-100'>
                            <input
                                type='checkbox'
                                name='recursos'
                                value='projetor'
                                className='accent-color1-100'
                            />
                            Projetor multimídia
                        </label>

                        <label className='flex items-center gap-2 font-secundary text-sm text-color1-100'>
                            <input
                                type='checkbox'
                                name='recursos'
                                value='atividades'
                                className='accent-color1-100'
                            />
                            Atividades impressas
                        </label>

                        <label className='flex items-center gap-2 font-secundary text-sm text-color1-100'>
                            <input
                                type='checkbox'
                                name='recursos'
                                value='tecnologias'
                                className='accent-color1-100'
                            />
                            Tecnologias digitais
                        </label>
                    </div>
                </div>
                <button className='h-10 cursor-pointer rounded-lg bg-button text-xl text-color4-100 transition-all duration-150 hover:shadow-lg-hard 2xl:h-12'>
                    Gerar
                </button>
            </form>
        </div>
    );
}
