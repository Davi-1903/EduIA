import { useAuthenticated } from './context/authContext';
import UnprotectedLayout from './pages/unprotected/layout';
import ProtectedLayout from './pages/protected/layout';
import RenderMessages from './components/renderMessages';
import Footer from './components/footer';
import clsx from 'clsx';

export default function Layout() {
    const { isAuthenticated } = useAuthenticated();

    return (
        <div className={clsx('wrapper', isAuthenticated && 'grid grid-cols-[auto_1fr]')}>
            <RenderMessages />
            {isAuthenticated ? <ProtectedLayout /> : <UnprotectedLayout />}
            <Footer />
        </div>
    );
}
