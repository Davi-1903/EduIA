import { AuthenticatedProvider } from './authContext';
import { MessagesProvider } from './messagesContext';

export default function WrapperProvider({ children }) {
    return (
        <AuthenticatedProvider>
            <MessagesProvider>{children}</MessagesProvider>
        </AuthenticatedProvider>
    );
}
