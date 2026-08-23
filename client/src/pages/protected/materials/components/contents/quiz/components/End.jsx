export default function End({ subject, difficulty, time, questions, corrects, handleRestart, setClose }) {
    return (
        <article className='flex flex-col items-center gap-6'>
            <h1 className='bg-linear-to-tr from-color1-100 to-color4-100 bg-clip-text text-center font-primary text-6xl font-bold text-transparent'>
                Fim
            </h1>
            <p className='w-4/5 text-center font-primary text-lg text-color1-100'>
                <strong>Assunto:</strong> {subject}
            </p>
            <p className='font-primary text-lg text-color1-100'>
                <strong>Tempo por pergunta:</strong> {time}s
            </p>
            <p className='font-primary text-lg text-color1-100'>
                <strong>Dificuldade:</strong> {difficulty}
            </p>
            <p className='text-center text-[1.2rem] font-bold text-color2-100'>
                {corrects}/{questions.length}
            </p>
            <div className='grid grid-cols-[160px_160px] gap-6'>
                <button
                    className='cursor-pointer rounded-xl bg-button px-4 py-3 text-xl font-medium text-white transition-all duration-250 hover:shadow-lg-hard'
                    onClick={handleRestart}
                >
                    Reiniciar
                </button>
                <button
                    className='cursor-pointer rounded-xl bg-linear-to-tr from-red-800 to-red-500 px-4 py-3 text-xl font-medium text-white transition-all duration-250 hover:shadow-lg-hard hover:shadow-red-600'
                    onClick={() => setClose(true)}
                >
                    Sair
                </button>
            </div>
        </article>
    );
}
