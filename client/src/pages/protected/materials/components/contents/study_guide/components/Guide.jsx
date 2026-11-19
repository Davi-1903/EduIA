import clsx from 'clsx';
import { IconReorder } from '@tabler/icons-react';

function separarSecoes(markdown) {
    const secoes = {};
    let atual = null;

    for (const linha of markdown.split('\n')) {
        if (linha.startsWith('## ')) {
            atual = linha.slice(3).trim().toLowerCase();
            secoes[atual] = [];
        } else if (atual && !linha.startsWith('# ')) {
            secoes[atual].push(linha);
        }
    }
    return secoes;
}

function buscarSecao(secoes, ...chaves) {
    const nome = Object.keys(secoes).find(k => chaves.some(c => k.includes(c)));
    return nome ? secoes[nome] : null;
}

function interpretarEtapa(texto) {
    const m = texto.match(/^(.*?)\s*\((\d+)\s*min\)\s*[:\-–]?\s*([\s\S]*)$/);
    if (m) return { titulo: m[1].trim(), duracao: Number(m[2]), descricao: m[3].trim() };
    return { titulo: texto.trim(), duracao: null, descricao: '' };
}

function listarEtapas(linhas) {
    const etapas = [];

    for (const linha of linhas) {
        const item = linha.match(/^\s*\d+[.)]\s+(.*)/);
        if (item) etapas.push(item[1]);
        else if (linha.trim() && etapas.length) etapas[etapas.length - 1] += `\n${linha.trim()}`;
    }
    return etapas.map(interpretarEtapa);
}

export default function Guide({ discipline, subject, content }) {
    const markdown = (typeof content === 'string' ? content : content?.content) ?? '';
    const secoes = separarSecoes(markdown);

    const linhasEtapas = buscarSecao(secoes, 'etapa', 'roteiro', 'desenvolvimento') ?? markdown.split('\n');
    const etapas = listarEtapas(linhasEtapas);

    return (
        <article className='flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-2xl shadow-color1-100/15'>
            <header className='flex items-center justify-between gap-3'>
                <div className='flex items-center gap-3'>
                    <div className='rounded-full bg-black/3 p-4'>
                        <IconReorder
                            size={30}
                            className='stroke-color1-100'
                        />
                    </div>
                    <div>
                        <h2 className='font-primary text-xl font-bold text-color1-100'>Roteiro de estudo</h2>
                        <div className='text-md font-secundary'>
                            {discipline && <span className='block font-medium text-color1-100'>{discipline}</span>}
                            {subject && <span className='block text-color1-100/70'>{subject}</span>}
                        </div>
                    </div>
                </div>
            </header>

            {subject && <h3 className='font-primary text-xl font-bold text-color1-100'>{subject}</h3>}

            {etapas.length > 0 && (
                <ol className='flex flex-col gap-4'>
                    {etapas.map((etapa, i) => (
                        <li
                            key={i}
                            className={clsx(
                                'flex flex-col gap-2 pb-4',
                                i < etapas.length - 1 && 'border-b-2 border-color4-100',
                            )}
                        >
                            <div className='flex items-center gap-3'>
                                <span className='grid size-8 shrink-0 place-items-center rounded-full bg-color1-100 font-secundary text-base font-bold text-white'>
                                    {i + 1}
                                </span>
                                <h4 className='font-primary text-base font-bold text-color1-100'>
                                    {etapa.titulo}
                                    {etapa.duracao && ` (${etapa.duracao} min)`}
                                </h4>
                            </div>
                            {etapa.descricao && (
                                <p className='text-md pl-11 font-secundary whitespace-pre-line text-color1-100'>
                                    {etapa.descricao}
                                </p>
                            )}
                        </li>
                    ))}
                </ol>
            )}
        </article>
    );
}
