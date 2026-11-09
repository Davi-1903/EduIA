import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconArrowLeft, IconEye, IconEyeOff, IconLogin2, IconMail } from '@tabler/icons-react';
import { Helmet } from 'react-helmet-async';
import Footer from '../../../components/footer';
import ProtectedRoute from '../../../components/protectedRoute';
import { useAuthenticated } from '../../../context/authContext';
import { useMessages } from '../../../context/messagesContext';
import RenderMessages from '../../../components/renderMessages';
import { POST } from '../../../api/auth';

export default function SignIn() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [isLoading, setLoading] = useState(false);
    const { setAuthenticated, setUser } = useAuthenticated();
    const { setMessages } = useMessages();
    const navigate = useNavigate();

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

    function toggleShowPassword() {
        setShowPassword(!showPassword);
    }

    async function submit(e) {
        e.preventDefault();
        setLoading(true);

        try {
            const data = await POST('/api/auth/login', { email, senha });
            if (!data.ok) {
                throw new Error(data.message);
            }
            setUser(data.user);
            setAuthenticated(true);
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
                        <form
                            onSubmit={submit}
                            className='box-content flex w-full max-w-80 flex-col gap-4'
                        >
                            <h2 className='bg-linear-to-tr from-color1-100 via-color1-400 to-color4-25 bg-clip-text font-primary text-[2.5rem]/[50px] font-bold text-transparent'>
                                Login
                            </h2>
                            <div>
                                <label
                                    htmlFor='email'
                                    className='block text-color1-100'
                                >
                                    Email
                                </label>
                                <div className='relative'>
                                    <input
                                        type='email'
                                        id='email'
                                        required
                                        autoFocus
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className='min-h-12 w-full rounded-lg bg-color4-100 pr-12 pl-4 outline-0'
                                        placeholder='exemplo@gmail.com'
                                    />
                                    <label
                                        htmlFor='email'
                                        className='absolute top-[0.3rem] right-[0.3rem] grid aspect-square h-[2.4rem] cursor-text place-items-center rounded-sm hover:bg-color4-50'
                                    >
                                        <IconMail
                                            size={26}
                                            className='text-color1-100'
                                        />
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label
                                    htmlFor='senha'
                                    className='block text-color1-100'
                                >
                                    Senha
                                </label>
                                <div className='relative'>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id='senha'
                                        required
                                        value={senha}
                                        onChange={e => setSenha(e.target.value)}
                                        className='min-h-12 w-full rounded-lg bg-color4-100 pr-12 pl-4 outline-0'
                                        placeholder='Sua senha secreta...'
                                    />
                                    <button
                                        type='button'
                                        className='absolute top-[0.3rem] right-[0.3rem] grid aspect-square h-[2.4rem] cursor-pointer place-items-center rounded-sm hover:bg-color4-50'
                                        onClick={toggleShowPassword}
                                    >
                                        {showPassword ? (
                                            <IconEye
                                                size={26}
                                                className='stroke-color1-100'
                                            />
                                        ) : (
                                            <IconEyeOff
                                                size={26}
                                                className='stroke-color1-100'
                                            />
                                        )}
                                    </button>
                                    <p className='text-right'>
                                        <Link className='text-sm font-semibold text-color1-400 hover:underline'>
                                            Esqueceu sua senha?
                                        </Link>
                                    </p>
                                </div>
                            </div>
                            <button
                                type='submit'
                                className='mt-2 min-h-12 cursor-pointer rounded-lg bg-button text-xl text-color4-100 transition-all duration-150 not-disabled:hover:shadow-lg-hard disabled:cursor-not-allowed disabled:opacity-60'
                                disabled={isLoading}
                            >
                                Entrar
                            </button>
                            <div className='relative my-2'>
                                <hr className='absolute top-1/2 h-0.5 w-full -translate-y-1/2 rounded-full bg-color3-25/20' />
                                <span className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-color4-200 px-2 font-semibold text-color3-25/40'>
                                    Ou
                                </span>
                            </div>
                            <button
                                type='button'
                                className='flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-color1-100 stroke-color1-100 px-4 py-2 text-lg text-color1-100 transition-all duration-100 hover:bg-button hover:stroke-color3-100 hover:text-color4-100'
                                onClick={() => window.location.assign('/api/auth/suap/login')}
                                disabled={isLoading}
                            >
                                <IconLogin2 size={32} />
                                <span>Entrar com SUAP</span>
                            </button>
                            <p className='mt-1 text-center text-color3-25'>
                                Não tem uma conta?{' '}
                                <Link
                                    to='/cadastro'
                                    className='font-bold text-color1-400 hover:underline'
                                >
                                    Cadastro
                                </Link>
                            </p>
                        </form>
                    </article>
                    <article className='hidden rounded-2xl bg-[url(/assets/images/mascote/login.webp)] bg-cover bg-center bg-no-repeat lg:block'></article>
                </main>
                <Footer />
            </div>
        </ProtectedRoute>
    );
}
