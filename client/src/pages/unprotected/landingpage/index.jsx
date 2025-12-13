import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function LandingPage() {
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
                <section className='bg-color4-200 flex min-h-screen w-full flex-col items-start justify-center gap-4 px-8 py-12 pt-24 md:px-16 md:py-32'>
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
            </main>
        </>
    );
}
