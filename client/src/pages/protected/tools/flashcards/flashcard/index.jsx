import { useState } from 'react';

export default function FlashcardModal({ isOpen, onClose }) {
    const [flipped, setFlipped] = useState(false);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center ">

            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative flex flex-col items-center gap-6">

                <h2 className="text-white text-xl font-semibold">
                    Flashcard
                </h2>

                <div
                    className="w-[30vw] max-w-2xl h-[200px] md:h-[300px] perspective cursor-pointer"
                    onClick={() => setFlipped(!flipped)}
                >
                    <div
                        className={`relative w-full h-full duration-500 transform-style-preserve-3d ${
                            flipped ? 'rotate-y-180' : ''
                        }`}
                    >

                        <div className="absolute w-full h-full backface-hidden bg-white rounded-2xl shadow-xl flex items-center justify-center p-6 text-center">
                            <p className="text-gray-800 font-medium">
                                O que é fotossíntese?
                            </p>
                        </div>

                        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-color1-400 text-white rounded-2xl shadow-xl flex items-center justify-center p-6 text-center">
                            <p>
                                Processo em que plantas convertem luz em energia química.
                            </p>
                        </div>

                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="bg-white/90 hover:bg-white text-color1-400 px-6 py-2 rounded-lg font-semibold transition"
                >
                    Fechar
                </button>

            </div>
        </div>
    );
}