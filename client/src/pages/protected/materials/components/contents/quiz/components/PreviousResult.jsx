export default function PreviousResult({ questions, attempts, onRetake, onBack }) {
    const last = attempts[attempts.length - 1];
    const answeredAt = new Date(last.answered_at).toLocaleString('pt-BR');

    return (
        <div className='flex flex-1 flex-col gap-4 overflow-y-auto p-4'>
            <div className='text-center'>
                <h2 className='font-secundary text-xl font-semibold text-color1-100'>
                    Você já respondeu este quiz
                </h2>
                <p className='font-secundary text-base text-color1-100'>
                    Última tentativa: {last.score}/{last.total} em {answeredAt}
                </p>
                {attempts.length > 1 && (
                    <p className='font-secundary text-sm text-color1-100'>{attempts.length} tentativas no total</p>
                )}
            </div>

            <ul className='flex flex-col gap-3'>
                {last.details.map((detail) => {
                    const question = questions.find((q) => q.id === detail.questionId);
                    const chosen = question.answers.find((a) => a.id === detail.answerId);
                    const correct = question.answers.find((a) => a.id === detail.correctAnswerId);

                    return (
                        <li key={detail.questionId} className='rounded-lg bg-color4-100 p-3'>
                            <p className='font-secundary font-semibold text-color1-100'>{question.question}</p>
                            <p className={detail.isCorrect ? 'text-green-600' : 'text-red-600'}>
                                Sua resposta: {chosen ? chosen.text : 'Não respondeu'}
                            </p>
                            {!detail.isCorrect && <p className='text-green-600'>Correta: {correct.text}</p>}
                        </li>
                    );
                })}
            </ul>

            <div className='flex justify-center gap-3'>
                <button onClick={onBack} className='rounded-lg px-4 py-2 font-semibold text-color1-100'>
                    Voltar
                </button>
                <button onClick={onRetake} className='rounded-lg bg-color1-100 px-4 py-2 font-semibold text-white'>
                    Responder novamente
                </button>
            </div>
        </div>
    );
}