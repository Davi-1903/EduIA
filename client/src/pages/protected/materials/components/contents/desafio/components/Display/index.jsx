import { useState } from 'react';
import MarkDown from '../../../../../../../../components/markdown';

export default function Display({ content, discipline, subject }) {
    const [answer, setAnswer] = useState(false);

    return (
        <>
            <h1 className='bg-linear-to-tr from-color1-400 to-color4-25 bg-clip-text text-center font-primary text-2xl font-bold text-transparent md:text-3xl'>
                Desafio de {discipline ?? subject}
            </h1>

            <div className='rounded-xl bg-color4-100/60 px-3 pt-4 pb-0 font-secundary text-base leading-relaxed text-color1-100'>
                <MarkDown>{content[0].question}</MarkDown>
            </div>
            {!answer ? (
                <button
                    onClick={() => setAnswer(true)}
                    className='min-h-12 cursor-pointer rounded-lg bg-button text-xl text-color4-100'
                >
                    Revelar
                </button>
            ) : (
                <>
                    <h1 className='bg-linear-to-tr from-color1-400 to-color4-25 bg-clip-text text-center font-primary text-2xl font-bold text-transparent md:text-3xl'>
                        Resposta
                    </h1>
                    <div className='rounded-xl bg-color4-100/60 px-3 pt-4 pb-0 font-secundary text-base leading-relaxed text-color1-100'>
                        <MarkDown>{content[0].answer}</MarkDown>
                    </div>
                </>
            )}
        </>
    );
}
