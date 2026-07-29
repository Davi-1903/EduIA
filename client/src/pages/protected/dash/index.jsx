import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GET } from '../../../api/materials';
import { Helmet } from 'react-helmet-async';
import { useMessages } from '../../../context/messagesContext';
import { useAuthenticated } from '../../../context/authContext';
import ProtectedRoute from '../../../components/protectedRoute';
import GenerateQuestions from '../tools/questions';
import GenerateQuizzes from '../tools/quizzes';
import GenerateFlashCards from '../tools/flashcards';
import GenerateResumes from '../tools/resumes';
import GenerateLessonPlan from '../tools/lesson_plan';
import GenerateStudyGuide from '../tools/study_guide';
import GenerateQuidedExercises from '../tools/guided_exercises';
import GenerateExplanation from '../tools/explanation';
import GenerateForms from '../tools/forms';
import GenerateChallenge from '../tools/challenge';
import MaterialCard from '../materials/components/material';
import Card from './cards';
import { IconCirclePlus } from '@tabler/icons-react';

export default function Dashboard() {
    const { user } = useAuthenticated();
    const { setMessages } = useMessages();
    const [materials, setMaterials] = useState(null);
    const cards = [
        {
            id: 1,
            title: 'Gerar Questão',
            component: <GenerateQuestions />,
            description: 'Crie listas de exercícios personalizadas.',
        },
        {
            id: 2,
            title: 'Gerar Formulários',
            component: <GenerateForms />,
            description: 'Gere formulários para avaliações.',
        },
        {
            id: 3,
            title: 'Gerar Quiz',
            component: <GenerateQuizzes />,
            description: 'Monte quizzes com tempo e pontuação.',
        },
        {
            id: 4,
            title: 'Gerar Flashcards',
            component: <GenerateFlashCards />,
            description: 'Crie cartões para memorização.',
        },
        {
            id: 5,
            title: 'Gerar Resumo',
            component: <GenerateResumes />,
            description: 'Resumos claros e objetivos.',
        },
        {
            id: 6,
            title: 'Gerar Explicação',
            component: <GenerateExplanation />,
            description: 'Explicações adaptadas ao seu nível.',
        },
        {
            id: 7,
            title: 'Gerar Exercícios Guiados',
            component: <GenerateQuidedExercises />,
            description: 'Passo a passo completo.',
        },
        {
            id: 8,
            title: 'Gerar Plano de Aula',
            component: <GenerateLessonPlan />,
            description: 'Planeje suas aulas facilmente.',
        },
        {
            id: 9,
            title: 'Gerar Roteiro de Estudo',
            component: <GenerateStudyGuide />,
            description: 'Organize seus estudos.',
        },
        {
            id: 10,
            title: 'Gerar Desafios',
            component: <GenerateChallenge />,
            description: 'Teste seus conhecimentos.',
        },
    ];

    function getCard(tipo, card) {
        const exclusivoProfessores = ['Gerar Formulários', 'Gerar Plano de Aula'];
        const exclusivoAlunos = ['Gerar Flashcards', 'Gerar Roteiro de Estudo'];

        if (
            (tipo === 'professor' && exclusivoAlunos.includes(card.title)) ||
            (tipo === 'aluno' && exclusivoProfessores.includes(card.title))
        )
            return null;
        return (
            <Card
                key={card.id}
                {...card}
            />
        );
    }

    useEffect(() => {
        GET('/api/materials?limit=4')
            .then(data => {
                if (data.status === 401) return;
                if (data.status !== 200) throw new Error('Não foi possível carregar os materiais');
                setMaterials(data.materials);
            })
            .catch(err => {
                setMaterials(null);
                setMessages(prev => [
                    ...prev,
                    {
                        id: prev.length + 1,
                        message:
                            err.name === 'SyntaxError' ? 'Ocorreu um problema com a resposta do servidor' : err.message,
                        type: 'danger',
                    },
                ]);
            });
    }, [setMessages]);

    return (
        <ProtectedRoute isPrivate={true}>
            <Helmet>
                <title>EduIA | Dashboard</title>
                <meta
                    name='description'
                    content='Dashboard do sistema EduIA'
                />
            </Helmet>
            <main className='min-h-svh bg-color4-200'>
                <section className='mx-auto max-w-400 space-y-12 px-6 py-16'>
                    <div className='max-w-2xl'>
                        <div>
                            <h1 className='bg-linear-to-tr from-color1-100 from-45% to-color4-100 bg-clip-text text-4xl leading-tight font-bold text-transparent md:text-5xl'>
                                Aprenda de forma inteligente e personalizada
                            </h1>
                        </div>
                        <p className='mt-6 text-lg text-color3-200'>
                            Use o EduIA para criar materiais, exercícios e conteúdos adaptados ao seu ritmo de
                            aprendizado.
                        </p>
                    </div>
                    {materials?.length > 0 && (
                        <div>
                            <h2 className='mb-6 font-primary text-2xl font-semibold text-color1-100'>
                                Materiais recentes
                            </h2>
                            <div className='grid grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] gap-6'>
                                {materials.map((material, idx) => (
                                    <Link
                                        to='/materials'
                                        key={idx}
                                    >
                                        <MaterialCard
                                            {...material}
                                            canOpenMenu={false}
                                        />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                    {user && (
                        <section>
                            <h2 className='mb-6 font-primary text-2xl font-semibold text-color1-100'>
                                O que você quer criar hoje?
                            </h2>
                            <div className='grid grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] gap-6'>
                                {cards.map(card => getCard(user.tipo, card))}
                            </div>
                        </section>
                    )}
                </section>
            </main>
        </ProtectedRoute>
    );
}
