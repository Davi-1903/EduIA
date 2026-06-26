import { Helmet } from 'react-helmet-async';
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
import Card from './cards';

export default function Dashboard() {
    const { user } = useAuthenticated();
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
                title={card.title}
                description={card.description}
                component={card.component}
            />
        );
    }

    return (
        <ProtectedRoute isPrivate={true}>
            <Helmet>
                <title>EduIA | Dashboard</title>
                <meta
                    name='description'
                    content='Dashboard do sistema EduIA'
                />
            </Helmet>
            <main className='min-h-screen bg-linear-to-br from-color4-200 to-indigo-100'>
                <section className='mx-auto max-w-7xl space-y-24 px-6 py-16 pt-24'>
                    <div className='max-w-3xl'>
                        <h1 className='text-4xl leading-tight font-bold text-color1-100 md:text-5xl'>
                            Aprenda de forma inteligente <br /> e personalizada
                        </h1>
                        <p className='mt-6 text-lg text-color3-200'>
                            Use o EduIA para criar materiais, exercícios e conteúdos adaptados ao seu ritmo de
                            aprendizado.
                        </p>
                    </div>
                    <section>
                        <h2 className='mb-8 text-2xl font-semibold text-color1-100'>O que você quer criar hoje?</h2>
                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                            {cards.map(card => getCard(user.tipo, card))}
                        </div>
                    </section>
                </section>
            </main>
        </ProtectedRoute>
    );
}
