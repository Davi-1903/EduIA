import { Helmet } from 'react-helmet-async';
import ProtectedRoute from '../../../components/protectedRoute';
import RenderMessages from '../../../components/renderMessages';
import Cards from './cards';

export default function Dashboard() {
    const cards = [
        {
            id: 1,
            title: 'Gerar Questão',
            description: 'Crie listas de exercícios personalizadas.',
        },
        {
            id: 2,
            title: 'Gerar Formulários',
            description: 'Gere formulários para avaliações.',
        },
        {
            id: 3,
            title: 'Gerar Quiz',
            description: 'Monte quizzes com tempo e pontuação.',
        },
        {
            id: 4,
            title: 'Gerar Flashcards',
            description: 'Crie cartões para memorização.',
        },
        {
            id: 5,
            title: 'Gerar Resumo',
            description: 'Resumos claros e objetivos.',
        },
        {
            id: 6,
            title: 'Gerar Explicação',
            description: 'Explicações adaptadas ao seu nível.',
        },
        {
            id: 7,
            title: 'Gerar Exercícios Guiados',
            description: 'Passo a passo completo.',
        },
        {
            id: 8,
            title: 'Gerar Plano de Aula',
            description: 'Planeje suas aulas facilmente.',
        },
        {
            id: 9,
            title: 'Gerar Roteiro de Estudo',
            description: 'Organize seus estudos.',
        },
        {
            id: 10,
            title: 'Gerar Desafios',
            description: 'Teste seus conhecimentos.',
        },
    ];

    const history = [
        {
            id: 1,
            title: 'Resumo de Fotossíntese',
            description: 'Biologia',
        },
        {
            id: 2,
            title: 'Lista de Exercícios de Física',
            description: 'Física',
        },
        {
            id: 3,
            title: 'Quiz de Matemática',
            description: 'Matemática',
        },
    ];

    return (
        <ProtectedRoute isPrivate={true}>
            <Helmet>
                <title>EduIA | Dashboard</title>
                <meta name='description' content='Dashboard do sistema EduIA' />
            </Helmet>

            <div className='wrapper'>
                <RenderMessages />

                <main className='from-color4-200 mt-(--height-header) min-h-screen bg-linear-to-br to-indigo-100'>
                    <section className='mx-auto max-w-7xl space-y-24 px-6 py-16'>
                        <div className='max-w-3xl'>
                            <h1 className='text-color1-100 text-4xl leading-tight font-bold md:text-5xl'>
                                Aprenda de forma inteligente <br /> e personalizada
                            </h1>
                            <p className='text-color3-200 mt-6 text-lg'>
                                Use o EduIA para criar materiais, exercícios e conteúdos adaptados ao seu ritmo de
                                aprendizado.
                            </p>
                        </div>

                        <section>
                            <h2 className='text-color1-100 mb-8 text-2xl font-semibold'>O que você quer criar hoje?</h2>

                            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                                {cards.map(card => (
                                    <Cards key={card.id} title={card.title} description={card.description} />
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className='text-color1-100 mb-8 text-2xl font-semibold'>Continue de onde parou</h2>

                            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                                {history.map(item => (
                                    <Cards key={item.id} title={item.title} description={item.description} />
                                ))}
                            </div>
                        </section>
                    </section>
                </main>
            </div>
        </ProtectedRoute>
    );
}
