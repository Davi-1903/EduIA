import { useState } from 'react';
import { IconSend } from '@tabler/icons-react';
import { POST } from '../../../../../../../../api/materials';
import { useMessages } from '../../../../../../../../context/messagesContext';

export default function Display({ id, subject, content, onSuccess }) {
    const [answers, setAnswers] = useState(
        content.map(item => ({ id: item.id, answer: '', expectedAnswer: item.expectedAnswer })),
    );
    const [isLoading, setLoading] = useState(false);
    const { setMessages } = useMessages();

    function toAnswer(id, e) {
        setAnswers(prev => prev.map(item => (item.id === id ? { ...item, answer: e.target.value } : item)));
    }

    function isFinished() {
        for (const item of answers) {
            if (item.answer === '') return false;
        }
        return true;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        console.log(answers);
        const timeID = setTimeout(() => {
            setLoading(true);
        }, 200);

        try {
            const data = await POST(`/api/materials/formulario/${id}/answer`, { answers });
            if (data.status !== 200) throw new Error(data.message || 'Não foi possível enviar as respostas');
            onSuccess(data.correction);
        } catch (err) {
            setMessages(prev => [
                ...prev,
                {
                    id: prev.length + 1,
                    message:
                        err.name === 'SyntaxError' ? 'Ocorreu um problema com a resposta do servidor' : err.message,
                    type: 'error',
                },
            ]);
        } finally {
            setLoading(false);
            clearTimeout(timeID);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className='flex flex-col gap-4'
        >
            <h1 className='bg-linear-to-tr from-color1-400 from-25% to-color4-25 bg-clip-text text-center font-primary text-2xl font-bold text-transparent'>
                {subject}
            </h1>
            <div className='flex flex-col gap-6'>
                {content.map(question => (
                    <label
                        key={question.id}
                        htmlFor={String(question.id) + ' answer'}
                        className='flex flex-col gap-3'
                    >
                        <p
                            id={String(question.id) + ' question'}
                            className='font-secundary text-base text-color1-100'
                        >
                            <strong className='bg-linear-to-tr from-color1-400 from-25% to-color4-25 bg-clip-text text-transparent'>
                                {question.id}.
                            </strong>{' '}
                            {question.question}
                        </p>
                        <textarea
                            id={String(question.id) + ' answer'}
                            onChange={e => toAnswer(question.id, e)}
                            className='resize-none rounded-lg border border-color4-25 p-2 font-medium outline-none focus:ring-2 focus:ring-color1-400'
                            placeholder='Sua resposta aqui...'
                            required
                        ></textarea>
                    </label>
                ))}
            </div>
            <button
                disabled={!isFinished() || isLoading}
                className='flex w-fit cursor-pointer items-center justify-center gap-3 self-end rounded-lg bg-button py-2 pr-4 pl-3 font-primary text-lg text-color4-400 transition-all duration-250 hover:not-disabled:shadow-lg-hard disabled:cursor-no-drop disabled:opacity-50'
            >
                <IconSend size={24} />
                Enviar respostas
            </button>
        </form>
    );
}
