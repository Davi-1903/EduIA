import { useEffect, useRef, useState } from 'react';
import InputRange from '../../../../../components/inputRange';
import clsx from 'clsx';

export default function LessonPlanForm({
    discipline,
    subject,
    grade,
    objective,
    time,
    chalkboard,
    projector,
    printed,
    digital,
    note,
    setOpen,
}) {
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

    const resources = [
        [chalkboard, 'Quadro e Giz'],
        [projector, 'Projetor multimídia'],
        [printed, 'Atividades impressas'],
        [digital, 'Tecnologias digitais'],
    ];

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
                <h2 className='bg-linear-to-tr from-color1-100 to-color4-100 bg-clip-text font-primary text-3xl font-bold text-transparent 2xl:text-4xl'>
                    Plano de aula
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
                    <label className='font-secundary font-bold text-color1-100'>Ano/Série</label>
                    <input
                        className='h-12 w-full rounded-lg border border-color4-25 px-4 font-medium outline-none'
                        readOnly
                        value={grade}
                    />
                </div>
                <div>
                    <label className='font-secundary font-bold text-color1-100'>Objetivo</label>
                    <textarea
                        className='w-full resize-none rounded-lg border border-color4-25 px-4 py-2 outline-none'
                        readOnly
                        value={objective}
                    />
                </div>
                <div>
                    <label className='font-secundary font-bold text-color1-100'>Duração</label>
                    <InputRange
                        value={time || 0}
                        trueValue={time}
                        setValue={() => {}}
                        formatValue={value => `${value}min`}
                        min={10}
                        max={90}
                    />
                </div>
                <div>
                    <label className='font-secundary font-bold text-color1-100'>Recursos de ensino</label>
                    <div className='grid grid-cols-2 gap-x-8 pl-2'>
                        {resources.map(([checked, label]) => (
                            <label
                                key={label}
                                className='flex items-center gap-2 font-secundary text-sm text-color1-100'
                            >
                                <input
                                    type='checkbox'
                                    checked={Boolean(checked)}
                                    readOnly
                                    className='accent-color1-100'
                                />
                                {label}
                            </label>
                        ))}
                    </div>
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
