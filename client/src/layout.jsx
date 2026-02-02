import { useAuthenticated } from './context/authContext';
import UnprotectedLayout from './pages/unprotected/layout';
import ProtectedLayout from './pages/protected/layout';
import RenderMessages from './components/renderMessages';
import Footer from './components/footer';

export default function Layout() {
    const { isAuthenticated } = useAuthenticated();

    return (
        <div className='wrapper'>
            <RenderMessages />
            {isAuthenticated ? <ProtectedLayout /> : <UnprotectedLayout />}
            <Footer />
        </div>
    );
}
