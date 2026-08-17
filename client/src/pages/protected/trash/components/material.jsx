import { useState } from 'react';
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
import MenuCard from './menu';

export default function MaterialCard({
    id,
    title,
    discipline,
    difficulty,
    amount,
    grade,
    chalkboard,
    projector,
    printed,
    digital,
    created_at,
    type,
    canOpenMenu = true,
    fetchMaterials,
}) {
    const [menu, setMenu] = useState(null);

    function formatarHora(created_at) {
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const formatador = new Intl.DateTimeFormat('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: userTimeZone,
        });
        return formatador.format(new Date(created_at));
    }

    function formatarData(created_at) {
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const formatador = new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            timeZone: userTimeZone,
        });
        return formatador.format(new Date(created_at));
    }

    function getIcon(type) {
        const icons = {
            desafio: <IconLaurelWreath1 className='stroke-color1-100' />,
            'exercicio guiado': <IconArrowBigUp className='stroke-color1-100' />,
            explicacao: <IconChalkboardTeacher className='stroke-color1-100' />,
            flashcards: <IconCards className='stroke-color1-100' />,
            formulario: <IconListDetails className='stroke-color1-100' />,
            'plano de aula': <IconChalkboard className='stroke-color1-100' />,
            questoes: <IconListLetters className='stroke-color1-100' />,
            quiz: <IconTimeDuration10 className='stroke-color1-100' />,
            resumo: <IconFileDescription className='stroke-color1-100' />,
            roteiro: <IconReorder className='stroke-color1-100' />,
        };
        return icons[type] || <IconFile className='stroke-color1-100' />;
    }

    function handleContextMenu(e, id) {
        e.preventDefault();
        setMenu({ x: e.clientX, y: e.clientY, id });
    }

    return (
        <>
            {canOpenMenu && menu && (
                <MenuCard
                    {...menu}
                    setMenu={setMenu}
                    fetchMaterials={fetchMaterials}
                />
            )}
            <article
                className='flex min-h-48 cursor-pointer flex-col rounded-lg bg-color4-400 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg'
                onContextMenu={e => handleContextMenu(e, id)}
            >
                <div className='flex items-center justify-end gap-3 border-b-2 border-color4-25 p-2 pl-3'>
                    <span>{getIcon(type)}</span>
                    <h3 className='flex-1 font-primary text-xl font-medium text-color1-100'>{title}</h3>
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
                    <span className='font-secundary text-color2-100'>{formatarHora(created_at)}</span>
                    <span className='font-secundary text-color2-100'>{formatarData(created_at)}</span>
                </div>
            </article>
        </>
    );
}
