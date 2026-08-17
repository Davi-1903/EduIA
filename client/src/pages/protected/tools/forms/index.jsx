import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { disciplinasList } from '../../../../../public/assets/data/disciplinas';
import InputRange from '../../../../components/inputRange';
import { POST } from '../../../../api/materials';
import { useMessages } from '../../../../context/messagesContext';
import clsx from 'clsx';

export default function GenerateForms({ setOpen }) {
    const articleRef = useRef(null);
    const { setMessages } = useMessages();
    const [isClose, setClose] = useState(false);
    const [quantidade, setQuantidade] = useState(5);
    const [discipline, setDiscipline] = useState('Língua Portuguesa e Literatura');
    const [subject, setSubject] = useState('');
    const [note, setNote] = useState('');
    const [difficulty, setDifficulty] = useState('MEDIO');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function handleAnimationEnd() {
        if (isClose) setOpen(false);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await POST('/api/materials/formularios/', {
                discipline,
                subject,
                content: {},
                difficulty,
                amount: quantidade,
                note,
            });

            if (response.status !== 201) throw new Error(response.message);
            document.body.style.overflowY = 'auto';
            navigate(response.redirect);

            setMessages(prev => [
                ...prev,
                {
                    id: prev.length + 1,
                    message: 'Formulário criado com sucesso!',
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
                ref={articleRef}
                onSubmit={handleSubmit}
                className='flex w-full max-w-xl flex-col gap-6 rounded-2xl bg-color4-200 px-4 py-8 lg:px-6'
            >
                <h2 className='bg-linear-to-tr from-color1-100 to-color4-100 bg-clip-text font-primary text-4xl font-bold text-transparent'>
                    Formulário
                </h2>

                <div className='flex flex-col gap-5'>
                    <div>
                        <label
                            className='block font-secundary text-base font-bold text-color1-100'
                            htmlFor='disciplina'
                        >
                            Disciplina
                        </label>

                        <select
                            id='disciplina'
                            value={discipline}
                            onChange={e => setDiscipline(e.target.value)}
                            className='h-12 w-full rounded-lg border border-gray-300 px-4 font-medium text-color1-100 outline-none'
                            required
                        >
                            <option value=''>Selecione uma disciplina</option>

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
                            value={subject}
                            onChange={e => setSubject(e.target.value)}
                            placeholder='Descreva o assunto das questões'
                            className='h-12 w-full rounded-lg border border-color4-25 px-4 font-medium outline-none focus:ring-2 focus:ring-color1-400'
                            required
                        />
                    </div>

                    <div>
                        <label
                            className='block font-secundary text-base font-bold text-color1-100'
                            htmlFor='quantidade'
                        >
                            Quantidade de campos
                        </label>

                        <InputRange
                            value={quantidade}
                            trueValue={quantidade}
                            setValue={setQuantidade}
                            min={5}
                            max={50}
                        />
                    </div>

                    <div>
                        <label
                            className='block font-secundary text-base font-bold text-color1-100'
                            htmlFor='dificuldade'
                        >
                            Dificuldade
                        </label>

                        <select
                            id='dificuldade'
                            value={difficulty}
                            onChange={e => setDifficulty(e.target.value)}
                            className='h-12 w-full rounded-lg border border-color4-25 px-4 font-medium text-color1-100 outline-none'
                            required
                        >
                            <option value='MUITO_FACIL'>Muito fácil</option>
                            <option value='FACIL'>Fácil</option>
                            <option value='MEDIO'>Médio</option>
                            <option value='DIFICIL'>Difícil</option>
                            <option value='MUITO_DIFICIL'>Muito difícil</option>
                        </select>
                    </div>

                    <div>
                        <label
                            className='font-secundary font-bold text-color1-100'
                            htmlFor='observacoes'
                        >
                            Observações
                        </label>

                        <textarea
                            id='observacoes'
                            value={note}
                            onChange={e => setNote(e.target.value)}
                            className='h-24 w-full resize-none rounded-lg border border-color4-25 px-4 py-2 outline-none focus:ring-2 focus:ring-color1-400'
                            placeholder='Caso deseje, descreva aqui suas observações'
                        ></textarea>
                    </div>
                </div>

                <button
                    type='submit'
                    disabled={loading}
                    className='h-12 cursor-pointer rounded-lg bg-button text-xl text-color4-100 transition-all duration-150 hover:shadow-lg-hard disabled:opacity-50'
                >
                    {loading ? 'Gerando...' : 'Gerar'}
                </button>
            </form>
        </div>
    );
}