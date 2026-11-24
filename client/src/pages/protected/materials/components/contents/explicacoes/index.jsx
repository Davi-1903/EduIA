import { useCallback, useEffect, useRef, useState } from 'react';
import { IconFileDescription, IconCopy } from '@tabler/icons-react';
import { useMessages } from '../../../../../../context/messagesContext';
import Introduction from './components/Introduction';
import removeMarkdown from 'remove-markdown';
import MarkDown from '../../../../../../components/markdown';
import clsx from 'clsx';

export default function Explicacoes({ content, subject, discipline, doubt, setContent }) {
    const contentRef = useRef(null);
    const [showFadeTop, setShowFadeTop] = useState(false);
    const [showFadeBottom, setShowFadeBottom] = useState(false);
    const [start, setStart] = useState(false);
    const { setMessages } = useMessages();
    const [isClose, setClose] = useState(false);
    const materialRef = useRef(null);

    const handleStart = () => {
        setStart(true);
    };

    function handleAnimationEnd(event) {
        if (event.target !== event.currentTarget) return;
        if (isClose) setContent(null);
    }

    // degradê do texto
    const handleScroll = useCallback(() => {
        const element = contentRef.current;
        if (!element) return;

        const hasContentAbove = element.scrollTop > 5;
        const hasContentBelow = element.scrollTop + element.clientHeight < element.scrollHeight - 5;

        setShowFadeTop(hasContentAbove);
        setShowFadeBottom(hasContentBelow);
    }, []);

    useEffect(() => {
        handleScroll();
    }, [content, handleScroll]);

    // botão de copiar
    async function copyExplanation() {
        try {
            const text = removeMarkdown(content ?? '');

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
            <main
                ref={materialRef}
                className={clsx(
                    'flex w-full max-w-2xl flex-col gap-6 overflow-hidden rounded-3xl bg-white p-6 shadow-[5px_5px_7px_rgba(0,0,0,.2)] sm:gap-6 sm:p-8',
                    start ? 'h-[90dvh]' : 'max-h-[90dvh]',
                )}
            >
                {!start ? (
                    <Introduction
                        discipline={discipline}
                        subject={subject}
                        doubt={doubt}
                        handleClose={() => setClose(true)}
                        handleStart={handleStart}
                    />
                ) : (
                    <>
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
                                className='group flex w-full shrink-0 cursor-pointer items-center justify-center gap-3 rounded-lg border-2 border-transparent bg-button px-2 py-1 text-white transition-all duration-300 hover:bg-white hover:button-gradient-border sm:w-fit sm:px-3 sm:py-2'
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
                        <div className='relative min-h-0 flex-1'>
                            <div
                                ref={contentRef}
                                onScroll={handleScroll}
                                className='h-full min-h-0 w-full overflow-y-auto'
                            >
                                <MarkDown>{content ?? 'Erro na exibição da explicação'}</MarkDown>
                            </div>

                            {/* gradiente do texto de cima */}
                            {showFadeTop && (
                                <div className='pointer-events-none absolute top-0 left-0 h-12 w-full bg-linear-to-b from-white to-transparent' />
                            )}

                            {/* gradiente do texto de baixo */}
                            {showFadeBottom && (
                                <div className='pointer-events-none absolute bottom-0 left-0 h-16 w-full bg-linear-to-t from-white to-transparent' />
                            )}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
