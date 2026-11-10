import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IconArrowLeft, IconEye, IconEyeOff, IconLogin2, IconMail } from '@tabler/icons-react';
import { Helmet } from 'react-helmet-async';
import Footer from '../../../components/footer';
import ProtectedRoute from '../../../components/protectedRoute';
import { useMessages } from '../../../context/messagesContext';
import RenderMessages from '../../../components/renderMessages';
import { POST } from '../../../api/auth';

export default function SignIn() {
    const { setMessages } = useMessages();

    useEffect(() => {
        const error = new URLSearchParams(window.location.search).get('suap_error');
        if (!error) return;

        const messages = {
            invalid_state: 'A validação de segurança do login SUAP falhou. Tente novamente.',
            denied: 'A autenticação no SUAP foi cancelada.',
            invalid_response: 'O SUAP não retornou um código de autenticação.',
            account_conflict: 'Esta conta SUAP precisa ser vinculada pelo administrador.',
            unsupported_user: 'Este tipo de vínculo SUAP não pode acessar o EduIA.',
            unavailable: 'O login SUAP está temporariamente indisponível.',
        };
        setMessages(prev => [
            ...prev,
            {
                id: Date.now(),
                message: messages[error] || 'Não foi possível autenticar com o SUAP.',
                type: 'danger',
            },
        ]);
        window.history.replaceState({}, '', window.location.pathname);
    }, [setMessages]);

    return (
        <ProtectedRoute isPrivate={false}>
            <Helmet>
                <title>EduIA | Login</title>
                <meta
                    name='description'
                    content='Página de autenticação de usuários do sistema EduIA'
                />
            </Helmet>
            <div className='wrapper'>
                <RenderMessages />
                <main className='grid min-h-screen grid-cols-1 bg-color4-200 p-4 lg:grid-cols-[2fr_3fr]'>
                    <article className='grid place-items-center p-4'>
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
                                Inicie a sessão com o <strong className='text-color1-100'>SUAP</strong>
                            </p>
                            <button
                                className='flex min-h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-lg border-2 border-color1-100 stroke-color1-100 px-4 py-2 text-lg text-color1-100 transition-all duration-250 hover:bg-button hover:stroke-color3-100 hover:text-color4-100'
                                onClick={() => window.location.assign('/api/auth/suap/login')}
                            >
                                <IconLogin2 size={32} />
                                <span>
                                    Entrar com <strong>SUAP</strong>
                                </span>
                            </button>
                        </article>
                    </article>
                    <article className='hidden rounded-2xl bg-[url(/assets/images/mascote/login.webp)] bg-cover bg-center bg-no-repeat lg:block'></article>
                </main>
                <Footer />
            </div>
        </ProtectedRoute>
    );
}
