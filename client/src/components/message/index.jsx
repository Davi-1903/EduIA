import { IconAlertCircle, IconCircleCheck, IconX } from '@tabler/icons-react';
import { useState } from 'react';
import { useMessages } from '../../context/messagesContext';

export default function Message({ id, message, type }) {
    const [close, setClose] = useState(false);
    const { setMessages } = useMessages();

    function handleAnimationEnd(id) {
        if (close) {
            deleteMessage(id);
            setClose(false);
        }
    }

    function deleteMessage(id) {
        setMessages(prev => prev.filter(item => item.id !== id));
    }

    return (
        <article
            className={`pointer-events-auto relative flex w-sm items-center gap-4 overflow-hidden rounded-lg p-4 backdrop-blur-lg ${type === 'ok' ? 'bg-green-600/75' : 'bg-red-600/75'} ${close ? 'animate-delete-message' : 'animate-new-message'}`}
            onAnimationEnd={() => handleAnimationEnd(id)}
        >
            <div className='h-fit'>
                {type === 'ok' ? (
                    <IconCircleCheck size={26} className='stroke-color4-200' />
                ) : (
                    <IconAlertCircle size={26} className='stroke-color4-200' />
                )}
            </div>
            <div className='h-fit flex-1'>
                <span className='font-secundary text-base/normal text-color4-200'>{message}</span>
            </div>
            <div className='self-start'>
                <button
                    className='hover:bg-color4-200/25 cursor-pointer rounded-sm p-1 transition-all duration-100'
                    onClick={() => setClose(true)}
                >
                    <IconX size={24} className='stroke-color4-200' />
                </button>
            </div>
            <div
                className='animate-progress bg-color4-200/50 absolute bottom-0 left-0 h-1 w-0 rounded-full'
                onAnimationEnd={() => setClose(true)}
            ></div>
        </article>
    );
}
