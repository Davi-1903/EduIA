import {
    IconArrowBigUp,
    IconCards,
    IconChalkboard,
    IconChalkboardTeacher,
    IconFile,
    IconFileDescription,
    IconLaurelWreath1,
    IconListDetails,
    IconListLetters,
    IconReorder,
    IconTimeDuration10,
    IconTrash,
} from '@tabler/icons-react';

export default function MaterialCard({
    title,
    discipline,
    difficulty,
    amount,
    grade,
    chalkboard,
    projector,
    printed,
    digital,
    datetime,
    type,
}) {
    function formatarHora(datetime) {
        const data = new Date(datetime);
        const horas = String(data.getHours()).padStart(2, '0');
        const minutos = String(data.getMinutes()).padStart(2, '0');

        return `${horas}:${minutos}`;
    }

    function formatarData(datetime) {
        const data = new Date(datetime);
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();

        return `${dia}/${mes}/${ano}`;
    }

    function getIcon(type) {
        const icons = {
            desafio: <IconLaurelWreath1 className='stroke-color2-100' />,
            'exercicio guiado': <IconArrowBigUp className='stroke-color2-100' />,
            explicacao: <IconChalkboardTeacher className='stroke-color2-100' />,
            flashcards: <IconCards className='stroke-color2-100' />,
            formulario: <IconListDetails className='stroke-color2-100' />,
            'plano de aula': <IconChalkboard className='stroke-color2-100' />,
            questoes: <IconListLetters className='stroke-color2-100' />,
            quiz: <IconTimeDuration10 className='stroke-color2-100' />,
            resumo: <IconFileDescription className='stroke-color2-100' />,
            roteiro: <IconReorder className='stroke-color2-100' />,
        };
        return icons[type] || <IconFile className='stroke-color2-100' />;
    }

    return (
        <article className='flex min-h-48 cursor-pointer flex-col rounded-lg bg-color4-400 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg'>
            <div className='flex items-center justify-end gap-3 border-b-2 border-color4-25 p-2 pl-3'>
                <span>{getIcon(type)}</span>
                <h3 className='flex-1 font-primary text-xl font-medium text-color2-100'>{title}</h3>
                {/* <button className='rounded-sm p-1 transition-all hover:bg-color4-25'>
                    <IconTrash
                        stroke={1.5}
                        className='stroke-red-800'
                    />
                </button> */}
            </div>
            <div className='flex-1 p-3 text-color2-100'>
                <p className='font-secundary'>
                    Disciplina: <span className='font-medium'>{discipline}</span>
                </p>
                {amount && (
                    <p className='font-secundary'>
                        Quantidade: <span className='font-medium'>{amount}</span>
                    </p>
                )}
                {difficulty && (
                    <p className='font-secundary'>
                        Dificuldade: <span className='font-medium'>{difficulty}</span>
                    </p>
                )}
                {grade && (
                    <p className='font-secundary'>
                        Série: <span className='font-medium'>{grade}</span>
                    </p>
                )}
                {(chalkboard || projector || printed || digital) && (
                    <p className='font-secundary'>
                        Recursos de ensino:{' '}
                        <span className='font-medium'>
                            {[
                                { check: chalkboard, name: 'Quadro' },
                                { check: projector, name: 'Projetor' },
                                { check: printed, name: 'Impresso' },
                                { check: digital, name: 'Digital' },
                            ]
                                .filter(resource => resource.check)
                                .map(resource => resource.name)
                                .join(', ')}
                        </span>
                    </p>
                )}
            </div>
            <div className='flex items-center justify-between border-t-2 border-color4-25 px-2 py-1'>
                <span className='font-secundary text-color2-100'>{formatarHora(datetime)}</span>
                <span className='font-secundary text-color2-100'>{formatarData(datetime)}</span>
            </div>
        </article>
    );
}
