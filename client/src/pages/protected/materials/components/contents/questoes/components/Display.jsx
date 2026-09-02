export default function Display({ questions, currentQuestionId }) {
    return (
        <>
            <div className='flex items-center gap-4 p-2'>
                <div className='h-4 flex-1 rounded-full bg-color4-100'>
                    <div
                        className='h-full rounded-full bg-linear-to-r from-color2-100 to-color1-400 transition-all duration-500 ease-out'
                        style={{
                            width: `${((currentQuestionId + 1) / questions.length) * 100}%`,
                        }}
                    ></div>
                </div>
                <span className='font-secundary text-base font-semibold text-color1-100'>
                    {Math.floor(((currentQuestionId + 1) / questions.length) * 100)}%
                </span>
            </div>
            <div className='grid flex-1 place-items-center'>
                <p className='text-center font-secundary text-2xl font-semibold text-color1-100'>
                    {questions[currentQuestionId].question}
                </p>
            </div>
        </>
    );
}
