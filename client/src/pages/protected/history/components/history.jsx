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
} from '@tabler/icons-react';
import QuestionForm from './tools/question';
import QuizForm from './tools/quiz';
import ResumesForm from './tools/resume';
import ExplanationForm from './tools/explanation';
import ChallengeForm from './tools/desafio';

export default function HistoryCard({
    title,
    discipline,
    difficulty,
    amount,
    time,
    grade,
    chalkboard,
    projector,
    printed,
    digital,
    created_at,
    questions,
    note,
    type,
}) {
    const [isOpen, setOpen] = useState(false);

    function formatarHora(created_at) {
        const data = new Date(created_at);
        const horas = String(data.getHours()).padStart(2, '0');
        const minutos = String(data.getMinutes()).padStart(2, '0');

        return `${horas}:${minutos}`;
    }

    function formatarData(created_at) {
        const data = new Date(created_at);
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();

        return `${dia}/${mes}/${ano}`;
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

    function getForm(type) {
        const forms = {
            desafio: (
                <ChallengeForm
                    discipline={discipline}
                    subject={title}
                    note={note}
                    setOpen={setOpen}
                />
            ),
            'exercicio guiado': null,
            explicacao: (
                <ExplanationForm
                    discipline={discipline}
                    subject={title}
                    questions={questions}
                    setOpen={setOpen}
                />
            ),
            flashcards: null,
            formulario: null,
            'plano de aula': null,
            questoes: (
                <QuestionForm
                    discipline={discipline}
                    subject={title}
                    difficulty={difficulty}
                    amount={amount}
                    note={note}
                    setOpen={setOpen}
                />
            ),
            quiz: (
                <QuizForm
                    discipline={discipline}
                    subject={title}
                    difficulty={difficulty}
                    time={time}
                    amount={amount}
                    note={note}
                    setOpen={setOpen}
                />
            ),
            resumo: (
                <ResumesForm
                    discipline={discipline}
                    subject={title}
                    note={note}
                    setOpen={setOpen}
                />
            ),
            roteiro: null,
        };
        return forms[type];
    }

    return (
        <>
            {isOpen && getForm(type)}
            <article
                className='flex min-h-48 cursor-pointer flex-col rounded-lg bg-color4-400 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg'
                onDoubleClick={() => setOpen(true)}
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
