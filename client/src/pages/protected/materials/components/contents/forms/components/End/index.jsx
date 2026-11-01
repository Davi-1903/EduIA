import { IconCircleCheck } from '@tabler/icons-react';

export default function End({
    discipline,
    subject,
    questionsLength,
    handleClose,
}) {
    return (
        <div className='flex h-full flex-col items-center justify-center gap-6 text-center'>
            <div className='grid h-20 w-20 place-items-center rounded-full bg-color4-100'>
                <IconCircleCheck
                    size={44}
                    strokeWidth={2}
                    className='stroke-color1-400'
                />
            </div>

            <div className='flex flex-col gap-2'>
                <h2 className='font-primary text-3xl font-extrabold text-color1-100'>
                    Respostas enviadas!
                </h2>

                <p className='font-secundary text-base text-color1-100/70'>
                    Você respondeu {questionsLength}{' '}
                    {questionsLength === 1
                        ? 'pergunta'
                        : 'perguntas'}{' '}
                    do formulário de {discipline ?? subject}.
                </p>
            </div>

            <button
                className='cursor-pointer rounded-xl bg-button px-10 py-2 font-secundary text-lg font-bold text-color4-400 transition-all duration-250 hover:shadow-lg-hard'
                onClick={handleClose}
            >
                Concluir
            </button>
        </div>
    );
}