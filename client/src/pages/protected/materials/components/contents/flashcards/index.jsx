import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import Display from './componentes/Display';
import BarProgress from './componentes/BarProgress';
import { IconArrowRight, IconArrowLeft } from '@tabler/icons-react';
import Introduction from './componentes/Introducion';

export default function FlashCards({ discipline, subject, difficulty, content, setContent }) {
    const materialRef = useRef(null);
    const [start, setStart] = useState(false);
    const [isClose, setClose] = useState(false);
    const [cardID, setCardId] = useState(0);
    const [cardsEnd, setCardsEnd] = useState(false);

    function handleStart() {
        setStart(true);
    }

    function nextCard() {
        if (cardID < content.length - 1) {
            setCardId(prev => prev + 1);
        } else {
            setCardsEnd(true);
        }
    }

    function previousCard() {
        if (cardID > 0) {
            setCardId(prev => prev - 1);
        }
    }

    function handleAnimationEnd(event) {
        if (event.target !== event.currentTarget) return;

        if (isClose) {
            setContent(null);
        }
    }

    useEffect(() => {
        function handleClick(event) {
            if (!materialRef.current?.contains(event.target)) {
                setClose(true);
            }
        }

        document.addEventListener('mousedown', handleClick);

        return () => {
            document.removeEventListener('mousedown', handleClick);
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
            <main
                ref={materialRef}
                className='flex h-170 w-full max-w-160 flex-col justify-center gap-6 rounded-2xl bg-white p-6 shadow-2xl shadow-color1-100/15 lg:w-4/5'
            >
                {!start ? (
                    <Introduction 
                        discipline={discipline}
                        subject={subject}
                        difficulty={difficulty}
                        cardsLength={content.length}
                        handleClose={() => setClose(true)}
                        handleStart={handleStart}
                    />
                ) : (
                    <>
                        <BarProgress
                            cards={content}
                            currentCardID={cardID}
                        />
                        <Display
                            cards={content}
                            currentCardID={cardID}
                        />

                        <div className='flex justify-between'>
                            <button
                                className='flex cursor-pointer items-center gap-3 rounded-lg bg-button px-6 py-2 font-primary text-lg text-color4-400 transition-all duration-250 not-disabled:hover:shadow-lg-hard disabled:cursor-no-drop disabled:opacity-50'
                                onClick={previousCard}
                                disabled={cardID === 0}
                            >
                                <IconArrowLeft />
                                <span>Voltar</span>
                            </button>

                            {cardID === content.length - 1 ? (
                                <>
                                    <button
                                        className='flex cursor-pointer items-center gap-3 rounded-lg border-2 border-solid border-[color-mix(in_srgb,var(--color-color1-100)_50%,white)] bg-[color-mix(in_srgb,var(--color-color1-400)_90%,white)] px-6 py-2 font-primary text-lg text-color4-400 transition-all duration-250 not-disabled:hover:shadow-lg-hard disabled:cursor-no-drop disabled:opacity-50'
                                        onClick={() => setClose(true)}
                                    >
                                        <span>Finalizar</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        className={clsx(
                                            'flex cursor-pointer items-center gap-3 rounded-lg bg-button px-6 py-2 font-primary text-lg text-color4-400 transition-all duration-250 not-disabled:hover:shadow-lg-hard disabled:cursor-no-drop disabled:opacity-50',
                                            cardsEnd && 'bg-button2',
                                        )}
                                        onClick={nextCard}
                                    >
                                        <span>Avançar</span>
                                        <IconArrowRight />
                                    </button>
                                </>
                            )}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
