import clsx from 'clsx';
import { IconCheck } from '@tabler/icons-react';
import { useState } from 'react';
import { POST } from '../../../../../../../api/materials';
import { useMessages } from '../../../../../../../context/messagesContext';
import { IconLoader2 } from '@tabler/icons-react';
import { IconSend } from '@tabler/icons-react';

export default function Display({ id, content, discipline, subject, userEmail, emailConfirmed, setEmailConfirmed, setClose }) {
    const [answers, setAnswers] = useState({});
    const [isSending, setIsSending] = useState(false);
    const { setMessages } = useMessages();

    function setAnswer(questionId, answerId) {
        setAnswers(prev => ({ ...prev, [questionId]: answerId }));
    }

    async function handleSubmit() {
        if (!emailConfirmed) {
            setMessages(prev => [
                ...prev,
                { id: prev.length + 1, message: 'Confirme seu e-mail antes de enviar.', type: 'danger' },
            ]);
            return;
        }

        try {
            const data = await POST(`/api/materials/formulario/${id}/respostas`, { answers });
            if (data.status !== 200 && data.status !== 201)
                throw new Error(data.message || 'Não foi possível enviar as respostas');
        } catch (err) {
            setMessages(prev => [...prev, { id: prev.length + 1, message: err.message, type: 'danger' }]);
        } finally {
            setIsSending(false);
        }
    }

    return (
        <>
            <h1 className='text-center font-primary text-2xl font-bold text-color1-100'>
                Formulário de {discipline ?? subject}
            </h1>

            <div className='flex flex-col gap-2'>
                <span className='font-secundary text-sm text-color1-100/60'>Confirmar email:</span>
                <button
                    type='button'
                    onClick={() => setEmailConfirmed(prev => !prev)}
                    className='flex cursor-pointer items-center gap-2'
                >
                    <span
                        className={clsx(
                            'grid h-5 w-5 shrink-0 place-items-center rounded-md border-2',
                            emailConfirmed ? 'border-color1-400 bg-color1-400' : 'border-color4-50',
                        )}
                    >
                        {emailConfirmed && (
                            <IconCheck
                                size={14}
                                className='stroke-white'
                            />
                        )}
                    </span>
                    <span className='font-secundary text-sm text-color1-100'>{userEmail}</span>
                </button>
            </div>
            <h2 className='font-primary text-lg font-bold text-color1-100'>Perguntas</h2>

            <div className='flex flex-col gap-6'>
                {content.map((question, index) => (
                    <div
                        key={question.id}
                        className='flex flex-col gap-3'
                    >
                        <p className='font-secundary text-base font-semibold text-color1-100'>
                            {index + 1}. {question.question}
                        </p>

                        <ul className='flex flex-col gap-2 pl-1'>
                            {question.answers.map(answer => {
                                const checked = answers[question.id] === answer.id;
                                return (
                                    <li key={answer.id}>
                                        <button
                                            type='button'
                                            onClick={() => setAnswer(question.id, answer.id)}
                                            className='flex cursor-pointer items-center gap-2'
                                        >
                                            <span
                                                className={clsx(
                                                    'grid h-5 w-5 shrink-0 place-items-center rounded-md border-2',
                                                    checked ? 'border-color1-400 bg-color1-400' : 'border-color4-50',
                                                )}
                                            >
                                                {checked && (
                                                    <IconCheck
                                                        size={14}
                                                        className='stroke-white'
                                                    />
                                                )}
                                            </span>
                                            <span className='font-secundary text-sm text-color1-100'>
                                                {answer.text}
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </div>
            <div className='flex justify-center gap-4 pt-2'>
                <button
                    className='flex cursor-pointer items-center gap-2 rounded-lg bg-button px-8 py-2 font-secundary text-base font-bold text-color4-400 transition-all duration-250 not-disabled:hover:shadow-lg-hard disabled:cursor-no-drop disabled:opacity-50'
                    onClick={handleSubmit}
                    disabled={isSending}
                >
                    {isSending ? (
                        <IconLoader2
                            size={18}
                            className='animate-spin'
                        />
                    ) : (
                        <IconSend size={18} />
                    )}
                    Enviar
                </button>
                <button
                    className='cursor-pointer rounded-lg border-2 border-color1-100 px-8 py-2 font-secundary text-base font-bold text-color1-100 transition-all duration-250 hover:bg-button hover:text-color4-400'
                    onClick={() => setClose(true)}
                >
                    Voltar
                </button>
            </div>
        </>
    );
}