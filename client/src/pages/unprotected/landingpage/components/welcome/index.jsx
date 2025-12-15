import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Mascote from '/assets/mascote/landingpage_welcome.png';

export default function LandingPageWelcome() {
    const [isEmerge, setEmerge] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(entris => {
            entris.forEach(entry => {
                if (entry.isIntersecting) {
                    setEmerge(true);
                    observer.unobserve(entry.target);
                }
            });
        });

        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <>
            {/* Adicionar um background diferente. Quem sabe o tal do mascote */}
            <section
                ref={sectionRef}
                className='bg-color4-200 flex w-full items-center justify-center p-12 pt-24 md:min-h-screen md:px-16 md:py-32'
            >
                <article className={`opacity-0 ${isEmerge ? 'animate-emerge-left' : ''}`}>
                    <h1 className='font-primary title-welcome mb-4 max-w-300 pb-2 text-4xl font-bold text-balance md:text-5xl md:font-semibold lg:text-6xl'>
                        Aprenda de forma inteligente e personalizada
                    </h1>
                    <p className='font-secundary text-color1-50 max-w-300 text-lg text-balance md:text-2xl'>
                        O <strong>EduIA</strong> utiliza inteligência artificial para criar planos de aula, desafios e
                        conteúdos adaptados ao seu ritmo de aprendizado
                    </p>
                    <Link to='/cadastro'>
                        <button className='bg-color1-100 text-color4-200 font-primary hover:shadow-lg-hard mt-8 cursor-pointer rounded-xl px-8 py-4 text-xl transition-all duration-200'>
                            Crie uma conta
                        </button>
                    </Link>
                </article>
                <article className={`hidden opacity-0 xl:block ${isEmerge ? 'animate-emerge-right' : ''}`}>
                    <img src={Mascote} alt='Mascote' className='mx-auto max-w-130' />
                </article>
            </section>
        </>
    );
}
