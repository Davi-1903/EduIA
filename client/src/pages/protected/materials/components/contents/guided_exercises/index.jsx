import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import Introduction from './components/introduction';
import Questions from './components/Questions';

export default function GuidedExercises({ discipline, subject, difficulty, content, setContent }) {
    const materialRef = useRef(null);
    const [start, setStart] = useState(false);
    const [isClose, setClose] = useState(false);

    const tipo = content?.type; // 'multiple_choice' | 'true_or_false' | 'discursive'
    const questoes = Array.isArray(content) ? content : [];

    function handleAnimationEnd(event) {
        if (event.target !== event.currentTarget) return;
        if (isClose) setContent(null);
    }

    useEffect(() => {
        function handleClick(event) {
            if (!materialRef.current?.contains(event.target) && (!start || confirm('Deseja sair do exercício guiado?')))
                setClose(true);
        }

        function handleKey(event) {
            if (event.key === 'Escape' && (!start || confirm('Deseja sair do execício guiado?'))) setClose(true);
        }

        document.addEventListener('mousedown', handleClick);
        document.addEventListener('keydown', handleKey);
        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('keydown', handleKey);
        }
    }, [start]);

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
                className='flex h-170 w-full max-w-160 flex-col gap-6 overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl shadow-color1-100/15 lg:w-4/5'
            >
                {!start ? (
                    <Introduction
                        discipline={discipline}
                        subject={subject}
                        difficulty={difficulty}
                        questionsLength={questoes.length}
                        handleClose={() => setClose(true)}
                        handleStart={() => setStart(true)}
                    />
                ) : questoes.length === 0 ? (
                    <div className='flex flex-1 flex-col items-center justify-center gap-6'>
                        <p className='font-secundary text-lg text-color1-100'>Nenhuma questão encontrada.</p>
                        <button
                            className='cursor-pointer rounded-xl border-3 border-color1-100 px-8 py-2 font-secundary text-lg font-bold text-color1-100'
                            onClick={() => setClose(true)}
                        >
                            Fechar
                        </button>
                    </div>
                ) : (
                    <Questions
                        discipline={discipline}
                        difficulty={difficulty}
                        tipo={tipo}
                        questoes={questoes}
                        onFinish={() => setClose(true)}
                    />
                )}
            </main>
        </div>
    );
}
