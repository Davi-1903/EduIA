export default function Display({ currentQuestionId, questions, time, onAnimationEnd }) {
    return (
        <>
            <div className='flex items-center gap-4 p-2'>
                <div className='h-4 flex-1 overflow-hidden rounded-full bg-color4-100'>
                    <div
                        onAnimationEnd={onAnimationEnd}
                        className='timer-bar'
                        style={{
                            animation: `animate-quiz-timer ${time}s linear forwards`,
                        }}
                    ></div>
                </div>
                <div>
                    <span className='font-secundary text-base font-semibold text-color1-100'>
                        {currentQuestionId + 1}/{questions.length}
                    </span>
                </div>
            </div>
            <div className='grid flex-1 place-items-center'>
                <p className='text-center font-secundary text-2xl font-semibold text-color1-100'>
                    {questions[currentQuestionId].question}
                </p>
            </div>
        </>
    );
}
