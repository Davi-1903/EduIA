import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import Introduction from './componentes/Introduction';
import ReactMarkdown from 'react-markdown';
import removeMarkdown from 'remove-markdown';
import { IconCopy } from '@tabler/icons-react';
import { useMessages } from '../../../../../../context/messagesContext';

export default function Resume({ discipline, subject, content, setContent }) {
    const materialRef = useRef(null);
    const [start, setStart] = useState(false);
    const [isClose, setClose] = useState(false);
    const normalize = str => str.replace(/\\n/g, '\n');
    const { setMessages } = useMessages();

    async function copyExplanation(c) {
        try {
            const text = removeMarkdown(normalize(c.text ?? ''));

            await navigator.clipboard.writeText(text);
            setMessages(prev => [...prev, { id: prev.length + 1, message: 'Explicação copiada', type: 'ok' }]);
        } catch (err) {
            console.error('Erro ao copiar explicação:', err);
            setMessages(prev => [
                ...prev,
                { id: prev.length + 1, message: 'Não foi possível copiar a explicação', type: 'danger' },
            ]);
        }
    }

    function handleStart() {
        setStart(true);
    }

    function handleAnimationEnd(event) {
        if (event.target !== event.currentTarget) return;

        if (isClose) {
            setContent(null);
        }
    }

    useEffect(() => {
        function handleClick(event) {
            if (!materialRef.current?.contains(event.target) && (!start || confirm('Deseja sair do resumo?')))
                setClose(true);
        }

        function handleKey(event) {
            if (event.key === 'Escape' && (!start || confirm('Deseja sair do resumo?'))) setClose(true);
        }

        document.addEventListener('mousedown', handleClick);
        document.addEventListener('keydown', handleKey);
        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('keydown', handleKey);
        };
    }, [start, content]);

    return (
        <div
            onAnimationEnd={handleAnimationEnd}
            className={clsx(
                'fixed inset-0 z-7 grid place-items-center bg-gray-800/20 backdrop-blur-sm',
                isClose ? 'animate-fade-out' : 'animate-fade-in',
            )}
        >
            <main
                ref={materialRef}
                className='flex h-170 min-h-0 w-full max-w-160 min-w-0 flex-1 flex-col gap-6 overflow-y-auto rounded-2xl bg-white px-6 py-10 shadow-2xl shadow-color1-100/15 lg:w-4/5'
            >
                {!start ? (
                    <Introduction
                        discipline={discipline}
                        subject={subject}
                        handleClose={() => setClose(true)}
                        handleStart={handleStart}
                    />
                ) : (
                    <>
                        {content.map(c => (
                            <>
                                <div className='flex flex-1 flex-col gap-3 text-justify'>
                                    <div className='button flex items-center justify-between'>
                                        <h1 className='bg-linear-to-tr from-color1-100 to-color4-100 bg-clip-text text-3xl leading-tight font-bold text-transparent md:text-4xl'>
                                            {c.title}
                                        </h1>
                                        <button
                                            onClick={() => copyExplanation(c)}
                                            class='text-md flex cursor-pointer items-center gap-2 rounded-lg bg-button px-5 py-3 text-color4-100'
                                        >
                                            <IconCopy size={20} />
                                            Copiar
                                        </button>
                                    </div>
                                    <ReactMarkdown
                                        components={{
                                            h1: ({ children }) => (
                                                <h1 className='mb-3 text-2xl font-bold wrap-break-word text-color1-100'>
                                                    {children}
                                                </h1>
                                            ),
                                            h2: ({ children }) => (
                                                <h2 className='mt-5 mb-3 text-xl font-bold wrap-break-word text-color1-100'>
                                                    {children}
                                                </h2>
                                            ),
                                            h3: ({ children }) => (
                                                <h3 className='mt-4 mb-2 text-lg font-semibold wrap-break-word text-color1-100'>
                                                    {children}
                                                </h3>
                                            ),
                                            p: ({ children }) => (
                                                <p className='mb-4 text-lg leading-relaxed wrap-break-word whitespace-pre-wrap'>
                                                    {children}
                                                </p>
                                            ),
                                            ul: ({ children }) => (
                                                <ul className='mb-4 list-disc space-y-2 pl-5 sm:pl-8'>{children}</ul>
                                            ),
                                            ol: ({ children }) => (
                                                <ol className='mb-4 list-decimal space-y-2 pl-5 sm:pl-8'>{children}</ol>
                                            ),
                                            li: ({ children }) => (
                                                <li className='text-lg leading-relaxed wrap-break-word'>{children}</li>
                                            ),
                                            strong: ({ children }) => <strong className='font-bold'>{children}</strong>,
                                            em: ({ children }) => <em className='italic'>{children}</em>,
                                        }}
                                    >
                                        {normalize(c.text)}
                                    </ReactMarkdown>
                                </div>
                            </>
                        ))}
                    </>
                )}
            </main>
        </div>
    );
}
