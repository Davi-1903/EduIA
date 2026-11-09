import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconArrowLeft, IconLogin2 } from '@tabler/icons-react';
import { Helmet } from 'react-helmet-async';
import Footer from '../../../components/footer';
import ProtectedRoute from '../../../components/protectedRoute';
import { useAuthenticated } from '../../../context/authContext';
import { useMessages } from '../../../context/messagesContext';
import RenderMessages from '../../../components/renderMessages';
import { POST } from '../../../api/auth';

export default function SignUp() {
    const [isLoading, setLoading] = useState(false);
    const { setAuthenticated, setUser } = useAuthenticated();
    const { setMessages } = useMessages();
    const navigate = useNavigate();

    async function handleRegister(e) {
        e.preventDefault();
        setLoading(true);

        try {
            const data = await POST('/api/auth/register', { nome, email, password, type: mode });
            if (!data.ok) {
                throw new Error(data.message);
            }
            setAuthenticated(true);
            setUser(data.user);
            navigate(data.redirect);
        } catch (err) {
            setMessages(prev => [
                ...prev,
                {
                    id: prev.length + 1,
                    message:
                        err.name === 'SyntaxError' ? 'Ocorreu um problema com a resposta do servidor' : err.message,
                    type: 'danger',
                },
            ]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <ProtectedRoute isPrivate={false}>
            <Helmet>
                <title>EduIA | Cadastro</title>
                <meta
                    name='description'
                    content='Página de cadastro de usuários do sistema EduIA'
                />
            </Helmet>
            <div className='wrapper'>
                <RenderMessages />
                <main className='grid min-h-screen grid-cols-1 bg-color4-200 p-4 lg:grid-cols-[2fr_3fr]'>
                    <article className='grid place-items-center p-4 md:p-12'>
                        <Link
                            to='/'
                            className='absolute top-4 left-4'
                            aria-label='Voltar para a página inicial'
                        >
                            <button className='cursor-pointer gap-2 rounded-lg p-2 transition-all duration-75 hover:bg-color4-100'>
                                <IconArrowLeft className='stroke-color1-100' />
                            </button>
                        </Link>
                        <article className='w-full max-w-md'>
                            <h2 className='bg-linear-to-tr from-color1-100 via-color1-400 to-color4-25 bg-clip-text font-primary text-6xl font-semibold text-transparent'>
                                Olá!
                            </h2>
                            <p className='text-secundary mb-6 text-xl text-balance text-color3-25'>
                                Para criar uma conta é preciso entrar com o{' '}
                                <strong className='text-color1-100'>SUAP</strong>
                            </p>
                            <button
                                className='flex min-h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-lg border-2 border-color1-100 stroke-color1-100 px-4 py-2 text-lg text-color1-100 transition-all duration-100 hover:bg-button hover:stroke-color3-100 hover:text-color4-100'
                                onClick={() => window.location.assign('/api/auth/suap/login')}
                                disabled={isLoading}
                            >
                                <IconLogin2 size={32} />
                                <span>
                                    Entrar com <strong>SUAP</strong>
                                </span>
                            </button>
                            <p className='mt-6 text-center text-color3-25'>
                                Já tem uma conta?{' '}
                                <Link
                                    to='/login'
                                    className='font-bold text-color1-400 hover:underline'
                                >
                                    Login
                                </Link>
                            </p>
                        </article>
                    </article>
                    <article className='hidden rounded-2xl bg-[url(/assets/images/mascote/cadastro.webp)] bg-cover bg-center bg-no-repeat lg:block'></article>
                </main>
                <Footer />
            </div>
        </ProtectedRoute>
    );
}
