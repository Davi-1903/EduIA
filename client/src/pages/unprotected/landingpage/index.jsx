import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function LandingPage() {
    // const funcionalidades = [
    //     {
    //         id: 1,
    //         title: 'Planos de Aula',
    //         description: 'Crie planos de aula adaptados ao seu estilo de aprendizado e necessidades específicas.',
    //     },
    //     {
    //         id: 2,
    //         title: 'Crie Desafios',
    //         description: 'Enfrente desafios projetados para reforçar seu conhecimento e habilidades.',
    //     },
    //     {
    //         id: 3,
    //         title: 'Gere Conteúdo Adaptativo',
    //         description: 'Receba materiais de estudo que se ajustam ao seu ritmo e progresso.',
    //     },
    //     {
    //         id: 4,
    //         title: 'Crie Flashcards',
    //         description: 'Facilite a memorização com flashcards personalizados para seus tópicos de estudo.',
    //     },
    //     {
    //         id: 5,
    //         title: 'Salve ou baixe seus materiais',
    //         description: 'Guarde seus materiais gerados para uso posterior ou exporte-os para uso offline.',
    //     },
    // ];

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
                <section className='flex min-h-screen w-full flex-col items-start justify-center gap-4 px-8 py-12 md:px-16 md:py-24'>
                    <h1 className='font-primary text-color1-100 max-w-300 text-4xl font-bold text-balance md:text-[5rem] md:font-semibold'>
                        Aprenda de forma inteligente e personalizada
                    </h1>
                    <p className='font-secundary text-color1-50 max-w-300 text-lg text-balance md:text-2xl'>
                        O <strong>EduIA</strong> utiliza inteligência artificial para criar planos de aula, desafios e
                        conteúdos adaptados ao seu ritmo de aprendizado
                    </p>
                    <Link to='/cadastro'>
                        <button className='bg-color1-100 text-color4-200 font-primary hover:shadow-lg-hard mt-4 cursor-pointer rounded-xl px-6 py-3 text-2xl transition-all duration-200'>
                            Crie uma conta
                        </button>
                    </Link>
                </section>
            </main>
        </>
    );
}
