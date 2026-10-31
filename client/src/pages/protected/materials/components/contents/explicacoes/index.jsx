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
                'fixed inset-0 z-7 grid min-h-dvh w-full place-items-center overflow-y-auto bg-gray-800/20 p-4 backdrop-blur-sm sm:p-4',
                isClose ? 'animate-fade-out' : 'animate-fade-in',
            )}
        >
            <div
                ref={materialRef}
                className='flex max-h-[90dvh] w-full max-w-4xl flex-col gap-4 overflow-hidden rounded-3xl bg-white p-4 shadow-[5px_5px_7px_rgba(0,0,0,.2)] sm:gap-6 sm:p-6 md:p-10'
            >
                <div className='flex w-full flex-col gap-4 p-2 sm:p-3 lg:flex-row lg:items-center lg:justify-between'>
                    <div className='flex min-w-0 items-center gap-2'>
                        <IconFileDescription className='h-7 w-7 shrink-0 text-[#011F5B] sm:h-9 sm:w-9' />
                        <p className='min-w-0 text-xl font-bold wrap-break-word text-[#011F5B] sm:text-2xl lg:text-3xl'>
                            {subject}
                        </p>
                    </div>
                    <button
                        onClick={copyExplanation}
                        className='group flex w-full shrink-0 items-center justify-center gap-2 rounded-lg border-2 border-transparent bg-button px-3 py-2.5 text-white transition-all duration-300 hover:bg-white hover:button-gradient-border sm:w-fit sm:px-4 sm:py-3'
                    >
                        <IconCopy className='h-5 w-5 shrink-0 text-white transition-colors duration-300 group-hover:text-color1-100 sm:h-6 sm:w-6' />

                        <p className='text-sm font-bold transition-colors duration-300 group-hover:button-gradient-text sm:text-base lg:text-lg'>
                            Copiar Explicação
                        </p>
                    </button>
                </div>
                <div className='min-h-0 w-full flex-1 overflow-y-auto'>
                    <div className='w-full text-base wrap-break-word sm:text-lg md:text-2xl'>
                        <ReactMarkdown
                            components={{
                                h1: ({ children }) => (
                                    <h1 className='mb-3 text-2xl font-bold wrap-break-word text-[#011F5B] sm:text-3xl lg:text-4xl'>
                                        {children}
                                    </h1>
                                ),

                                h2: ({ children }) => (
                                    <h2 className='mt-5 mb-3 text-xl font-bold wrap-break-word text-[#011F5B] sm:text-2xl lg:text-3xl'>
                                        {children}
                                    </h2>
                                ),

                                h3: ({ children }) => (
                                    <h3 className='mt-4 mb-2 text-lg font-semibold wrap-break-word text-[#011F5B] sm:text-xl lg:text-2xl'>
                                        {children}
                                    </h3>
                                ),

                                p: ({ children }) => (
                                    <p className='mb-4 text-base leading-relaxed wrap-break-word whitespace-pre-wrap sm:text-lg lg:text-xl'>
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
                                    <li className='text-base leading-relaxed wrap-break-word sm:text-lg lg:text-xl'>
                                        {children}
                                    </li>
                                ),

                                strong: ({ children }) => <strong className='font-bold'>{children}</strong>,

                                em: ({ children }) => <em className='italic'>{children}</em>,
                            }}
                        >
                            {content ?? 'Erro na exibição da explicação'}
                        </ReactMarkdown>
                    </div>
                </div>
                <div className='grid shrink-0 grid-cols-1 gap-3 rounded-[20px] bg-[#F4F4F4] p-4 sm:p-6 md:gap-4 md:p-8'>
                    <p className='justify-self-end text-lg font-bold text-[#011F5B] sm:text-xl md:text-2xl'>
                        Qual é a sua dúvida?
                    </p>
                    <div className='flex h-20 flex-row items-center justify-between gap-2 rounded-lg border border-[#0D4183] p-2'>
                        <input
                            className='h-fit w-fit text-xl'
                            type='text'
                            name='text'
                            placeholder='Escreva aqui...'
                        />
                        <button className='cursor-pointer rounded-[50px] border border-[#0D4183] bg-white p-2.5 transition-colors duration-300 ease-in-out hover:bg-[#E0E9F5]'>
                            <IconArrowUp className='h-9.75 w-9.75 text-[#011F5B]' />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
