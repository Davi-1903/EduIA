import { useMessages } from '../../context/messagesContext';
import Message from '../message';

export default function RenderMessages() {
    const { messages } = useMessages();

    return (
        <article className='pointer-events-none fixed right-0 z-6 flex flex-col gap-4 p-4'>
            {messages.map(message => (
                <Message key={message.id} {...message} />
            ))}
        </article>
    );
}
