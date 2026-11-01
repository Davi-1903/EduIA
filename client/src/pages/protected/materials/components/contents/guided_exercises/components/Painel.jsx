import { IconBulb, IconEye, IconX } from '@tabler/icons-react';
import { obterResposta } from './Alternativas';

export function Dica({ texto, onClose }) {
    return (
        <section className='rounded-xl border-2 border-color4-100 p-4'>
            <div className='flex items-center justify-between'>
                <h3 className='flex items-center gap-2 font-primary text-base font-bold text-color1-100'>
                    <IconBulb size={36} className='p-2 bg-black/10 rounded-full' />
                    Dica
                </h3>
                <button type='button' aria-label='Fechar dica' onClick={onClose} className='cursor-pointer'>
                    <IconX size={18} />
                </button>
            </div>
            <p className='mt-2 font-secundary text-md text-color1-100'>{texto}</p>
        </section>
    );
}

export function MostrarResposta({ onClick }) {
    return (
        <button
            type='button'
            onClick={onClick}
            className='flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-3 border-color1-100 px-8 py-2 font-secundary text-lg font-bold text-color1-100 transition-all duration-250 hover:bg-button hover:text-color4-400'
        >
            <IconEye size={22} />
            Mostrar resposta
        </button>
    );
}

export function Resposta({ tipo, questao, onClose }) {
    return (
        <div className='flex flex-col gap-3'>
            <div className='rounded-xl border-2 border-green-500 bg-green-50 p-3'>
                <span className='block font-secundary text-lg font-bold text-green-600 mb-3'>Resposta</span>
                <p className='font-secundary text-md text-green-600 font-medium'>
                    {obterResposta(tipo, questao)}
                </p>
            </div>
            {questao.explanation && (
                <section className='rounded-xl border-2 border-color4-100 p-4'>
                    <div className='flex items-center justify-between'>
                        <h3 className='font-primary text-lg font-bold text-color1-100'>Resolução comentada</h3>
                        <button
                            type='button'
                            aria-label='Ocultar resposta'
                            onClick={onClose}
                            className='cursor-pointer'
                        >
                            <IconX size={18} />
                        </button>
                    </div>
                    <p className='mt-2 font-secundary text-md text-color1-100'>{questao.explanation}</p>
                </section>
            )}
        </div>
    );
}