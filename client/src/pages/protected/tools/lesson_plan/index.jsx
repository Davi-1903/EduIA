import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { disciplinasList } from '../../../../../public/assets/data/disciplinas';
import { useMessages } from '../../../../context/messagesContext';
import { POST } from '../../../../api/materials';
import InputRange from '../../../../components/inputRange';
import clsx from 'clsx';
import LoadingMaterial from '../../../../components/loadingMaterial';

const labelClass = 'font-secundary font-bold text-color1-100';
const fieldClass =
    'w-full rounded-lg border border-gray-300 bg-color4-200 px-4 py-2 text-base text-color1-100 outline-none focus:ring-2 focus:ring-color1-400';
const checkLabelClass = 'flex items-center gap-2 py-1 font-secundary text-sm text-color1-100';
const checkClass = 'size-5 shrink-0 accent-color1-100';

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
    const [animation, setAnimation] = useState(false);
    const navigate = useNavigate();

    function handleAnimationEnd() {
        if (isClose) setOpen(false);
    }

    function formatTime(value) {
        return `${value}min`;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const timeID = setTimeout(() => {
            setLoading(true);
            setAnimation(true);
        }, 200);

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
            clearTimeout(timeID);
        }
    }

    useEffect(() => {
        function handleClick(event) {
            if (articleRef.current && !articleRef.current.contains(event.target)) setClose(true);
        }

        function handleKey(event) {
            if (event.key === 'Escape') setClose(true);
        }

        // trava o scroll do fundo enquanto o modal estiver aberto
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        document.addEventListener('pointerdown', handleClick);
        document.addEventListener('keydown', handleKey);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('pointerdown', handleClick);
            document.removeEventListener('keydown', handleKey);
        };
    }, []);

    return (
        <>
            {animation && (
                <LoadingMaterial
                    message='Gerando o plano de aula...'
                    isLoading={isLoading}
                    setAnimation={setAnimation}
                />
            )}
            <div
                onAnimationEnd={handleAnimationEnd}
                className={clsx(
                    'fixed inset-0 z-7 overflow-y-auto overscroll-contain bg-gray-800/20 backdrop-blur-sm',
                    isClose ? 'animate-fade-out' : 'animate-fade-in',
                )}
            >
                <div className='flex min-h-dvh items-center justify-center p-3 sm:p-4'>
                    <form
                        className='flex w-full max-w-xl flex-col gap-4 rounded-2xl bg-color4-200 px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:gap-4.5 sm:py-8 lg:px-6'
                        ref={articleRef}
                        onSubmit={handleSubmit}
                    >
                        <h2 className='bg-linear-to-tr from-color1-100 to-color4-100 bg-clip-text font-primary text-2xl font-bold text-transparent sm:text-3xl 2xl:text-4xl'>
                            Plano de aula
                        </h2>

                        <div className='flex flex-col'>
                            <label
                                htmlFor='disciplina'
                                className={labelClass}
                            >
                                Disciplina
                            </label>
                            <select
                                id='disciplina'
                                className={clsx(fieldClass, 'h-12 font-medium')}
                                value={discipline}
                                onChange={e => setDiscipline(e.target.value)}
                            >
                                {Object.entries(disciplinasList).map(([key, disciplinas]) => (
                                    <optgroup
                                        key={key}
                                        label={key}
                                    >
                                        {disciplinas.map(disciplina => (
                                            <option
                                                key={disciplina}
                                                value={disciplina}
                                            >
                                                {disciplina}
                                            </option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>
                        </div>

                        <div className='flex flex-col'>
                            <label
                                htmlFor='conteudo'
                                className={labelClass}
                            >
                                Conteúdo
                            </label>
                            <input
                                id='conteudo'
                                type='text'
                                placeholder='Descreva o assunto da aula'
                                className={fieldClass}
                                value={subject}
                                onChange={e => setSubject(e.target.value)}
                                required
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label
                                htmlFor='grade'
                                className={labelClass}
                            >
                                Ano/Série
                            </label>
                            <select
                                id='grade'
                                value={grade}
                                onChange={e => setGrade(e.target.value)}
                                className={clsx(fieldClass, 'h-12')}
                                required
                            >
                                <option
                                    value=''
                                    disabled
                                >
                                    Selecione o ano/série
                                </option>
                                <option value='1º ano - Ensino Médio Integrado'>1º ano - Ensino Médio Integrado</option>
                                <option value='2º ano - Ensino Médio Integrado'>2º ano - Ensino Médio Integrado</option>
                                <option value='3º ano - Ensino Médio Integrado'>3º ano - Ensino Médio Integrado</option>
                                <option value='4º ano - Ensino Médio Integrado'>4º ano - Ensino Médio Integrado</option>
                            </select>
                        </div>

                        <div className='flex flex-col'>
                            <label
                                htmlFor='objetivo'
                                className={labelClass}
                            >
                                Objetivo
                            </label>
                            <textarea
                                id='objetivo'
                                placeholder='Descreva os objetivos da aprendizagem'
                                className={clsx(fieldClass, 'h-16 resize-none')}
                                value={objective}
                                onChange={e => setObjective(e.target.value)}
                                required
                            ></textarea>
                        </div>

                        <div className='flex flex-col'>
                            <label className={labelClass}>Duração</label>
                            <InputRange
                                value={time}
                                trueValue={time}
                                setValue={setTime}
                                formatValue={formatTime}
                                min={10}
                                max={90}
                            />
                        </div>

                        <fieldset>
                            <legend className={labelClass}>Recursos de ensino</legend>
                            <div className='grid grid-cols-1 gap-x-8 gap-y-1 pl-2 min-[400px]:grid-cols-2'>
                                <label className={checkLabelClass}>
                                    <input
                                        type='checkbox'
                                        name='recursos'
                                        value='quadro'
                                        checked={chalkboard}
                                        onChange={e => setChalkboard(e.target.checked)}
                                        className={checkClass}
                                    />
                                    Quadro e Giz
                                </label>

                                <label className={checkLabelClass}>
                                    <input
                                        type='checkbox'
                                        name='recursos'
                                        value='projetor'
                                        checked={projector}
                                        onChange={e => setProjector(e.target.checked)}
                                        className={checkClass}
                                    />
                                    Projetor multimídia
                                </label>

                                <label className={checkLabelClass}>
                                    <input
                                        type='checkbox'
                                        name='recursos'
                                        value='atividades'
                                        checked={printed}
                                        onChange={e => setPrinted(e.target.checked)}
                                        className={checkClass}
                                    />
                                    Atividades impressas
                                </label>

                                <label className={checkLabelClass}>
                                    <input
                                        type='checkbox'
                                        name='recursos'
                                        value='tecnologias'
                                        checked={digital}
                                        onChange={e => setDigital(e.target.checked)}
                                        className={checkClass}
                                    />
                                    Tecnologias digitais
                                </label>
                            </div>
                        </fieldset>

                        <div className='flex flex-col'>
                            <label
                                htmlFor='observacoes'
                                className={labelClass}
                            >
                                Observações
                            </label>
                            <textarea
                                id='observacoes'
                                className={clsx(fieldClass, 'h-18 resize-none')}
                                placeholder='Caso deseje, descreva aqui suas observações'
                                value={note}
                                onChange={e => setNote(e.target.value)}
                            ></textarea>
                        </div>

                        <button
                            className='h-12 w-full cursor-pointer rounded-lg bg-button text-lg text-color4-100 transition-all duration-150 not-disabled:hover:shadow-lg-hard disabled:cursor-not-allowed disabled:opacity-60 sm:text-xl'
                            disabled={isLoading}
                        >
                            {isLoading ? 'Gerando...' : 'Gerar'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}