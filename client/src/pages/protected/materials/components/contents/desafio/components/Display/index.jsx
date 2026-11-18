import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function Display({ content, discipline, subject }) {
    const [answer, setAnswer] = useState(false);
    const normalize = str => str.replace(/\\n/g, '\n');

    return (
        <>
            <h1 className='text-center font-primary text-2xl font-bold text-color1-100'>
                Desafio de {discipline ?? subject}
            </h1>

            <div className='rounded-xl bg-color4-100 p-6 font-secundary text-base leading-relaxed text-color1-100'>
                <ReactMarkdown
                    components={{
                        h1: ({ children }) => (
                            <h1 className='mb-3 text-2xl font-bold wrap-break-word text-color1-100'>{children}</h1>
                        ),
                        h2: ({ children }) => (
                            <h2 className='mt-5 mb-3 text-xl font-bold wrap-break-word text-color1-100'>{children}</h2>
                        ),
                        h3: ({ children }) => (
                            <h3 className='mt-4 mb-2 text-lg font-semibold wrap-break-word text-color1-100'>
                                {children}
                            </h3>
                        ),
                        p: ({ children }) => (
                            <p className='mb-4 text-lg leading-relaxed wrap-break-word whitespace-pre-wrap'>
                                {children}
                            </p>
                        ),
                        ul: ({ children }) => <ul className='mb-4 list-disc space-y-2 pl-5 sm:pl-8'>{children}</ul>,
                        ol: ({ children }) => <ol className='mb-4 list-decimal space-y-2 pl-5 sm:pl-8'>{children}</ol>,
                        li: ({ children }) => <li className='text-lg leading-relaxed wrap-break-word'>{children}</li>,
                        strong: ({ children }) => <strong className='font-bold'>{children}</strong>,
                        em: ({ children }) => <em className='italic'>{children}</em>,
                    }}
                >
                    {normalize(content[0].question)}
                </ReactMarkdown>
            </div>
            {!answer ? (
                <button
                    onClick={() => setAnswer(true)}
                    className='h-12 cursor-pointer rounded-lg bg-button text-xl text-color4-100'
                >
                    Revelar
                </button>
            ) : (
                <>
                    <h1 className='text-center font-primary text-2xl font-bold text-color1-100'> Resposta </h1>
                    <div className='rounded-xl bg-color4-100 p-6 font-secundary text-base leading-relaxed text-color1-100'>
                        <ReactMarkdown
                            components={{
                                h1: ({ children }) => (
                                    <h1 className='mb-3 text-2xl font-bold wrap-break-word text-color1-100'>
                                        {children}
                                    </h1>
                                ),
                                h2: ({ children }) => (
                                    <h2 className='mt-5 mb-3 text-xl font-bold wrap-break-word text-color1-100'>
                                        {children}
                                    </h2>
                                ),
                                h3: ({ children }) => (
                                    <h3 className='mt-4 mb-2 text-lg font-semibold wrap-break-word text-color1-100'>
                                        {children}
                                    </h3>
                                ),
                                p: ({ children }) => (
                                    <p className='mb-4 text-lg leading-relaxed wrap-break-word whitespace-pre-wrap'>
                                        {children}
                                    </p>
                                ),
                                ul: ({ children }) => (
                                    <ul className='mb-4 list-disc space-y-2 pl-5 sm:pl-8'>{children}</ul>
                                ),
                                ol: ({ children }) => (
                                    <ol className='mb-4 list-decimal space-y-2 pl-5 sm:pl-8'>{children}</ol>
                                ),
                                li: ({ children }) => (
                                    <li className='text-lg leading-relaxed wrap-break-word'>{children}</li>
                                ),
                                strong: ({ children }) => <strong className='font-bold'>{children}</strong>,
                                em: ({ children }) => <em className='italic'>{children}</em>,
                            }}
                        >
                            {normalize(content[0].answer)}
                        </ReactMarkdown>
                    </div>
                </>
            )}
        </>
    );
}
