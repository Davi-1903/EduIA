export default function Introduction({ subject, difficulty, time, questionsLength, handleStart }) {
    return (
        <article className='flex flex-col items-center gap-6'>
            <h1 className='bg-linear-to-tr from-color1-100 to-color4-100 bg-clip-text text-center font-primary text-5xl font-bold text-transparent'>
                Iniciar Quiz
            </h1>
            <p className='text-center font-primary text-lg text-color1-100'>
                <strong>Assunto:</strong> {subject}
            </p>
            <p className='font-primary text-lg text-color1-100'>
                <strong>Dificuldade:</strong> {difficulty}
            </p>
            <p className='font-primary text-lg text-color1-100'>
                <strong>Tempo por pergunta:</strong> {time}s
            </p>
            <p className='font-primary text-lg text-color1-100'>
                <strong>Quantidade de perguntas:</strong> {questionsLength}
            </p>
            <button
                className='cursor-pointer rounded-xl bg-button px-24 py-3 text-xl font-medium text-white transition-all duration-250 hover:shadow-lg-hard'
                onClick={handleStart}
            >
                Iniciar
            </button>
        </article>
    );
}
