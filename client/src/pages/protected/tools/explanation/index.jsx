import { useEffect, useRef, useState } from 'react';
import { disciplinasList } from '../../../../../public/assets/data/disciplinas';
import { useMessages } from '../../../../context/messagesContext';
import { useNavigate } from 'react-router-dom';
import { POST } from '../../../../api/materials';
import clsx from 'clsx';

export default function GenerateExplanation({ setOpen }) {
    const articleRef = useRef(null);
    const [isClose, setClose] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setMessages } = useMessages();
    const [subject, setSubject] = useState('');
    const [questions, setQuestion] = useState('');
    const [discipline, setDiscipline] = useState('Língua Portuguesa e Literatura');

    function handleAnimatedEnd() {
        if (isClose) setOpen(false);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await POST('api/materials/explicacoes', {
                discipline,
                subject,
                questions,
            });
            if (response.status !== 201) throw new Error(response.message);
            document.body.style.overflowY = 'auto';
            navigate(response.redirect);
            setMessages(prev => [
                ...prev,
                {
                    id: prev.length + 1,
                    message: 'Explicação criada com sucesso!',
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
                className='flex w-full max-w-xl flex-col gap-6 rounded-2xl bg-color4-200 px-4 py-8 lg:px-6'
                onSubmit={handleSubmit}
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
                        <select
                            name='discipline'
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
                            className='w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-color1-400'
                            value={subject}
                            onChange={e => setSubject(e.target.value)}
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
                            className='h-30 w-full resize-none rounded-lg border border-color4-25 p-3 outline-none focus:ring-2 focus:ring-color1-400'
                            placeholder='Escreva aqui...'
                            value={questions}
                            onChange={e => setQuestion(e.target.value)}
                        ></textarea>
                    </div>
                    <button
                        className='h-12 cursor-pointer rounded-lg bg-button text-xl text-color4-100 transition-all duration-150 not-disabled:hover:shadow-lg-hard disabled:cursor-not-allowed disabled:opacity-60'
                        disabled={isLoading}
                    >
                        {isLoading ? 'Gerando...' : 'Gerar'}
                    </button>
                </div>
            </form>
        </div>
    );
}
