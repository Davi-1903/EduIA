import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Mascote from '/assets/images/mascote/landingpage_welcome.webp';
import clsx from 'clsx';

export default function LandingPageWelcome() {
    const [isEmerge, setEmerge] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
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
        <section
            ref={sectionRef}
            className='flex w-full items-center justify-center bg-radial-[at_top_right] from-color1-400/15 to-color4-200 to-60% p-8 pt-24 md:min-h-screen md:bg-radial-[at_75%] md:px-16 md:py-32'
        >
            <article className={clsx('opacity-0', isEmerge && 'animate-emerge-left')}>
                <h1 className='mb-4 max-w-300 bg-linear-to-br from-color1-200 from-25% via-color1-400 to-color4-25 bg-clip-text pb-2 font-primary text-4xl font-bold text-balance text-transparent md:text-5xl md:font-semibold lg:text-6xl'>
                    Aprenda de forma inteligente e personalizada
                </h1>
                <p className='max-w-300 font-secundary text-lg text-balance text-color1-50 md:text-2xl'>
                    O <strong>EduIA</strong> utiliza inteligência artificial para criar planos de aula, desafios e
                    conteúdos adaptados ao seu ritmo de aprendizado
                </p>
                <Link to='/cadastro'>
                    <button className='mt-8 cursor-pointer rounded-xl bg-button px-8 py-4 font-primary text-xl text-color4-200 transition-all duration-200 hover:shadow-lg-hard'>
                        Crie uma conta
                    </button>
                </Link>
            </article>
            <article className={clsx('hidden opacity-0 xl:block', isEmerge && 'animate-emerge-right')}>
                <img src={Mascote} alt='Mascote' loading='lazy' className='mx-auto max-w-130 animate-floating' />
            </article>
        </section>
    );
}
