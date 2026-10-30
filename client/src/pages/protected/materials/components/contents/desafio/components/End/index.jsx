import { IconClock, IconCircleCheck } from '@tabler/icons-react';

export default function End({ elapsedSeconds, onRestart, onExit }) {
    const minutes = Math.max(1, Math.round(elapsedSeconds / 60));

    return (
        <div className='flex flex-col items-center gap-6 py-6 text-center'>
            <IconCircleCheck
                size={56}
                strokeWidth={1.5}
                className='stroke-green-500'
            />

            <div>
                <h2 className='bg-linear-to-tr from-color1-400 to-color4-25 bg-clip-text font-primary text-3xl font-extrabold text-transparent'>
                    Desafio concluído!
                </h2>
                <p className='mt-2 font-secundary text-base text-color1-100'>
                    Sua resolução foi enviada com sucesso.
                </p>
            </div>

            <div className='flex items-center gap-3 rounded-xl border-2 border-color4-100 p-4'>
                <IconClock
                    size={20}
                    className='stroke-color1-400'
                />
                <div className='text-left'>
                    <span className='block font-secundary text-sm text-color1-100/60'>Tempo</span>
                    <span className='block font-primary text-lg font-bold text-color1-100'>{minutes} min</span>
                </div>
            </div>

            <div className='flex gap-4'>
                <button
                    className='cursor-pointer rounded-lg border-2 border-color1-100 px-8 py-2 font-secundary text-base font-bold text-color1-100 transition-all duration-250 hover:bg-button hover:text-color4-400'
                    onClick={onRestart}
                >
                    Refazer
                </button>
                <button
                    className='cursor-pointer rounded-lg bg-button px-8 py-2 font-secundary text-base font-bold text-color4-400 transition-all duration-250 hover:shadow-lg-hard'
                    onClick={onExit}
                >
                    Sair
                </button>
            </div>
        </div>
    );
}
