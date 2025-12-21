import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuthenticated } from '../../../context/authContext';
import Mascote from '/assets/images/mascote/error_404.png';

export default function Error404() {
    const { isAuthenticated } = useAuthenticated();

    return (
        <>
            <Helmet>
                <title>EduIA | Not found</title>
            </Helmet>
            <main className='bg-color4-200 flex min-h-screen items-center justify-center gap-8 p-8 md:p-24'>
                <article className='hidden flex-1 lg:block'>
                    <img src={Mascote} alt='Mascote' className='mx-auto w-full max-w-160' />
                </article>
                <article className='flex-1 text-center md:text-left'>
                    <h1 className='text-color1-200 mb-2 text-4xl font-semibold md:text-6xl'>Not found Error</h1>
                    <h2 className='text-color3-100 text-xl md:text-2xl'>Página não encontrada</h2>
                    <Link to={isAuthenticated ? '/dash' : '/'}>
                        <button className='bg-color1-100 text-color4-200 font-primary hover:shadow-lg-hard text-md mt-6 cursor-pointer rounded-xl px-4 py-4 transition-all duration-200 md:px-8 md:text-xl'>
                            Voltar para o inicio
                        </button>
                    </Link>
                </article>
            </main>
        </>
    );
}
