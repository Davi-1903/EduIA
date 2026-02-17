import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuthenticated } from '../../../context/authContext';
import Mascote from '/assets/images/mascote/error_404.webp';

export default function Error404() {
    const { isAuthenticated } = useAuthenticated();

    return (
        <>
            <Helmet>
                <title>EduIA | Not found</title>
            </Helmet>
            <main className='flex min-h-screen items-center justify-center gap-8 bg-color4-200 p-8 md:p-24'>
                <article className='hidden flex-1 lg:block'>
                    <img src={Mascote} alt='Mascote' loading='lazy' className='mx-auto w-full max-w-160' />
                </article>
                <article className='flex-1 text-center md:text-left'>
                    <h1 className='mb-2 text-4xl font-semibold text-color1-200 md:text-6xl'>Not found Error</h1>
                    <h2 className='text-xl text-color3-100 md:text-2xl'>Página não encontrada</h2>
                    <Link to={isAuthenticated ? '/dash' : '/'} prefetch='intent'>
                        <button className='mt-6 cursor-pointer rounded-xl bg-button px-4 py-4 font-primary text-base text-color4-200 transition-all duration-200 hover:shadow-lg-hard md:px-8 md:text-xl'>
                            Voltar para o inicio
                        </button>
                    </Link>
                </article>
            </main>
        </>
    );
}
