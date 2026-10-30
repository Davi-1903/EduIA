import { useState } from 'react';
import clsx from 'clsx';

import Display from './components/Display';
import Introduction from './components/Introduction';
import End from './components/End';

export default function Formulario({
    id,
    discipline,
    subject,
    difficulty,
    userEmail,
    content,
    setContent,
}) {
    const [emailConfirmed, setEmailConfirmed] = useState(false);
    const [start, setStart] = useState(false);
    const [finished, setFinished] = useState(false);
    const [isClose, setClose] = useState(false);

    function handleAnimationEnd(event) {
        if (event.target !== event.currentTarget) return;

        if (isClose) setContent(null);
    }

    return (
        <div
            onAnimationEnd={handleAnimationEnd}
            className={clsx(
                'fixed inset-0 z-7 grid place-items-center bg-gray-800/20 backdrop-blur-sm',
                isClose ? 'animate-fade-out' : 'animate-fade-in',
            )}
        >
            <main className='flex max-h-[90vh] w-full max-w-2xl flex-col gap-6 overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl shadow-color1-100/15 lg:w-4/5'>
                {finished ? (
                    <End
                        discipline={discipline}
                        subject={subject}
                        questionsLength={content.length}
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
                        userEmail={userEmail}
                        emailConfirmed={emailConfirmed}
                        setEmailConfirmed={setEmailConfirmed}
                        discipline={discipline}
                        subject={subject}
                        setClose={setClose}
                        onSuccess={() => setFinished(true)}
                    />
                )}
            </main>
        </div>
    );
}