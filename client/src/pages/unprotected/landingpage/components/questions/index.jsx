import { useEffect, useState, useRef } from 'react';
import Question from '../question';
import Mascote from '/assets/images/mascote/landingpage_questions.webp';

export default function LandingPageQuestions() {
    const [emerge, setEmerge] = useState(false);
    const sectionRef = useRef(null);
    const questions = [
        {
            id: 1,
            question: 'O EduIA é apenas para alunos?',
            answer: 'O sistema foi dedicado e estruturado para atender tantos os discentes (alunos) quanto dos docentes (professores) do IFRN',
        },
        {
            id: 2,
            question: 'O sistema reaproveita materiais?',
            answer: 'O EduIA gerará materiais novos para cada pedido. Os materiais são criados baseado nos feedbacks de materiais anteriores',
        },
        {
            id: 3,
            question: 'O EduIA gera materiais sobre materia técnica?',
            answer: 'O EduIA é um sistema para geração de materiais de estudo com IA para estudantes do ensio médio técnico integrado',
        },
        {
            id: 4,
            question: 'O sistema usa qual IA?',
            answer: 'O sistema utiliza do modelo de linguagem ChatGPT-5 nano, por suas popularidade, capacidade de resposta, velocidade e baixo custo',
        },
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
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
            className='bg-color4-200 flex flex-col justify-between gap-16 px-8 py-32 md:p-24 lg:flex-row'
        >
            <article className={`flex-1 opacity-0 ${emerge ? 'animate-emerge-left' : ''}`}>
                <h2 className='font-primary from-color1-100 via-color1-400 to-color4-25 bg-linear-0 bg-clip-text pb-1 text-center text-3xl font-semibold text-transparent md:text-4xl'>
                    Perguntas frequentes
                </h2>
                <img src={Mascote} alt='Mascote' loading='lazy' className='mx-auto hidden max-w-sm lg:block' />
            </article>
            <article className={`flex-2 opacity-0 ${emerge ? 'animate-emerge-right' : ''} `}>
                {questions.map(question => (
                    <Question key={question.id} {...question} />
                ))}
            </article>
        </section>
    );
}
