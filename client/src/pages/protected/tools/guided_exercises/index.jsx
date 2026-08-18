import { useEffect, useState, useRef } from 'react';
import { disciplinasList } from '../../../../../public/assets/data/disciplinas';
import { useMessages } from '../../../../context/messagesContext';
import { POST } from '../../../../api/materials';
import InputRange from '../../../../components/inputRange';
import clsx from 'clsx';

export default function GenerateQuidedExercises({ setOpen }) {
    const articleRef = useRef(null);
    const { setMessages } = useMessages();
    const [discipline, setDiscipline] = useState('Língua Portuguesa e Literatura');
    const [subject, setSubject] = useState('');
    const [difficulty, setDifficulty] = useState(0);
    const [amount, setAmount] = useState(5);
    const [multipleChoice, setMultipleChoice] = useState(false);
    const [trueOrFalse, setTrueOrFalse] = useState(false);
    const [discursive, setDiscursive] = useState(false);
    const [note, setNote] = useState('');
    const [isClose, setClose] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const dificuldades = ['Muito fácil', 'Fácil', 'Médio', 'Difícil', 'Muito difícil'];

    function handleAnimationEnd() {
        if (isClose) setOpen(false);
    }

    function formatQuantidade(value) {
        return String(value).padStart(2, '0');
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await POST('/api/materials/exercicio_guiado/', {
                discipline,
                subject,
                difficulty: dificuldades[difficulty],
                amount,
                resolution: false,
                theory: false,
                multiple_choice: multipleChoice,
                true_or_false: trueOrFalse,
                discursive,
                interpretation: false,
                code: false,
                note,
            });

            if (response.status !== 201) throw new Error(response.message);

            document.body.style.overflowY = 'auto';
            setOpen(false);

            setMessages(prev => [
                ...prev,
                {
                    id: prev.length + 1,
                    message: 'Exercício guiado criado com sucesso!',
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
                <h2 className='bg-linear-to-tr from-color1-100 to-color4-100 bg-clip-text font-primary text-4xl font-bold text-transparent'>
                    Exercício guiado
                </h2>

                <div>
                    <label className='font-secundary font-bold text-color1-100'>
                        Disciplina
                    </label>

                    <select
                        id='disciplina'
                        className='h-12 w-full rounded-lg border border-gray-300 px-4 font-medium text-color1-100 outline-none'
                        value={discipline}
                        onChange={e => setDiscipline(e.target.value)}
                    >
                        {Object.entries(disciplinasList).map(([key, disciplinas]) => (
                            <optgroup label={key}>
                                {disciplinas.map(disciplina => (
                                    <option value={disciplina}>
                                        {disciplina}
                                    </option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                </div>

                <div className='flex flex-col'>
                    <label className='font-secundary font-bold text-color1-100'>
                        Conteúdo
                    </label>

                    <input
                        type='text'
                        placeholder='Descreva o assunto da aula'
                        className='required rounded-lg border border-gray-300 bg-color4-200 px-4 py-2 outline-none focus:ring-2 focus:ring-color1-400'
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
                        value={dificuldades[difficulty]}
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
                    <label className='font-secundary font-bold text-color1-100'>
                        Formato dos exercícios
                    </label>

                    <div className='grid grid-cols-2 gap-x-8 pl-2'>
                        <label className='flex items-center gap-2 font-secundary text-sm text-color1-100'>
                            <input
                                type='checkbox'
                                name='multiple_choice'
                                checked={multipleChoice}
                                onChange={e => setMultipleChoice(e.target.checked)}
                                className='accent-color1-100'
                            />
                            Múltipla escolha
                        </label>

                        <label className='flex items-center gap-2 font-secundary text-sm text-color1-100'>
                            <input
                                type='checkbox'
                                name='true_or_false'
                                checked={trueOrFalse}
                                onChange={e => setTrueOrFalse(e.target.checked)}
                                className='accent-color1-100'
                            />
                            Verdadeiro ou falso
                        </label>

                        <label className='flex items-center gap-2 font-secundary text-sm text-color1-100'>
                            <input
                                type='checkbox'
                                name='discursive'
                                checked={discursive}
                                onChange={e => setDiscursive(e.target.checked)}
                                className='accent-color1-100'
                            />
                            Discursivo
                        </label>
                    </div>
                </div>

                <div className='flex flex-col'>
                    <label className='font-secundary font-bold text-color1-100'>
                        Observação
                    </label>

                    <textarea
                        placeholder='Escreva algo específico que deseja nos exercícios...'
                        className='resize-none rounded-lg border border-gray-300 bg-color4-200 px-4 py-2 outline-none focus:ring-2 focus:ring-color1-400'
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