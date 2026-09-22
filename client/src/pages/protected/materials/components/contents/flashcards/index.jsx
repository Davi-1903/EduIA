import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import Display from './componentes/Display';
import { IconArrowRight, IconArrowLeft } from '@tabler/icons-react';
import Introduction from './componentes/Introducion';
import ProgressBar from './componentes/ProgressBar';

export default function FlashCards({ discipline, subject, difficulty, content, setContent }) {
    const materialRef = useRef(null);
    const [start, setStart] = useState(false);
    const [isClose, setClose] = useState(false);
    const [cardID, setCardId] = useState(0);

    function handleStart() {
        setStart(true);
    }

    function nextCard() {
        if (cardID < content.length - 1) {
            setCardId(prev => prev + 1);
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
                        <ProgressBar
                            cards={content}
                            currentCardID={cardID}
                        />
                        <Display
                            cards={content}
                            currentCardID={cardID}
                        />

                        <div className='flex justify-between'>
                            <button
                                className='flex cursor-pointer justify-first gap-3 items-center rounded-lg border-3 border-color1-100 w-35 px-3 py-2 font-primary text-lg text-color1-100 transition-all duration-250 hover:text-color4-100 not-disabled:hover:bg-button disabled:cursor-no-drop disabled:opacity-50'
                                onClick={previousCard}
                                disabled={cardID === 0}
                            >
                                <IconArrowLeft />
                                <span>Voltar</span>
                            </button>

                            {cardID === content.length - 1 ? (
                                <>
                                    <button
                                        className='flex cursor-pointer justify-center items-center rounded-lg bg-button w-35 px-3 py-2 font-primary text-lg text-color4-400 transition-all duration-250 not-disabled:hover:shadow-lg-hard disabled:cursor-no-drop disabled:opacity-50'
                                        onClick={() => setClose(true)}
                                    >
                                        <span>Finalizar</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        className='flex cursor-pointer justify-end px-3 gap-3 items-center rounded-lg border-3 border-color1-100 w-35 py-2 font-primary text-lg text-color1-100 transition-all duration-250 hover:text-color4-100 not-disabled:hover:bg-button disabled:cursor-no-drop disabled:opacity-50'
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
