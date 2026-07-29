import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { disciplinasList } from '../../../../../public/assets/data/disciplinas';
import { useMessages } from '../../../../context/messagesContext';
import { POST } from '../../../../api/materials';
import InputRange from '../../../../components/inputRange';
import clsx from 'clsx';

export default function GenerateQuestions({ setOpen }) {
    const articleRef = useRef(null);
    const { setMessages } = useMessages();
    const [discipline, setDiscipline] = useState('Língua Portuguesa e Literatura');
    const [subject, setSubject] = useState('');
    const [difficulty, setDifficulty] = useState(0);
    const [amount, setAmount] = useState(5);
    const [note, setNote] = useState('');
    const [isClose, setClose] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();
    const difficulties = ['Muito fácil', 'Fácil', 'Médio', 'Difícil', 'Muito difícil'];

    function formatQuantidade(value) {
        return String(value).padStart(2, '0');
    }

    function handleAnimationEnd() {
        if (isClose) setOpen(false);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await POST('/api/materials/questoes/', {
                discipline,
                subject,
                difficulty: difficulties[difficulty],
                amount,
                note,
            });
            if (response.status !== 201) throw new Error(response.message);
            document.body.style.overflowY = 'auto';
            navigate(response.redirect);
            setMessages(prev => [
                ...prev,
                {
                    id: prev.length + 1,
                    message: 'Questões criadas com sucesso!',
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
                className='flex w-full max-w-xl flex-col gap-6 rounded-2xl bg-color4-200 px-4 py-8 lg:px-6'
                onSubmit={handleSubmit}
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
                    <select
                        id='disciplina'
                        className='h-12 w-full rounded-lg border border-color4-25 px-4 font-medium text-color1-100 outline-none'
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
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
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
                        value={difficulties[difficulty]}
                        trueValue={difficulty}
                        setValue={setDifficulty}
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
                        setValue={setAmount}
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
                        placeholder='Caso deseje, descreva aqui suas observações'
                        value={note}
                        onChange={e => setNote(e.target.value)}
                    ></textarea>
                </div>
                <button
                    className='h-12 cursor-pointer rounded-lg bg-button text-xl text-color4-100 transition-all duration-150 not-disabled:hover:shadow-lg-hard disabled:cursor-not-allowed disabled:opacity-60'
                    disabled={isLoading}
                >
                    Gerar
                </button>
            </form>
        </div>
    );
}
