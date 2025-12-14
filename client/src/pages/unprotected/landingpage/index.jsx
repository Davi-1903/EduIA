import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Card from '../../../components/card';

export default function LandingPage() {
    const materiais = [
        {
            id: 1,
            title: 'Crie Questões',
            description:
                'Crie listas de exercícios personalizadas com quantidade e nível de dificuldade especificados por você. Perfeito para praticar e consolidar seu aprendizado.',
        },
        {
            id: 2,
            title: 'Crie Formulários',
            description:
                'Gere formulários interativos com quantidade e nível customizados. Ideal para avaliar seu conhecimento e identificar pontos que precisam de mais atenção.',
        },
        {
            id: 3,
            title: 'Crie Quizzes',
            description:
                'Crie quizzes dinâmicos com pontuação automática e tempo personalizável. Teste seus conhecimentos de forma divertida e competitiva.',
        },
        {
            id: 4,
            title: 'Crie Flashcards',
            description:
                'Produza cartões de memorização com perguntas e respostas. Método comprovado para memorização rápida e eficaz de qualquer conteúdo.',
        },
        {
            id: 5,
            title: 'Crie Resumos',
            description:
                'Obtenha resumos inteligentes de qualquer assunto ou matéria. Capture os pontos-chave de forma concisa para estudos mais eficientes.',
        },
        {
            id: 6,
            title: 'Crie Explicações',
            description:
                'Receba explicações detalhadas adaptadas ao seu nível de compreensão, com analogias, exemplos práticos e demonstrações para facilitar o entendimento.',
        },
        {
            id: 7,
            title: 'Crie Exercícios Guiados',
            description:
                'Acesse questões já respondidas com passo a passo completo e explicações detalhadas. Aprenda resolvendo exercícios com orientação passo a passo.',
        },
        {
            id: 8,
            title: 'Crie Planos de Aula',
            description:
                'Desenvolva planos de aula estruturados e objetivos. Define o que deve ser abordado, objetivos de aprendizado e estratégias de ensino.',
        },
        {
            id: 9,
            title: 'Crie Roteiros de Estudo',
            description:
                'Organize seu aprendizado com roteiros estruturados que indicam o que estudar e em qual sequência lógica para melhor compreensão.',
        },
        {
            id: 10,
            title: 'Crie Desafios',
            description:
                'Enfrente desafios motivadores para cada assunto ou matéria. Teste suas habilidades em cenários práticos e ganhe experiência real.',
        },
    ];

    return (
        <>
            <Helmet>
                <title>EduIA</title>
                <meta
                    name='description'
                    content='Sistema para geração de materiais de estudo e materiais de aula com inteligência artificial'
                />
            </Helmet>
            <main>
                {/* Adicionar um background diferente. Quem sabe o tal do mascote */}
                <section className='bg-color4-200 flex w-full flex-col items-start justify-center gap-4 px-8 py-12 pt-24 md:min-h-screen md:px-16 md:py-32'>
                    <h1 className='font-primary title-welcome max-w-300 pb-2 text-4xl font-bold text-balance md:text-[5rem] md:font-semibold'>
                        Aprenda de forma inteligente e personalizada
                    </h1>
                    <p className='font-secundary text-color1-50 max-w-300 text-lg text-balance md:text-2xl'>
                        O <strong>EduIA</strong> utiliza inteligência artificial para criar planos de aula, desafios e
                        conteúdos adaptados ao seu ritmo de aprendizado
                    </p>
                    <Link to='/cadastro'>
                        <button className='bg-color1-100 text-color4-200 font-primary hover:shadow-lg-hard mt-4 cursor-pointer rounded-xl px-8 py-4 text-xl transition-all duration-200'>
                            Crie uma conta
                        </button>
                    </Link>
                </section>
                <section className='bg-color4-200 min-h-screen p-8 md:p-16 md:pt-0'>
                    <h2 className='font-primary text-color2-200 mb-16 text-4xl font-semibold md:text-center md:text-5xl'>
                        Gere materiais de forma rápida e fácil
                    </h2>
                    <article className='slide-container'>
                        <article className='scrollbar-hide flex overflow-x-auto'>
                            <article className='animate-carrossel flex w-fit gap-4 pr-4'>
                                {materiais.map(material => (
                                    <Card key={material.id} {...material} />
                                ))}
                            </article>
                            <article aria-hidden className='animate-carrossel flex w-fit gap-4 pr-4'>
                                {materiais.map(material => (
                                    <Card key={material.id} {...material} />
                                ))}
                            </article>
                        </article>
                        <article className='scrollbar-hide mt-4 flex overflow-x-auto'>
                            <article className='animate-carrossel-reverse flex w-fit gap-4 pl-4'>
                                {materiais.map(material => (
                                    <Card key={material.id} {...material} />
                                ))}
                            </article>
                            <article aria-hidden className='animate-carrossel-reverse flex w-fit gap-4 pl-4'>
                                {materiais.map(material => (
                                    <Card key={material.id} {...material} />
                                ))}
                            </article>
                        </article>
                    </article>
                </section>
            </main>
        </>
    );
}
