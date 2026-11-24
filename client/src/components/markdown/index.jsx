import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export default function MarkDown({ children }) {
    const normalize = str => str.replace(/\\n/g, '\n');

    if (typeof children !== 'string') return null;
    return (
        <div className='w-full text-base wrap-break-word sm:text-lg md:text-2xl'>
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                    h1: ({ children }) => (
                        <h1 className='mb-3 bg-linear-to-tr from-color1-100 to-color4-100 bg-clip-text text-2xl font-bold wrap-break-word text-transparent'>
                            {children}
                        </h1>
                    ),
                    h2: ({ children }) => (
                        <h2 className='mt-5 mb-3 bg-linear-to-tr from-color1-100 to-color4-100 bg-clip-text text-xl font-bold wrap-break-word text-transparent'>
                            {children}
                        </h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className='mt-4 mb-2 bg-linear-to-tr from-color1-100 to-color4-100 bg-clip-text text-lg font-semibold wrap-break-word text-transparent'>
                            {children}
                        </h3>
                    ),
                    p: ({ children }) => (
                        <p className='mb-4 text-lg leading-relaxed wrap-break-word whitespace-pre-wrap'>{children}</p>
                    ),
                    ul: ({ children }) => <ul className='mb-4 list-disc space-y-2 pl-5 sm:pl-8'>{children}</ul>,
                    ol: ({ children }) => <ol className='mb-4 list-decimal space-y-2 pl-5 sm:pl-8'>{children}</ol>,
                    li: ({ children }) => <li className='text-lg leading-relaxed wrap-break-word'>{children}</li>,
                    strong: ({ children }) => <strong className='font-bold'>{children}</strong>,
                    em: ({ children }) => <em className='italic'>{children}</em>,
                    table: ({ children }) => (
                        <div className='my-4 w-full overflow-x-auto rounded-lg'>
                            <table className='w-full border-collapse text-sm'>{children}</table>
                        </div>
                    ),
                    thead: ({ children }) => <thead className='bg-color1-100 text-white'>{children}</thead>,
                    th: ({ children }) => (
                        <th className='border border-gray-300 px-2 py-2 text-sm font-semibold'>{children}</th>
                    ),
                    td: ({ children }) => <td className='border border-gray-300 px-2 py-2 text-sm'>{children}</td>,
                }}
            >
                {normalize(children) ?? 'Erro na exibição da explicação'}
            </ReactMarkdown>
        </div>
    );
}
