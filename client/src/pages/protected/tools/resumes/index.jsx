import { useEffect, useRef, useState } from 'react';
import { disciplinasList } from '../../../../../public/assets/data/disciplinas';
import { POST } from '../../../../api/materials';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { useMessages } from '../../../../context/messagesContext';

export default function GenerateResumes({ setOpen }) {
    const articleRef = useRef(null);
    const [isClose, setClose] = useState(null);
    const navigate = useNavigate();
    const { setMessages } = useMessages();
    const [isLoading, setLoading] = useState(false);
    const [discipline, setDiscipline] = useState('Língua Portuguesa e Literatura');
    const [subject, setSubject] = useState('');
    const [note, setNote] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await POST('api/materials/resumos', {
                discipline,
                subject,
                note,
            });
            if (response.status !== 201) throw new Error(response.message);
            document.body.style.overflowY = 'auto';
            navigate(response.redirect);
            setMessages(prev => [
                ...prev,
                {
                    id: prev.lenght + 1,
                    message: 'Resumo criado com sucesso!',
                    type: 'ok',
                },
            ]);
        } catch (err) {
            setMessages(prev => [
                ...prev,
                {
                    id: prev.lenght + 1,
                    message: err.message,
                    type: 'danger',
                },
            ]);
        } finally {
            setLoading(false);
        }
    }

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
                className='flex w-full max-w-xl flex-col gap-6 rounded-2xl bg-color4-200 px-4 py-8 lg:px-6'
                onSubmit={handleSubmit}
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
                            htmlFor='conteudo'
                            className='block font-secundary text-base font-bold text-color1-100'
                        >
                            Assunto
                        </label>
                        <input
                            type='text'
                            placeholder='Descreva o assunto'
                            className='w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-color1-400'
                            value={subject}
                            onChange={e => setSubject(e.target.value)}
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
                            className='block h-30 w-full resize-none rounded-lg border border-color4-25 p-3 outline-none focus:ring-2 focus:ring-color1-400'
                            value={note}
                            onChange={e => setNote(e.target.value)}
                        ></textarea>
                    </div>
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
