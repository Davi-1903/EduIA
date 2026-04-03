import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import ProtectedRoute from '../../../../components/protectedRoute';
import FlashcardModal from './flashcard';

export default function Flashcard() {
    const [open, setOpen] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();
        setOpen(true);
    }

    return (
        <ProtectedRoute isPrivate={true}>
            <Helmet>
                <title>EduIA | Flashcards</title>
                <meta name='description' content='Flashcards do Sistema EduIA' />
            </Helmet>

            <main className='min-h-screen w-full flex flex-col items-center justify-center px-6 py-16 gap-10 bg-linear-to-br from-color4-200 to-indigo-100'>

                <h1 className='text-3xl md:text-5xl font-bold text-color1-400 text-center leading-tight'>
                    Aprenda de forma eficiente <br />
                    com Flashcards
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className='w-full max-w-md bg-white p-8 rounded-2xl shadow-lg flex flex-col gap-5'
                >
                    <div className='flex flex-col gap-1'>
                        <label className='font-medium text-gray-700'>
                            Assunto
                        </label>
                        <input
                            type='text'
                            className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-color1-400 outline-none'
                            required
                        />
                    </div>

                    <div className='flex flex-col gap-1'>
                        <label className='font-medium text-gray-700'>
                            Quantidade
                        </label>
                        <input
                            type='number'
                            className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-color1-400 outline-none'
                            required
                        />
                    </div>

                    <button
                        type='submit'
                        className='mt-4 bg-color2-200 hover:bg-color1-400 text-white font-semibold py-2 rounded-lg transition'
                    >
                        Gerar Flashcards
                    </button>
                </form>

                {/* Modal */}
                <FlashcardModal
                    isOpen={open}
                    onClose={() => setOpen(false)}
                />

            </main>
        </ProtectedRoute>
    );
}