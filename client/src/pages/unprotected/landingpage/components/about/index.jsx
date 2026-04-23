import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Mascote from '/assets/images/mascote/landingpage_sobre.webp';
import clsx from 'clsx';

export default function LandingPageAbout() {
    const [isEmerge, setEmerge] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entris => {
                entris.forEach(entry => {
                    if (entry.isIntersecting) {
                        setEmerge(true);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.4 },
        );

        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            className='flex flex-wrap items-center justify-center gap-8 bg-radial-[at_right] from-color1-400/15 to-color4-200 to-60% px-8 py-32 md:min-h-screen md:bg-radial-[at_75%] md:p-24 md:pt-0'
        >
            <article className={clsx('max-w-200 flex-2 basis-80 opacity-0', isEmerge && 'animate-emerge-left')}>
                <h2 className='mb-4 bg-linear-10 from-color1-100 to-color4-25 bg-clip-text font-primary text-4xl font-bold text-transparent md:text-5xl'>
                    O que é o EduIA?
                </h2>
                <p className='font-secundary text-base text-balance text-color3-100 md:text-xl/normal'>
                    O <strong>EduIA</strong> é um sistema de geração de materiais com <strong>IA</strong> (Inteligência
                    Artificial), desenvolvido por estudantes do ensino médio técnico integrado do <strong>IFRN</strong>{' '}
                    - campus Caicó. O sistema visa reduzir o tempo gasto por alunos e professores, gerando materiais de
                    estudo e de aula.
                </p>
                <Link to='/sobre'>
                    <button className='mt-4 cursor-pointer rounded-xl bg-button px-6 py-4 font-primary text-xl text-color4-200 transition-all duration-200 hover:shadow-lg-hard'>
                        Saiba mais
                    </button>
                </Link>
            </article>
            <article
                className={clsx(
                    'hidden max-w-200 flex-1 basis-80 opacity-0 lg:block',
                    isEmerge && 'animate-emerge-right',
                )}
            >
                <img src={Mascote} alt='Mascote' loading='lazy' className='mx-auto max-w-130' />
            </article>
        </section>
    );
}
