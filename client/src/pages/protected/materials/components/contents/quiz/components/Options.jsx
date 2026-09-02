import { IconArrowRight } from '@tabler/icons-react';
import clsx from 'clsx';

export default function Options({ questions, currentQuestionId, answeredId, toRespond, handleClick }) {
    function getColor(id) {
        if (answeredId !== null && questions[currentQuestionId].correctAnswerId === id)
            return 'border-green-600 text-green-600';
        if (answeredId === id && questions[currentQuestionId].correctAnswerId !== id)
            return 'border-red-600 text-red-600';
        return 'border-color4-50 text-color1-100';
    }

    return (
        <>
            <ul className='grid grid-cols-2 gap-4'>
                {questions[currentQuestionId].answers.map(options => (
                    <li key={options.id}>
                        <button
                            className={clsx(
                                'h-full w-full cursor-pointer rounded-xl border-2 p-4 text-left font-secundary text-base font-semibold text-color1-100 transition-all duration-300 ring-inset hover:scale-102',
                                getColor(options.id),
                            )}
                            onClick={() => handleClick(options.id)}
                        >
                            {options.text}
                        </button>
                    </li>
                ))}
            </ul>
            <div className='flex justify-end'>
                <button
                    className='flex cursor-pointer items-center gap-3 rounded-lg bg-button px-6 py-2 font-primary text-lg text-color4-400 transition-all duration-250 not-disabled:hover:shadow-lg-hard disabled:cursor-no-drop disabled:opacity-50'
                    disabled={answeredId === null}
                    onClick={() => toRespond(answeredId === questions[currentQuestionId].correctAnswerId)}
                >
                    <span>Próximo</span>
                    <IconArrowRight />
                </button>
            </div>
        </>
    );
}
