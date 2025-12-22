export default function LandingPageQuestions() {
    const questions = [
        {
            id: 1,
            question: 'O EduIA é apenas para alunos?',
            answer: 'Não! O sistema foi dedicado e estruturado para alunos e professores do Instituto Federal',
        },
        {
            id: 2,
            question: 'O sistema reaproveita materiais?',
            answer: 'Não! O EduIA gerará materiais novos para cada demanda, sendo ajustado por feedback materiais anteriores',
        },
        {
            id: 3,
            question: 'O EduIA gera materiais sobre materia técnica?',
            answer: 'Sim! Essa foi a principal motivação para a elaboração de um sistema de geração de materiais focado no IF',
        },
    ];

    return (
        <section>
            <article>
                <h2>Perguntas frequentes</h2>
            </article>
            <article>
                {questions.map(question => (
                    <article key={question.id}>
                        <div>{question.question}</div>
                        <div>{question.answer}</div>
                    </article>
                ))}
            </article>
        </section>
    );
}
