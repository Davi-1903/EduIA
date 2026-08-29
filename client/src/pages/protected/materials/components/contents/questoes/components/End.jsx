import { IconCheck, IconCircleCheck, IconClock, IconX } from '@tabler/icons-react';

export default function End({ questions, corrects, time, handleRestart, setClose }) {
    const safeQuestionsLength = questions.length || 0;
    const percentage = safeQuestionsLength > 0 ? (corrects / safeQuestionsLength) * 100 : 0;
    const safePercentage = Number.isFinite(percentage) ? Math.max(0, Math.min(100, percentage)) : 0;

    const radius = 62;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference - (safePercentage / 100) * circumference;

    function formatTime(time) {
        console.log(time);
        if (time < 1000) return `${time}ms`;

        const segundos = Math.floor((time / 1000) % 60);
        const minutos = Math.floor((time / (1000 * 60)) % 60);
        const horas = Math.floor(time / (1000 * 60 * 60));

        const partes = [];
        if (horas > 0) partes.push(`${horas}h`);
        if (minutos > 0) partes.push(`${minutos}min`);
        if (segundos > 0) partes.push(`${segundos}s`);

        return partes.join(' ');
    }

    function getResult() {
        if (safeQuestionsLength === 0)
            return {
                message: '0 questões...',
                description: 'Nenhuma questão foi respondida...',
            };
        if (safePercentage < 20)
            return {
                message: 'Resultado insuficiente',
                description: 'Você precisa estudar mais! Revise o conteúdo e tente novamente.',
            };
        if (safePercentage < 40)
            return {
                message: 'Resultado com potencial de melhora',
                description:
                    'Não o melhor resultado! Porém, é possível obter uma melhora considerável. Continue tentando.',
            };
        if (safePercentage < 60)
            return {
                message: 'Resultado mediado',
                description: 'Bom começo! Com mais dedicação você vai melhorar significativamente.',
            };
        if (safePercentage < 80)
            return {
                message: 'Excelente resultado!',
                description: 'Muito bom! Você demonstra domínio do conteúdo. Parabéns!',
            };
        if (safePercentage < 100)
            return {
                message: 'Resultado muito bom!',
                description: 'Quase perfeito! Revise apenas os detalhes e próxima vez será 100%!',
            };
        return {
            message: 'Resultado PERFEITO!',
            description: 'Ótimo desempenho! Continue assim e nada poderá te parar!',
        };
    }

    function getColor() {
        if (safePercentage < 20) return '#e7000b';
        if (safePercentage < 60) return '#f0b100';
        return '#00c950';
    }

    return (
        <article className='flex h-full w-full flex-col gap-6'>
            <div className='flex items-center gap-2'>
                <IconCircleCheck
                    size={20}
                    strokeWidth={2.5}
                    className='stroke-green-500'
                />
                <span className='font-secundary text-sm font-bold text-green-500'>QUESTÕES CONCLUÍDA COM SUCESSO</span>
            </div>
            <h2 className='bg-linear-to-tr from-color1-400 to-color4-25 bg-clip-text font-primary text-4xl font-extrabold text-transparent'>
                Parabéns! Você concluiu!
            </h2>
            <div className='flex items-center gap-8 py-2'>
                <div className='relative grid aspect-square h-36 place-items-center'>
                    <svg
                        className='h-36 w-36 -rotate-90'
                        viewBox='0 0 160 160'
                        aria-label='Progresso do teste'
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
                            stroke={getColor()}
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
                            {corrects}/{questions.length}
                        </span>
                        <span
                            className='block font-secundary text-[12px] font-bold'
                            style={{
                                color: getColor(),
                            }}
                        >
                            {safePercentage.toFixed(0)}% ACERTO{' '}
                        </span>
                    </div>
                </div>
                <div
                    className='flex-1 rounded-xl p-4'
                    style={{
                        backgroundColor: `hsl(from ${getColor()} h s l/0.1)`,
                    }}
                >
                    <span
                        className='mb-2 block font-secundary text-lg font-bold'
                        style={{ color: getColor() }}
                    >
                        {getResult().message}
                    </span>
                    <p className='font-secundary text-base text-color1-100'>{getResult().description}</p>
                </div>
            </div>
            <div className='flex gap-4'>
                <article className='flex-1 rounded-xl border-2 border-color4-100 p-4'>
                    <div className='mb-2 flex items-center gap-2'>
                        <IconCheck
                            size={22}
                            strokeWidth={2.5}
                            className='stroke-green-500'
                        />
                        <span className='font-secundary text-sm font-semibold text-color3-100/75'>Acertos</span>
                    </div>
                    <span className='font-secundary text-3xl font-extrabold text-green-500'>{corrects}</span>
                </article>
                <article className='flex-1 rounded-xl border-2 border-color4-100 p-4'>
                    <div className='mb-2 flex items-center gap-2'>
                        <IconX
                            size={22}
                            strokeWidth={2.5}
                            className='stroke-red-600'
                        />
                        <span className='font-secundary text-sm font-semibold text-color3-100/75'>Erros</span>
                    </div>
                    <span className='font-secundary text-3xl font-extrabold text-red-600'>
                        {questions.length - corrects}
                    </span>
                </article>
                <article className='flex-1 rounded-xl border-2 border-color4-100 p-4'>
                    <div className='mb-2 flex items-center gap-2'>
                        <IconClock
                            size={22}
                            strokeWidth={2.5}
                            className='stroke-color1-100'
                        />
                        <span className='font-secundary text-sm font-semibold text-color3-100/75'>Tempo</span>
                    </div>
                    <span className='font-secundary text-3xl font-extrabold text-color1-100'>{formatTime(time)}</span>
                </article>
            </div>
            <div className='flex gap-4'>
                <button
                    className='flex-1 cursor-pointer rounded-lg border-2 border-color1-100 px-8 py-2 font-secundary text-lg font-bold text-color1-100 transition-all duration-250 hover:bg-button hover:text-color4-400'
                    onClick={handleRestart}
                >
                    Reiniciar
                </button>
                <button
                    className='flex-1 cursor-pointer rounded-lg bg-button px-8 py-2 font-secundary text-lg font-bold text-color4-400 transition-all duration-250 hover:shadow-lg-hard'
                    onClick={() => setClose(true)}
                >
                    Sair
                </button>
            </div>
        </article>
    );
}
