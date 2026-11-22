import { IconCircleCheck, IconListCheck, IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';

function getNoteColor(note) {
    if (note >= 7) return '#00c950';
    if (note >= 4) return '#f0b100';
    return '#e7000b';
}

function getResult(average) {
    if (average < 2) {
        return {
            message: 'Resultado insuficiente',
            description: 'Você precisa estudar mais! Revise o conteúdo e tente novamente.',
        };
    }
    if (average < 4) {
        return {
            message: 'Resultado com potencial de melhora',
            description: 'Não foi o melhor resultado, mas é possível melhorar bastante. Continue tentando.',
        };
    }
    if (average < 6) {
        return {
            message: 'Resultado mediano',
            description: 'Bom começo! Com mais dedicação você vai melhorar significativamente.',
        };
    }
    if (average < 8) {
        return {
            message: 'Excelente resultado!',
            description: 'Muito bom! Você demonstra domínio do conteúdo. Parabéns!',
        };
    }
    if (average < 10) {
        return {
            message: 'Resultado muito bom!',
            description: 'Quase perfeito! Revise os detalhes e na próxima vez você pode chegar ao 10!',
        };
    }
    return {
        message: 'Resultado PERFEITO!',
        description: 'Ótimo desempenho! Continue assim e nada poderá te parar!',
    };
}

export default function End({ discipline, subject, questionsLength, content, correction, handleClose }) {
    const notes = correction?.answers ?? [];
    const hasNotes = notes.length > 0;

    const results = notes.map(item => Number(item.result)).filter(Number.isFinite);
    const average = results.length > 0 ? results.reduce((sum, value) => sum + value, 0) / results.length : null;
    const best = results.length > 0 ? Math.max(...results) : null;
    const worst = results.length > 0 ? Math.min(...results) : null;

    const percentage = average !== null ? Math.max(0, Math.min(100, average * 10)) : 0;
    const color = average !== null ? getNoteColor(average) : '#9ca3af';

    const radius = 62;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference - (percentage / 100) * circumference;

    return (
        <article className='flex h-full w-full flex-col gap-3 md:gap-6'>
            <div className='flex items-center gap-2'>
                <IconCircleCheck
                    size={20}
                    strokeWidth={2.5}
                    className='stroke-green-500'
                />
                <span className='font-secundary text-sm font-bold text-green-500'>RESPOSTAS ENVIADAS COM SUCESSO</span>
            </div>

            <div className='flex flex-col gap-1'>
                <h2 className='bg-linear-to-tr from-color1-400 to-color4-25 bg-clip-text font-primary text-3xl font-extrabold text-transparent md:text-4xl'>
                    Parabéns! Você concluiu!
                </h2>
                <p className='font-secundary text-base text-color1-100/70'>
                    Você respondeu {questionsLength} {questionsLength === 1 ? 'pergunta' : 'perguntas'} do formulário de{' '}
                    {discipline ?? subject}.
                </p>
            </div>

            {average !== null && (
                <>
                    <div className='flex flex-wrap items-center gap-8 py-2'>
                        <div className='relative grid aspect-square h-36 flex-1 place-items-center'>
                            <svg
                                className='h-36 w-36 -rotate-90'
                                viewBox='0 0 160 160'
                                aria-label='Nota final'
                            >
                                <circle
                                    cx='80'
                                    cy='80'
                                    r={radius}
                                    fill='none'
                                    stroke='rgba(58, 58, 74, 0.2)'
                                    strokeWidth='12'
                                />
                                <circle
                                    cx='80'
                                    cy='80'
                                    r={radius}
                                    fill='none'
                                    stroke={color}
                                    strokeWidth='12'
                                    strokeLinecap='round'
                                    strokeDasharray={circumference}
                                    strokeDashoffset={circumference}
                                    style={{
                                        animation: 'progress-ring 900ms ease-out forwards',
                                        '--progress-total': `${circumference}`,
                                        '--progress-final': `${dashOffset}`,
                                    }}
                                />
                            </svg>
                            <div className='absolute inset-0 flex flex-col items-center justify-center gap-0.5 rounded-full'>
                                <span className='block font-secundary text-2xl font-extrabold text-color1-100'>
                                    {average.toFixed(1)}/10
                                </span>
                                <span
                                    className='block font-secundary text-[12px] font-bold'
                                    style={{ color }}
                                >
                                    NOTA FINAL
                                </span>
                            </div>
                        </div>

                        <div
                            className='flex-1 basis-48 rounded-xl p-4'
                            style={{ backgroundColor: `hsl(from ${color} h s l/0.1)` }}
                        >
                            <span
                                className='mb-2 block font-secundary text-lg font-bold'
                                style={{ color }}
                            >
                                {getResult(average).message}
                            </span>
                            <p className='font-secundary text-base text-color1-100'>
                                {getResult(average).description}
                            </p>
                        </div>
                    </div>

                    <div className='flex flex-wrap gap-4'>
                        <article className='flex-1 rounded-xl border-2 border-color4-100 p-4'>
                            <div className='mb-2 flex items-center gap-2'>
                                <IconListCheck
                                    size={22}
                                    strokeWidth={2.5}
                                    className='stroke-color1-100'
                                />
                                <span className='font-secundary text-sm font-semibold text-color3-100/75'>
                                    Perguntas
                                </span>
                            </div>
                            <span className='font-secundary text-3xl font-extrabold text-color1-100'>
                                {questionsLength}
                            </span>
                        </article>

                        <article className='flex-1 rounded-xl border-2 border-color4-100 p-4'>
                            <div className='mb-2 flex items-center gap-2'>
                                <IconTrendingUp
                                    size={22}
                                    strokeWidth={2.5}
                                    className='stroke-green-500'
                                />
                                <span className='font-secundary text-sm font-semibold text-color3-100/75'>
                                    Melhor nota
                                </span>
                            </div>
                            <span
                                className='font-secundary text-3xl font-extrabold'
                                style={{ color: getNoteColor(best) }}
                            >
                                {best}
                            </span>
                        </article>

                        <article className='flex-1 rounded-xl border-2 border-color4-100 p-4'>
                            <div className='mb-2 flex items-center gap-2'>
                                <IconTrendingDown
                                    size={22}
                                    strokeWidth={2.5}
                                    className='stroke-red-600'
                                />
                                <span className='font-secundary text-sm font-semibold text-color3-100/75'>
                                    Menor nota
                                </span>
                            </div>
                            <span
                                className='font-secundary text-3xl font-extrabold'
                                style={{ color: getNoteColor(worst) }}
                            >
                                {worst}
                            </span>
                        </article>
                    </div>
                </>
            )}

            {hasNotes && (
                <div className='flex flex-col gap-3'>
                    <h3 className='font-primary text-xl font-bold text-color1-100'>Correção</h3>

                    {content.map((question, index) => {
                        const note = notes.find(item => String(item.id) === String(question.id))?.result;

                        return (
                            <div
                                key={question.id}
                                className='flex flex-col gap-2 rounded-xl border-2 border-color4-100 p-4'
                            >
                                <div className='flex items-start justify-between gap-4'>
                                    <p className='font-secundary font-bold text-color1-100'>
                                        {index + 1}. {question.question}
                                    </p>
                                    <p
                                        className='shrink-0 font-primary text-lg font-extrabold'
                                        style={{ color: getNoteColor(note ?? 0) }}
                                    >
                                        {note ?? '-'} / 10
                                    </p>
                                </div>

                                <p className='font-secundary text-sm text-color1-100/70'>
                                    <span className='font-bold'>Resposta esperada:</span> {question.expectedAnswer}
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}

            <button
                className='cursor-pointer rounded-lg bg-button px-8 py-2 font-secundary text-lg font-bold text-color4-400 transition-all duration-250 hover:shadow-lg-hard'
                onClick={handleClose}
            >
                Concluir
            </button>
        </article>
    );
}