import {
    IconAlertCircle,
    IconArrowRight,
    IconBook,
    IconBook2,
    IconBrandSpeedtest,
    IconListNumbers,
    IconSchool,
} from '@tabler/icons-react';

export default function Introduction({ discipline, subject, difficulty, questionsLength, handleClose, handleStart }) {
    const informations = [
        {
            id: 1,
            icon: (
                <IconSchool
                    size={24}
                    className='stroke-color1-100'
                />
            ),
            type: 'Disciplina',
            content: discipline,
        },
        {
            id: 2,
            icon: (
                <IconBook2
                    size={24}
                    className='stroke-color1-100'
                />
            ),
            type: 'Conteúdo',
            content: subject,
        },
        {
            id: 3,
            icon: (
                <IconBrandSpeedtest
                    size={24}
                    className='stroke-color1-100'
                />
            ),
            type: 'Dificuldade',
            content: difficulty,
        },
        {
            id: 4,
            icon: (
                <IconListNumbers
                    size={24}
                    className='stroke-color1-100'
                />
            ),
            type: 'Quantidade',
            content: `${questionsLength} questões`,
        },
    ];

    return (
        <article className='flex flex-col gap-6'>
            <div className='flex items-center gap-2'>
                <IconBook
                    size={20}
                    strokeWidth={2.5}
                    className='stroke-color1-400'
                />
                <span className='font-secundary text-sm font-bold text-color1-400'>PREPARAÇÃO PARA QUESTÕES</span>
            </div>
            <h2 className='bg-linear-to-tr from-color1-400 to-color4-25 bg-clip-text font-primary text-4xl font-extrabold text-transparent'>
                Pronto para começar?
            </h2>
            <ul className='flex flex-col rounded-xl border-2 border-color4-100'>
                {informations.map(item => (
                    <li
                        key={item.id}
                        className='flex gap-3 p-3 not-last:border-b-2 not-last:border-color4-100'
                    >
                        <div className='grid aspect-square h-full place-items-center rounded-lg bg-color4-100'>
                            {item.icon}
                        </div>
                        <div>
                            <span className='block font-secundary text-sm font-medium text-color1-100/40'>
                                {item.type}
                            </span>
                            <span className='block font-primary text-base font-bold text-color1-100'>
                                {item.content}
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
            <blockquote className='flex items-center gap-3 rounded-lg bg-color4-100 p-4'>
                <IconAlertCircle
                    size={28}
                    className='stroke-color1-100'
                />
                <p className='font-secundary text-base text-color1-100'>
                    Leia cada questão com atenção. Você pode revisar suas respostas antes de finalizar.
                </p>
            </blockquote>
            <div className='flex gap-4'>
                <button
                    className='cursor-pointer rounded-xl border-3 border-color1-100 px-8 py-2 font-secundary text-lg font-bold text-color1-100 transition-all duration-250 hover:bg-button hover:text-color4-400'
                    onClick={handleClose}
                >
                    Voltar
                </button>
                <button
                    className='group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-button px-8 py-2 font-secundary text-lg font-bold text-color4-400 transition-all duration-250 hover:shadow-lg-hard'
                    onClick={handleStart}
                >
                    <span>Iniciar Questões</span>
                    <IconArrowRight className='transition-all duration-250 group-hover:ml-2' />
                </button>
            </div>
        </article>
    );
}
