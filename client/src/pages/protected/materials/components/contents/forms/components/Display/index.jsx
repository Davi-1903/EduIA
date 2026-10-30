import clsx from 'clsx';
import { useState } from 'react';

import {
    IconCheck,
    IconLoader2,
    IconSend,
} from '@tabler/icons-react';

import { POST } from '../../../../../../../../api/materials';
import { useMessages } from '../../../../../../../../context/messagesContext';

export default function Display({
    id,
    content,
    userEmail,
    emailConfirmed,
    setEmailConfirmed,
    setClose,
    onSuccess,
}) {
    const [answers, setAnswers] = useState({});
    const [isSending, setIsSending] = useState(false);

    const { setMessages } = useMessages();

    const answeredCount = Object.keys(answers).length;

    function pushError(message) {
        setMessages(prev => [
            ...prev,
            {
                id: prev.length + 1,
                message,
                type: 'danger',
            },
        ]);
    }

    function setAnswer(questionId, answerId) {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answerId,
        }));
    }

    async function handleSubmit() {
        if (isSending) return;

        if (!emailConfirmed) {
            return pushError(
                'Confirme seu e-mail antes de enviar.',
            );
        }

        if (answeredCount !== content.length) {
            return pushError(
                'Responda todas as perguntas antes de enviar.',
            );
        }

        setIsSending(true);

        try {
            const data = await POST(
                `/api/materials/formulario/${id}/respostas`,
                {
                    answers,
                },
            );

            if (data.status !== 200 && data.status !== 201) {
                throw new Error(
                    data.message ||
                        'Não foi possível enviar as respostas',
                );
            }

            onSuccess();
        } catch (err) {
            pushError(
                err.name === 'SyntaxError'
                    ? 'Ocorreu um problema com a resposta do servidor'
                    : err.message,
            );
        } finally {
            setIsSending(false);
        }
    }

    return (
        <>
            <h1 className='text-center font-primary text-2xl font-bold text-color1-100'>
                Formulário
            </h1>

            <div className='flex flex-col gap-2'>
                <span className='font-secundary text-sm text-color1-100/60'>
                    Confirme seu e-mail para enviar as respostas:
                </span>

                <button
                    type='button'
                    onClick={() =>
                        setEmailConfirmed(prev => !prev)
                    }
                    disabled={isSending}
                    className='flex cursor-pointer items-center gap-2 disabled:cursor-no-drop'
                >
                    <span
                        className={clsx(
                            'grid h-5 w-5 shrink-0 place-items-center rounded-md border-2',
                            emailConfirmed
                                ? 'border-color1-400 bg-color1-400'
                                : 'border-color4-50',
                        )}
                    >
                        {emailConfirmed && (
                            <IconCheck
                                size={14}
                                className='stroke-white'
                            />
                        )}
                    </span>

                    <span className='font-secundary text-sm text-color1-100'>
                        {userEmail}
                    </span>
                </button>
            </div>

            <div className='flex items-center justify-between'>
                <h2 className='font-primary text-lg font-bold text-color1-100'>
                    Perguntas
                </h2>

                <span className='font-secundary text-sm text-color1-100/60'>
                    {answeredCount} de {content.length} respondidas
                </span>
            </div>

            <div className='flex flex-col gap-6'>
                {content.map((question, index) => (
                    <div
                        key={question.id}
                        className='flex flex-col gap-3'
                    >
                        <p className='font-secundary text-base font-semibold text-color1-100'>
                            {index + 1}. {question.question}
                        </p>

                        <ul
                            role='radiogroup'
                            aria-label={question.question}
                            className='flex flex-col gap-2 pl-1'
                        >
                            {question.answers.map(answer => {
                                const checked =
                                    answers[question.id] ===
                                    answer.id;

                                return (
                                    <li key={answer.id}>
                                        <button
                                            type='button'
                                            role='radio'
                                            aria-checked={checked}
                                            disabled={isSending}
                                            onClick={() =>
                                                setAnswer(
                                                    question.id,
                                                    answer.id,
                                                )
                                            }
                                            className='flex cursor-pointer items-center gap-2 text-left disabled:cursor-no-drop'
                                        >
                                            <span
                                                className={clsx(
                                                    'grid h-5 w-5 shrink-0 place-items-center rounded-md border-2',
                                                    checked
                                                        ? 'border-color1-400 bg-color1-400'
                                                        : 'border-color4-50',
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
                    type='button'
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

                    {isSending ? 'Enviando...' : 'Enviar'}
                </button>

                <button
                    type='button'
                    className='cursor-pointer rounded-lg border-2 border-color1-100 px-8 py-2 font-secundary text-base font-bold text-color1-100 transition-all duration-250 hover:bg-button hover:text-color4-400 disabled:cursor-no-drop disabled:opacity-50'
                    onClick={() => setClose(true)}
                    disabled={isSending}
                >
                    Voltar
                </button>
            </div>
        </>
    );
}