import { Outlet } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/footer';

export default function App() {
    return (
        <div className='wrapper'>
            <Header />
            <Outlet />
            <Footer />
        </div>
    );
}
