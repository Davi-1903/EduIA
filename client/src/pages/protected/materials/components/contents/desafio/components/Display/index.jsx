import { useRef, useState } from 'react';
import { IconLoader2, IconSend } from '@tabler/icons-react';
import { POST } from '../../../../../../../../api/materials';
import { useMessages } from '../../../../../../../../context/messagesContext';
import End from '../End';

function formatInlineText(text) {
    const parts = text.split(/(\*\*\*.*?\*\*\*|\*\*.*?\*\*)/g);

    return parts.map((part, index) => {
        if (part.startsWith('***') && part.endsWith('***')) {
            return (
                <strong key={index}>
                    <em>{part.slice(3, -3)}</em>
                </strong>
            );
        }

        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index}>{part.slice(2, -2)}</strong>;
        }

        return part;
    });
}

function formatContent(content) {
    return content.split('\n').map((line, index) => {
        const heading = line.match(/^#{1,6}\s+(.*)$/);

        if (heading) {
            return (
                <h3
                    key={index}
                    className='mb-3 mt-4 font-primary text-lg font-bold text-color1-100 first:mt-0'
                >
                    {formatInlineText(heading[1])}
                </h3>
            );
        }

        if (!line.trim()) {
            return <div key={index} className='h-2' />;
        }

        return (
            <p key={index} className='mb-3 last:mb-0'>
                {formatInlineText(line)}
            </p>
        );
    });
}

export default function Display({ id, content, discipline, subject, setClose }) {
    const [resolution, setResolution] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [finished, setFinished] = useState(false);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const startTimeRef = useRef(Date.now());
    const { setMessages } = useMessages();

    function handleRestart() {
        setResolution('');
        setFinished(false);
        startTimeRef.current = Date.now();
    }

    async function handleSubmit() {
        if (!resolution.trim()) {
            setMessages(prev => [
                ...prev,
                { id: prev.length + 1, message: 'Escreva sua resolução antes de enviar.', type: 'danger' },
            ]);
            return;
        }

        setIsSending(true);

        try {
            const data = await POST(`/api/materials/desafio/${id}/respostas`, { answer: resolution });

            if (data.status !== 200 && data.status !== 201)
                throw new Error(data.message || 'Não foi possível enviar a resolução');

            setElapsedSeconds((Date.now() - startTimeRef.current) / 1000);
            setFinished(true);
        } catch (err) {
            setMessages(prev => [
                ...prev,
                { id: prev.length + 1, message: err.message, type: 'danger' },
            ]);
        } finally {
            setIsSending(false);
        }
    }

    if (finished) {
        return (
            <End
                elapsedSeconds={elapsedSeconds}
                onRestart={handleRestart}
                onExit={() => setClose(true)}
            />
        );
    }

    return (
        <>
            <h1 className='text-center font-primary text-2xl font-bold text-color1-100'>
                Desafio de {discipline ?? subject}
            </h1>

            <div className='rounded-xl bg-color4-100 p-6 font-secundary text-base leading-relaxed text-color1-100'>
                {formatContent(content)}
            </div>

            <div className='flex flex-col gap-2'>
                <label className='font-secundary text-sm font-bold text-color1-100'>
                    Sua resolução
                </label>

                <textarea
                    value={resolution}
                    onChange={e => setResolution(e.target.value)}
                    placeholder='Escreva aqui como você resolveu o desafio...'
                    rows={8}
                    className='w-full resize-none rounded-xl border-2 border-color4-50 p-4 font-secundary text-base text-color1-100 outline-none focus:border-color1-400'
                />
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