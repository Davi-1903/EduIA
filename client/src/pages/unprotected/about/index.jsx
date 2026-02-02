
import { Helmet } from 'react-helmet-async';

export default function About() {
    return (
            <div className='wrapper'>
                <Helmet>
                    <title>EduIA | Sobre</title>
                    <meta name='description' content='Página de sobre, explicando sobre o que é p EduIA' />
                </Helmet>
                <main className='flex flex-col items-center gap-15 bg-[linear-gradient(135deg,#e0e9fb_0%,#f4f7ff_100%)]'>
                    <div className='pt-20 pb-10 rounded-bl-[20%] w-full flex flex-wrap justify-center items-center bg-[#F7F8F8] md:pb-0'>
                        <article className='flex flex-col gap-2 max-w-200 flex-2 basis-80' >
                            <h1 className='text-color2-200 font-primary mb-4 text-4xl font-bold md:text-5xl px-10'>Sobre</h1>
                            <p className='text-color3-100 font-secundary min-w-100 sm:text-lg md:text-xl leading-relaxed px-10'>
                                O EduIA é uma plataforma educacional que utiliza
                                <strong className='text-color1-100'> Inteligência Artificial</strong> para auxiliar alunos e professores
                                na criação de materiais de estudo de forma
                                <strong className='text-color1-100'> rápida, personalizada e eficiente</strong>.
                            </p>

                            <p className='text-color3-100 font-secundary min-w-100 sm:text-lg md:text-xl leading-relaxed px-10'>
                                Desenvolvido por estudantes do Instituto Federal do Rio Grande do Norte (IFRN) – Campus Caicó,
                                o sistema surgiu com o objetivo de reduzir o tempo gasto na produção de conteúdos educacionais.
                            </p>
                        </article>
                        <article className='hidden min-[900px]:block'>
                            <img
                                src="/assets/images/mascote/sobre.png"
                                alt="Mascote do EduIA para about"
                                className='mx-auto max-w-100 '/>

                        </article>
                    </div>
                        <article className='flex justify-center items-center md:gap-30 flex-wrap-reverse p-10'>
                            <img
                                src="/assets/images/mascote/funcionalidades.png"
                                alt="Mascote do EduIA para funcionalidades"
                                className='mx-auto max-w-80 animate-floating '/>

                            <div className='font-secundary max-w-120 group'>
                                <span className="py-1 px-4 bg-blue-500/10 font-bold text-sm uppercase rounded-full text-color1-200">Funcionalidades</span>
                                <h2 className='text-color2-200 font-primary my-4 text-3xl font-bold md:text-4xl'>O que você pode fazer no EduIA</h2>
                                <div>
                                    <p className='text-color3-100 sm:text-lg md:text-xl leading-relaxed  pl-[25px] border-l-[3px] border-slate-200
                                     group-hover:border-color2-400'>
                                    Transforme sua rotina de estudos com <strong className='text-color2-400'>IA personalizada</strong>.
                                    Crie cronogramas, resumos e questões práticas que se adaptam exatamente
                                    ao que você precisa aprender hoje.
                                    </p>
                                </div>
                            </div>
                        </article>


                        <article className='flex justify-center items-center md:gap-30 flex-wrap p-10'>

                            <div className='font-secundary max-w-120 group'>
                                <span className="py-1 px-4 bg-blue-500/10 font-bold text-sm uppercase rounded-full text-color1-200">Objetivo</span>
                                <h2 className='text-color2-200 font-primary my-4 text-3xl font-bold md:text-4xl'>Nosso objetivo</h2>
                                <div>
                                    <p className='text-color3-100 sm:text-lg md:text-xl leading-relaxed pl-[25px] border-l-[3px] border-slate-200
                                     group-hover:border-color2-400'>
                                    Nascido no IFRN, o EduIA quer <strong className='text-color2-400'>democratizar a tecnologia</strong> na educação.
                                    Nossa missão é dar a alunos e professores as ferramentas necessárias para
                                    focar na criatividade e no pensamento crítico.
                                    </p>
                                </div>
                            </div>
                            <img
                                src="/assets/images/mascote/objetivo.png"
                                alt="Mascote do EduIA para objetivo"
                                className='mx-auto max-w-80 animate-floating '/>
                        </article>
                </main>
            </div>
    );
}
