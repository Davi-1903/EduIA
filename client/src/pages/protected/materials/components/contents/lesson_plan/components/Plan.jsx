import clsx from 'clsx';
import { IconChalkboard } from '@tabler/icons-react';

const RECURSOS = [
    { campo: 'chalkboard', texto: 'Quadro e giz' },
    { campo: 'projector', texto: 'Projetor multimídia' },
    { campo: 'printed', texto: 'Atividades impressas' },
    { campo: 'digital', texto: 'Tecnologias digitais' },
];

// Separa o markdown em seções ("## Título") e guarda as linhas de cada uma
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

// "Introdução (10 min): texto" -> { titulo, duracao, descricao }
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

export default function Plan({ subject, grade, duration, objective, resources = {}, content, onDetail }) {
    // content pode ser a string em markdown ou o objeto { content: '...' } vindo do banco
    const markdown = (typeof content === 'string' ? content : content?.content) ?? '';
    const secoes = separarSecoes(markdown);

    const objetivo = objective ?? buscarSecao(secoes, 'objetivo')?.join(' ').trim() ?? '';
    const etapas = listarEtapas(buscarSecao(secoes, 'etapa', 'desenvolvimento') ?? []);

    const recursosMarkdown = (buscarSecao(secoes, 'recurso') ?? [])
        .map(l => l.match(/^\s*[-*]\s+(.*)/)?.[1])
        .filter(Boolean);
    const recursos = recursosMarkdown.length
        ? recursosMarkdown
        : RECURSOS.filter(r => resources[r.campo]).map(r => r.texto);

    return (
        <article className='flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-2xl shadow-color1-100/15'>
            {/* Cabeçalho */}
            <header className='flex items-center justify-between gap-3'>
                <div className='flex items-center gap-3'>
                    <div className='rounded-full bg-black/3 p-4'>
                        <IconChalkboard size={30} className='stroke-color1-100' />
                    </div>
                    <div>
                        <h2 className='font-primary text-xl font-bold text-color1-100'>Plano de aula</h2>
                        <span className='block font-secundary text-md text-color1-100/70'>
                            {[subject, grade, duration && `${duration} min`].filter(Boolean).join(' · ')}
                        </span>
                    </div>
                </div>
            </header>

            {/* Objetivo */}
            {objetivo && (
                <section className='flex flex-col gap-2'>
                    <h3 className='font-primary text-lg font-bold text-color1-100'>Objetivo</h3>
                    <p className='font-secundary text-md text-color1-100'>{objetivo}</p>
                </section>
            )}

            {/* Recursos de ensino */}
            {recursos.length > 0 && (
                <section className='flex flex-col gap-2'>
                    <h3 className='font-primary text-lg font-bold text-color1-100'>Recursos de ensino</h3>
                    <ul className='list-disc pl-6 font-secundary text-md text-color1-100'>
                        {recursos.map(r => (
                            <li key={r}>{r}</li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Desenvolvimento da aula */}
            {etapas.length > 0 && (
                <section className='flex flex-col gap-4 border-t-2 border-color4-100 pt-5'>
                    <h3 className='font-primary text-lg font-bold text-color1-100'>Desenvolvimento da aula</h3>
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
                                    <p className='whitespace-pre-line pl-11 font-secundary text-md text-color1-100'>
                                        {etapa.descricao}
                                    </p>
                                )}
                            </li>
                        ))}
                    </ol>
                </section>
            )}

            {onDetail && (
                <button
                    type='button'
                    onClick={onDetail}
                    className='ml-auto cursor-pointer rounded-xl bg-button px-4 py-2 font-secundary text-base font-bold text-color4-400 transition-all duration-250 hover:shadow-lg-hard'
                >
                    Mais detalhado
                </button>
            )}
        </article>
    );
}