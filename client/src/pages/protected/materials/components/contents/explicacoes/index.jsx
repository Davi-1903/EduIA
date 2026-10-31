import { useEffect, useRef, useState } from 'react';
import { IconFileDescription, IconCopy, IconArrowUp } from '@tabler/icons-react';
import ReactMarkdown from 'react-markdown';
import removeMarkdown from 'remove-markdown';
import clsx from 'clsx';
import { useMessages } from '../../../../../../context/messagesContext';

export default function Explicacoes({ content, subject, setContent }) {
    const { setMessages } = useMessages();
    const [isClose, setClose] = useState(false);
    const materialRef = useRef(null);

    function handleAnimationEnd(event) {
        if (event.target !== event.currentTarget) return;
        if (isClose) setContent(null);
    }

    async function copyExplanation() {
        try {
            const text = removeMarkdown(content?.content ?? '');

            await navigator.clipboard.writeText(text);
            setMessages(prev => [
                ...prev,
                {
                    id: prev.length + 1,
                    message: 'Explicação copiada',
                    type: 'ok',
                },
            ]);
        } catch (err) {
            console.error('Erro ao copiar explicação:', err);
            setMessages(prev => [
                ...prev,
                {
                    id: prev.length + 1,
                    message: 'Não foi possível copiar a explicação',
                    type: 'danger',
                },
            ]);
        }
    }

    useEffect(() => {
        function handleClick(event) {
            if (!materialRef.current?.contains(event.target)) setClose(true);
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
                'fixed inset-0 z-7 grid min-h-dvh w-full place-items-center overflow-y-auto bg-gray-800/20 backdrop-blur-sm',
                isClose ? 'animate-fade-out' : 'animate-fade-in',
            )}
        >
            <div
                ref={materialRef}
                className='flex max-h-[90dvh] w-full max-w-2xl flex-col gap-6 overflow-hidden rounded-3xl bg-white p-6 shadow-[5px_5px_7px_rgba(0,0,0,.2)] sm:gap-6 sm:p-8'
            >
                <div className='flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
                    <div className='flex min-w-0 items-center gap-4'>
                        <div className='rounded-full bg-black/3 p-4'>
                            <IconFileDescription
                                size={30}
                                className='stroke-color1-100'
                            />
                        </div>
                        <p className='min-w-0 text-xl font-bold wrap-break-word text-color1-100'>{subject}</p>
                    </div>
                    <button
                        onClick={copyExplanation}
                        className='group flex w-full shrink-0 items-center justify-center gap-3 rounded-lg border-2 border-transparent bg-button px-2 py-1 text-white transition-all duration-300 hover:bg-white hover:button-gradient-border sm:w-fit sm:px-3 sm:py-2'
                    >
                        <IconCopy
                            size={20}
                            className='text-white transition-colors duration-300 group-hover:text-color1-100'
                        />
                        <p className='text-base font-semibold transition-colors duration-300 group-hover:button-gradient-text'>
                            Copiar Explicação
                        </p>
                    </button>
                </div>
                <div className='min-h-0 w-full flex-1 overflow-y-auto'>
                    <div className='w-full text-base wrap-break-word sm:text-lg md:text-2xl'>
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
                            {content ?? 'Erro na exibição da explicação'}
                        </ReactMarkdown>
                    </div>
                </div>
                <div className='grid shrink-0 grid-cols-1 gap-2 rounded-2xl bg-color4-200 p-4'>
                    <p className='justify-self-end text-lg font-bold text-color1-100'>Qual é a sua dúvida?</p>
                    <div className='relative'>
                        <input
                            className='min-h-12 w-full rounded-xl border-2 border-color1-100 pr-12 pl-4 text-base font-semibold outline-none'
                            type='text'
                            name='text'
                            placeholder='Escreva aqui...'
                        />
                        <button className='absolute top-1/2 right-[4.8px] grid aspect-square h-4/5 -translate-y-1/2 cursor-pointer place-items-center rounded-full transition-colors duration-300 ease-in-out hover:bg-color4-50'>
                            <IconArrowUp
                                size={26}
                                className='stroke-color1-100'
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
