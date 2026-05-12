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
                <meta
                    name='description'
                    content='Flashcards do Sistema EduIA'
                />
            </Helmet>
            <main className='flex min-h-screen w-full flex-col items-center justify-center gap-10 bg-linear-to-br from-color4-200 to-indigo-100 px-6 py-16'>
                <h1 className='text-center text-3xl leading-tight font-bold text-color1-400 md:text-5xl'>
                    Aprenda de forma eficiente <br />
                    com Flashcards
                </h1>
                <form
                    onSubmit={handleSubmit}
                    className='flex w-full max-w-md flex-col gap-5 rounded-2xl bg-white p-8 shadow-lg'
                >
                    <div className='flex flex-col gap-1'>
                        <label className='font-medium text-gray-700'>Assunto</label>
                        <input
                            type='text'
                            className='rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-color1-400'
                            required
                        />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label className='font-medium text-gray-700'>Quantidade</label>
                        <input
                            type='number'
                            className='rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-color1-400'
                            min={1}
                            required
                        />
                    </div>
                    <button
                        type='submit'
                        className='mt-4 rounded-lg bg-color2-200 py-2 font-semibold text-white transition hover:bg-color1-400'
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
