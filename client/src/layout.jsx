import UnprotectedLayout from './pages/unprotected/layout';
import Footer from './components/footer';
import RenderMessages from './components/renderMessages';

export default function App() {
    return (
        <div className='wrapper'>
            <RenderMessages />
            <UnprotectedLayout />
            <Footer />
        </div>
    );
}
