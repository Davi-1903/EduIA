import { useEffect, useRef, useState } from 'react';
import { useMessages } from '../../../../../../context/messagesContext';
import { POST } from '../../../../../../api/materials';
import clsx from 'clsx';

import Display from './components/Display';
import Introduction from './components/Introduction';
import End from './components/End';

export default function Formulario({ id, discipline, subject, difficulty, content, setContent }) {
    const [answers, setAnswers] = useState(
        content.map(item => ({ id: item.id, answer: '', expectedAnswer: item.expectedAnswer })),
    );
    const [isLoading, setLoading] = useState(false);
    const [start, setStart] = useState(false);
    const [finished, setFinished] = useState(false);
    const [currentQuestionId, setCurrentQuestionId] = useState(0);
    const [correction, setCorrection] = useState(null);
    const [isClose, setClose] = useState(false);
    const { setMessages } = useMessages();
    const materialRef = useRef(null);

    function handleAnimationEnd(event) {
        if (event.target !== event.currentTarget) return;
        if (isClose) setContent(null);
    }

    function nextQuestion() {
        if (currentQuestionId >= content.length - 1) {
            setCurrentQuestionId(content.length);
        } else {
            setCurrentQuestionId(prev => prev + 1);
        }
    }

    function toAnswer(id, e) {
        setAnswers(prev => prev.map(item => (item.id === id ? { ...item, answer: e.target.value } : item)));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const timeID = setTimeout(() => {
            setLoading(true);
        }, 200);

        try {
            const data = await POST(`/api/materials/formulario/${id}/answer`, { answers });
            if (data.status !== 200) throw new Error(data.message || 'Não foi possível enviar as respostas');
            setCorrection(data.correction);
            console.log(data.correction.answers);
            setFinished(true);
        } catch (err) {
            setMessages(prev => [
                ...prev,
                {
                    id: prev.length + 1,
                    message:
                        err.name === 'SyntaxError' ? 'Ocorreu um problema com a resposta do servidor' : err.message,
                    type: 'error',
                },
            ]);
        } finally {
            setLoading(false);
            clearTimeout(timeID);
        }
    }

    useEffect(() => {
        function handleClick(event) {
            if (
                !materialRef.current?.contains(event.target) &&
                (!start || confirm('Deseja parar de responder o formulário?'))
            )
                setClose(true);
        }

        function handleKey(event) {
            if (event.key === 'Escape' && (!start || confirm('Deseja parar de responder o formulário?')))
                setClose(true);
        }

        document.addEventListener('mousedown', handleClick);
        document.addEventListener('keydown', handleKey);
        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('keydown', handleKey);
        };
    }, [start]);

    return (
        <div
            onAnimationEnd={handleAnimationEnd}
            className={clsx(
                'fixed inset-0 z-7 grid place-items-center bg-gray-800/20 backdrop-blur-sm',
                isClose ? 'animate-fade-out' : 'animate-fade-in',
            )}
        >
            <main
                ref={materialRef}
                className='flex max-h-[90vh] w-full max-w-2xl flex-col gap-6 overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl shadow-color1-100/15 lg:w-4/5'
            >
                {finished ? (
                    <End
                        discipline={discipline}
                        subject={subject}
                        questionsLength={content.length}
                        content={content}
                        correction={correction}
                        handleClose={() => setClose(true)}
                    />
                ) : !start ? (
                    <Introduction
                        discipline={discipline}
                        subject={subject}
                        difficulty={difficulty}
                        questionsLength={content.length}
                        handleClose={() => setClose(true)}
                        handleStart={() => setStart(true)}
                    />
                ) : (
                    <Display
                        id={id}
                        content={content}
                        answers={answers}
                        currentQuestionId={currentQuestionId}
                        toAnswer={toAnswer}
                        nextQuestion={nextQuestion}
                        isLoading={isLoading}
                        handleSubmit={handleSubmit}
                    />
                )}
            </main>
        </div>
    );
}
