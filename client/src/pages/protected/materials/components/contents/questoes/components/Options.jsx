import { IconArrowRight } from '@tabler/icons-react';
import clsx from 'clsx';

export default function Options({
    questions,
    currentQuestionId,
    answerId,
    showAnswer,
    nextQuestion,
    toRespond,
    setShowExplanation,
}) {
    const letters = ['A', 'B', 'C', 'D'];

    function getColor(id) {
        if ((answerId === id || showAnswer) && questions[currentQuestionId].correctAnswerId === id)
            return 'border-green-400 text-green-400';
        if (answerId === id && questions[currentQuestionId].correctAnswerId !== id)
            return 'border-red-600 text-red-600';
        return 'border-color4-50 text-color1-100';
    }

    return (
        <>
            <ul className='grid gap-4'>
                {questions[currentQuestionId].answers.map(options => (
                    <li key={options.id}>
                        <button
                            className={clsx(
                                'w-full cursor-pointer rounded-xl border-2 p-4 text-left font-secundary text-base font-semibold text-color1-100 transition-all duration-300 ring-inset hover:scale-102',
                                getColor(options.id),
                            )}
                            onClick={() => toRespond(options.id)}
                        >
                            <span className='text-color1-400'>
                                {letters[options.id - 1] ?? options.id}
                                {')'}{' '}
                            </span>
                            {options.text}
                        </button>
                    </li>
                ))}
            </ul>
            <div className='flex justify-end gap-4'>
                <button
                    className='cursor-pointer rounded-lg border-3 border-color1-100 px-6 py-2 font-primary text-lg text-color1-100 transition-all duration-250 not-disabled:hover:bg-button not-disabled:hover:text-color4-400 disabled:cursor-no-drop disabled:opacity-50'
                    onClick={() => setShowExplanation(true)}
                    disabled={answerId === null}
                >
                    Explicação
                </button>
                <button
                    className='flex cursor-pointer items-center gap-3 rounded-lg bg-button px-6 py-2 font-primary text-lg text-color4-400 transition-all duration-250 not-disabled:hover:shadow-lg-hard disabled:cursor-no-drop disabled:opacity-50'
                    disabled={answerId === null}
                    onClick={nextQuestion}
                >
                    <span>Próximo</span>
                    <IconArrowRight />
                </button>
            </div>
        </>
    );
}
