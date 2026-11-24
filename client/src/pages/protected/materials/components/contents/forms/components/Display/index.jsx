import { IconArrowRight, IconSend } from '@tabler/icons-react';

export default function Display({
    answers,
    toAnswer,
    isLoading,
    content,
    currentQuestionId,
    nextQuestion,
    handleSubmit,
}) {
    function isFinished() {
        for (const item of answers) {
            if (item.answer === '') return false;
        }
        return true;
    }

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-4 p-2'>
                <div className='h-4 flex-1 rounded-full bg-color4-100'>
                    <div
                        className='h-full rounded-full bg-linear-to-r from-color2-100 to-color1-400 transition-all duration-500 ease-out'
                        style={{
                            width: `${((currentQuestionId + 1) / content.length) * 100}%`,
                        }}
                    ></div>
                </div>
                <span className='font-secundary text-base font-semibold text-color1-100'>
                    {Math.floor(((currentQuestionId + 1) / content.length) * 100)}%
                </span>
            </div>
            <div className='grid h-60 place-items-center'>
                <p className='text-center font-secundary text-xl font-semibold text-color1-100 md:text-2xl'>
                    {content[currentQuestionId].question}
                </p>
            </div>
            <form
                onSubmit={handleSubmit}
                className='flex w-full flex-col gap-6'
            >
                <textarea
                    id={String(content[currentQuestionId].id) + ' answer'}
                    value={answers[currentQuestionId]?.answer}
                    onChange={e => toAnswer(content[currentQuestionId].id, e)}
                    className='resize-none rounded-lg border border-color4-25 p-2 font-medium outline-none focus:ring-2 focus:ring-color1-400'
                    placeholder='Sua resposta aqui...'
                    required
                ></textarea>
                {currentQuestionId < content.length - 1 ? (
                    <button
                        type='button'
                        className='flex cursor-pointer items-center justify-center gap-3 rounded-lg bg-button px-6 py-2 font-primary text-lg text-color4-400 transition-all duration-250 not-sm:flex-1 not-disabled:hover:shadow-lg-hard disabled:cursor-no-drop disabled:opacity-50'
                        disabled={currentQuestionId >= content.length}
                        onClick={nextQuestion}
                    >
                        <span>Próximo</span>
                        <IconArrowRight />
                    </button>
                ) : (
                    <button
                        disabled={!isFinished() || isLoading}
                        type='submit'
                        className='flex w-fit cursor-pointer items-center justify-center gap-3 self-end rounded-lg bg-button py-2 pr-4 pl-3 font-primary text-lg text-color4-400 transition-all duration-250 hover:not-disabled:shadow-lg-hard disabled:cursor-no-drop disabled:opacity-50'
                    >
                        <IconSend size={24} />
                        Enviar respostas
                    </button>
                )}
            </form>
        </div>
    );
}
