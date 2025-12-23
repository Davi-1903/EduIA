import { AuthenticatedProvider } from './authContext';
import { MessagesProvider } from './messagesContext';

export default function WrapperProvider({ children }) {
    // Nem sei se "Wrapper" é o termo correto, mas blz
    return (
        <AuthenticatedProvider>
            <MessagesProvider>{children}</MessagesProvider>
        </AuthenticatedProvider>
    );
}
