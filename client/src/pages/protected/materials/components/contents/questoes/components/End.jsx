export default function End({ questions, corrects, handleRestart, setClose }) {
    return (
        <article className='grid gap-6'>
            <h1 className='text-center text-[3.6rem] font-bold text-color1-100'>Fim!</h1>
            <h2 className='text-center text-[1.2rem] font-semibold text-color3-100'>
                {corrects}/{questions.length}
            </h2>
            <div className='grid grid-cols-2 gap-3'>
                <button
                    className='cursor-pointer rounded-xl bg-button px-4 py-2 text-lg font-semibold text-white transition-all duration-100 hover:scale-102'
                    onClick={handleRestart}
                >
                    Reiniciar
                </button>
                <button
                    className='cursor-pointer rounded-xl bg-linear-to-tr from-red-800 to-red-500 px-4 py-2 text-lg font-semibold text-white transition-all duration-100 hover:scale-102'
                    onClick={() => setClose(true)}
                >
                    Sair
                </button>
            </div>
        </article>
    );
}
