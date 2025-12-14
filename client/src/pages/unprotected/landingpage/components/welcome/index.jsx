import { Link } from 'react-router-dom';
import Mascote from '/assets/mascote.png';

export default function LandingPageWelcome() {
    return (
        <>
            {/* Adicionar um background diferente. Quem sabe o tal do mascote */}
            <section className='bg-color4-200 flex w-full items-center justify-center gap-4 p-12 pt-24 md:min-h-screen md:px-16 md:py-32'>
                <article className='flex-1 lg:flex-2'>
                    <h1 className='font-primary title-welcome mb-4 max-w-300 pb-2 text-4xl font-bold text-balance md:text-5xl md:font-semibold lg:text-7xl'>
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
                </article>
                <article className='hidden flex-1 lg:block'>
                    <img src={Mascote} alt='Mascote' className='mx-auto' />
                </article>
            </section>
        </>
    );
}
