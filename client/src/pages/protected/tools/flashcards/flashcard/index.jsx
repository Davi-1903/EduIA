import { useState } from 'react';
import clsx from 'clsx';

export default function FlashcardModal({ isOpen, onClose }) {
    const [flipped, setFlipped] = useState(false);

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
            <div
                className='absolute inset-0 bg-black/30 backdrop-blur-sm'
                onClick={onClose}
            />
            <div className='relative flex flex-col items-center gap-6'>
                <h2 className='text-xl font-semibold text-white'>Flashcard</h2>
                <div
                    className='h-[200px] w-[30vw] max-w-2xl cursor-pointer perspective-distant md:h-[300px]'
                    onClick={() => setFlipped(!flipped)}
                >
                    <div
                        className={clsx('relative h-full w-full duration-500 transform-3d', flipped && 'rotate-y-180')}
                    >
                        <div className='absolute flex h-full w-full items-center justify-center rounded-2xl bg-white p-6 text-center shadow-xl backface-hidden'>
                            <p className='font-medium text-gray-800'>O que é fotossíntese?</p>
                        </div>

                        <div className='absolute flex h-full w-full rotate-y-180 items-center justify-center rounded-2xl bg-color1-400 p-6 text-center text-white shadow-xl backface-hidden'>
                            <p>Processo em que plantas convertem luz em energia química.</p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className='rounded-lg bg-white/90 px-6 py-2 font-semibold text-color1-400 transition hover:bg-white'
                >
                    Fechar
                </button>
            </div>
        </div>
    );
}
