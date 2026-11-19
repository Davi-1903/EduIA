import ReactMarkdown from 'react-markdown';

const base = {
    strong: ({ children }) => <strong className='font-bold'>{children}</strong>,
    em: ({ children }) => <em className='italic'>{children}</em>,
    code: ({ children }) => <span>{children}</span>,
};

const inline = {
    ...base,
    p: ({ children }) => <>{children}</>,
};

const block = {
    ...base,
    p: ({ children }) => <p className='mt-2 leading-relaxed'>{children}</p>,
    ul: ({ children }) => <ul className='mt-2 ml-5 list-disc space-y-1'>{children}</ul>,
    ol: ({ children }) => <ol className='mt-2 ml-5 list-decimal space-y-1'>{children}</ol>,
};

export default function Markdown({ children, inline: emLinha = false }) {
    return <ReactMarkdown components={emLinha ? inline : block}>{children ?? ''}</ReactMarkdown>;
}