import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { disciplinasList } from '../../../../../public/assets/data/disciplinas';
import { useMessages } from '../../../../context/messagesContext';
import { POST } from '../../../../api/materials';
import InputRange from '../../../../components/inputRange';
import clsx from 'clsx';

export default function GenerateLessonPlan({ setOpen }) {
    const articleRef = useRef(null);
    const { setMessages } = useMessages();
    const [discipline, setDiscipline] = useState('Língua Portuguesa e Literatura');
    const [subject, setSubject] = useState('');
    const [grade, setGrade] = useState('');
    const [objective, setObjective] = useState('');
    const [time, setTime] = useState(10);
    const [chalkboard, setChalkboard] = useState(false);
    const [projector, setProjector] = useState(false);
    const [printed, setPrinted] = useState(false);
    const [digital, setDigital] = useState(false);
    const [note, setNote] = useState('');
    const [isClose, setClose] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();

    function handleAnimationEnd() {
        if (isClose) setOpen(false);
    }

    function formatTime(value) {
        return `${value}min`;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await POST('/api/materials/plano_de_aula/', {
                discipline,
                subject,
                grade,
                objective,
                duration: time,
                chalkboard,
                projector,
                printed,
                digital,
                note,
            });

            if (response.status !== 201) throw new Error(response.message);

            document.body.style.overflowY = 'auto';
            navigate(response.redirect);

            setMessages(prev => [
                ...prev,
                {
                    id: prev.length + 1,
                    message: 'Plano de aula criado com sucesso!',
                    type: 'ok',
                },
            ]);
        } catch (err) {
            setMessages(prev => [
                ...prev,
                {
                    id: prev.length + 1,
                    message: err.message,
                    type: 'danger',
                },
            ]);
        } finally {
            setLoading(false);
        }
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
                onSubmit={handleSubmit}
            >
                <h2 className='bg-linear-to-tr from-color1-100 to-color4-100 bg-clip-text font-primary text-3xl font-bold text-transparent 2xl:text-4xl'>
                    Plano de aula
                </h2>

                <div>
                    <label className='font-secundary font-bold text-color1-100'>Disciplina</label>
                    <select
                        id='disciplina'
                        className='h-12 w-full rounded-lg border border-gray-300 px-4 font-medium text-color1-100 outline-none'
                        value={discipline}
                        onChange={e => setDiscipline(e.target.value)}
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
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        required
                    />
                </div>

                <div className='flex flex-col'>
                    <label className='font-secundary font-bold text-color1-100'>Ano/Série</label>
                    <input
                        type='text'
                        placeholder='Ano ou série da turma'
                        className='required rounded-lg border border-gray-300 bg-color4-200 px-4 py-2 outline-none focus:ring-2 focus:ring-color1-400'
                        value={grade}
                        onChange={e => setGrade(e.target.value)}
                        required
                    />
                </div>

                <div className='flex flex-col'>
                    <label className='font-secundary font-bold text-color1-100'>Objetivo</label>
                    <textarea
                        placeholder='Descreva os objetivos da aprendizagem'
                        className='resize-none rounded-lg border border-gray-300 bg-color4-200 px-4 py-2 outline-none focus:ring-2 focus:ring-color1-400'
                        value={objective}
                        onChange={e => setObjective(e.target.value)}
                        required
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
                                checked={chalkboard}
                                onChange={e => setChalkboard(e.target.checked)}
                                className='accent-color1-100'
                            />
                            Quadro e Giz
                        </label>

                        <label className='flex items-center gap-2 font-secundary text-sm text-color1-100'>
                            <input
                                type='checkbox'
                                name='recursos'
                                value='projetor'
                                checked={projector}
                                onChange={e => setProjector(e.target.checked)}
                                className='accent-color1-100'
                            />
                            Projetor multimídia
                        </label>

                        <label className='flex items-center gap-2 font-secundary text-sm text-color1-100'>
                            <input
                                type='checkbox'
                                name='recursos'
                                value='atividades'
                                checked={printed}
                                onChange={e => setPrinted(e.target.checked)}
                                className='accent-color1-100'
                            />
                            Atividades impressas
                        </label>

                        <label className='flex items-center gap-2 font-secundary text-sm text-color1-100'>
                            <input
                                type='checkbox'
                                name='recursos'
                                value='tecnologias'
                                checked={digital}
                                onChange={e => setDigital(e.target.checked)}
                                className='accent-color1-100'
                            />
                            Tecnologias digitais
                        </label>
                    </div>
                </div>

                <div className='flex flex-col'>
                    <label className='font-secundary font-bold text-color1-100'>Observações</label>
                    <textarea
                        className='h-24 w-full resize-none rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-color1-400'
                        placeholder='Caso deseje, descreva aqui suas observações'
                        value={note}
                        onChange={e => setNote(e.target.value)}
                    ></textarea>
                </div>

                <button
                    className='h-12 cursor-pointer rounded-lg bg-button text-xl text-color4-100 transition-all duration-150 not-disabled:hover:shadow-lg-hard disabled:cursor-not-allowed disabled:opacity-60'
                    disabled={isLoading}
                >
                    {isLoading ? 'Gerando...' : 'Gerar'}
                </button>
            </form>
        </div>
    );
}
