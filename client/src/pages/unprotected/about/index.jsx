import { Helmet } from 'react-helmet-async';

export default function About() {
    return (
        <div className='wrapper'>
            <Helmet>
                <title>EduIA | Sobre</title>
                <meta name='description' content='Página de sobre, explicando sobre o que é p EduIA' />
            </Helmet>
            <main className='flex flex-col items-center gap-15 bg-[linear-gradient(135deg,#e0e9fb_0%,#f4f7ff_100%)]'>
                <div className='flex w-full flex-wrap items-center justify-center rounded-bl-[20%] bg-[#F7F8F8] pt-32 pb-24'>
                    <article className='flex max-w-200 flex-2 basis-80 flex-col gap-2'>
                        <h1 className='text-color2-200 font-primary mb-4 px-10 text-4xl font-bold md:text-5xl'>
                            Sobre
                        </h1>
                        <p className='text-color3-100 font-secundary min-w-100 px-10 leading-relaxed sm:text-lg md:text-xl'>
                            O EduIA é uma plataforma educacional que utiliza
                            <strong className='text-color1-100'> Inteligência Artificial</strong> para auxiliar alunos e
                            professores na criação de materiais de estudo de forma
                            <strong className='text-color1-100'> rápida, personalizada e eficiente</strong>.
                        </p>
                        <p className='text-color3-100 font-secundary min-w-100 px-10 leading-relaxed sm:text-lg md:text-xl'>
                            Desenvolvido por estudantes do Instituto Federal do Rio Grande do Norte (IFRN) – Campus
                            Caicó, o sistema surgiu com o objetivo de reduzir o tempo gasto na produção de conteúdos
                            educacionais.
                        </p>
                    </article>
                    <article className='hidden min-[900px]:block'>
                        <img
                            src='/assets/images/mascote/sobre.png'
                            alt='Mascote do EduIA para about'
                            className='mx-auto max-w-100'
                        />
                    </article>
                </div>
                <article className='flex flex-wrap-reverse items-center justify-center p-10 md:gap-30'>
                    <img
                        src='/assets/images/mascote/funcionalidades.png'
                        alt='Mascote do EduIA para funcionalidades'
                        className='animate-floating mx-auto max-w-80'
                    />
                    <div className='font-secundary group max-w-120'>
                        <span className='text-color1-200 rounded-full bg-blue-500/10 px-4 py-1 text-sm font-bold uppercase'>
                            Funcionalidades
                        </span>
                        <h2 className='text-color2-200 font-primary my-4 text-3xl font-bold md:text-4xl'>
                            O que você pode fazer no EduIA
                        </h2>
                        <div>
                            <p className='text-color3-100 group-hover:border-color2-400 border-l-[3px] border-slate-200 pl-[25px] leading-relaxed transition-all duration-100 sm:text-lg md:text-xl'>
                                Transforme sua rotina de estudos com{' '}
                                <strong className='text-color2-400'>IA personalizada</strong>. Crie cronogramas, resumos
                                e questões práticas que se adaptam exatamente ao que você precisa aprender hoje.
                            </p>
                        </div>
                    </div>
                </article>
                <article className='flex flex-wrap items-center justify-center p-10 md:gap-30'>
                    <div className='font-secundary group max-w-120'>
                        <span className='text-color1-200 rounded-full bg-blue-500/10 px-4 py-1 text-sm font-bold uppercase'>
                            Objetivo
                        </span>
                        <h2 className='text-color2-200 font-primary my-4 text-3xl font-bold md:text-4xl'>
                            Nosso objetivo
                        </h2>
                        <div>
                            <p className='text-color3-100 group-hover:border-color2-400 border-l-[3px] border-slate-200 pl-[25px] leading-relaxed transition-all duration-100 sm:text-lg md:text-xl'>
                                Nascido no IFRN, o EduIA quer{' '}
                                <strong className='text-color2-400'>democratizar a tecnologia</strong> na educação.
                                Nossa missão é dar a alunos e professores as ferramentas necessárias para focar na
                                criatividade e no pensamento crítico.
                            </p>
                        </div>
                    </div>
                    <img
                        src='/assets/images/mascote/objetivo.png'
                        alt='Mascote do EduIA para objetivo'
                        className='animate-floating mx-auto max-w-80'
                    />
                </article>
            </main>
        </div>
    );
}
