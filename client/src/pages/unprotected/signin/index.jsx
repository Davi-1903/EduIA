import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconArrowLeft, IconEye, IconEyeOff, IconMail } from '@tabler/icons-react';
import { Helmet } from 'react-helmet-async';
import getCSRF from '../../../api/csrf';
import Footer from '../../../components/footer';
import ProtectedRoute from '../../../components/protectedRoute';
import { useAuthenticated } from '../../../context/authContext';
import { useMessages } from '../../../context/messagesContext';
import RenderMessages from '../../../components/renderMessages';

export default function SignIn() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const { setAuthenticated } = useAuthenticated();
    const { setMessages } = useMessages();
    const navigate = useNavigate();

    function toggleShowPassword() {
        setShowPassword(!showPassword);
    }

    async function submit(e) {
        e.preventDefault();
        const csrf = await getCSRF();

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrf,
                },
                credentials: 'include',
                body: JSON.stringify({ email, senha }),
            });
            const data = await response.json();

            if (!data.ok) {
                throw new Error(data.message);
            }

            setAuthenticated(true);
            navigate(data.redirect);
        } catch (err) {
            setMessages(prev => [
                ...prev,
                {
                    id: prev.length + 1,
                    message: err.message,
                    type: 'danger',
                },
            ]);
        }
    }

    return (
        <ProtectedRoute isPrivate={false}>
            <div className='wrapper'>
                <Helmet>
                    <title>EduIA | Login</title>
                    <meta name='description' content='Página de autenticação de usuários do sistema EduIA' />
                </Helmet>
                <RenderMessages />
                <main className='bg-color4-200 grid min-h-screen grid-cols-1 p-4 md:grid-cols-[3fr_2fr] lg:grid-cols-[2fr_3fr]'>
                    <article className='grid place-items-center p-4'>
                        <Link to='/' className='absolute top-4 left-4'>
                            <button className='hover:bg-color4-100 cursor-pointer gap-2 rounded-lg p-2 transition-all duration-75'>
                                <IconArrowLeft className='stroke-color1-100' />
                            </button>
                        </Link>
                        <form onSubmit={submit} className='box-content flex w-full max-w-80 flex-col gap-4'>
                            <h2 className='font-primary text-color1-100 text-[2.5rem]/[50px] font-bold'>Login</h2>
                            <div>
                                <label htmlFor='email' className='text-color1-100 block'>
                                    Email
                                </label>
                                <div className='relative'>
                                    <input
                                        type='email'
                                        id='email'
                                        required
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className='bg-color4-100 min-h-12 w-full rounded-lg pr-12 pl-4 outline-0'
                                        placeholder='exemplo@gmail.com'
                                    />
                                    <label
                                        htmlFor='email'
                                        className='hover:bg-color4-50 absolute top-[0.3rem] right-[0.3rem] grid aspect-square h-[2.4rem] cursor-text place-items-center rounded-sm'
                                    >
                                        <IconMail size={26} className='text-color1-100' />
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label htmlFor='senha' className='text-color1-100 block'>
                                    Senha
                                </label>
                                <div className='relative'>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id='senha'
                                        required
                                        value={senha}
                                        onChange={e => setSenha(e.target.value)}
                                        className='bg-color4-100 min-h-12 w-full rounded-lg pr-12 pl-4 outline-0'
                                        placeholder='Sua senha secreta...'
                                    />
                                    <button
                                        type='button'
                                        className='hover:bg-color4-50 absolute top-[0.3rem] right-[0.3rem] grid aspect-square h-[2.4rem] cursor-pointer place-items-center rounded-sm'
                                        onClick={toggleShowPassword}
                                    >
                                        {showPassword ? (
                                            <IconEye size={26} className='stroke-color1-100' />
                                        ) : (
                                            <IconEyeOff size={26} className='stroke-color1-100' />
                                        )}
                                    </button>
                                    <p className='text-right'>
                                        <Link className='text-color1-400 text-sm font-semibold hover:underline'>
                                            Esqueceu sua senha?
                                        </Link>
                                    </p>
                                </div>
                            </div>
                            <button
                                type='submit'
                                className='bg-color1-100 text-color4-100 hover:shadow-lg-hard mt-2 min-h-12 cursor-pointer rounded-lg text-xl transition-all duration-150'
                            >
                                Entrar
                            </button>
                            <p className='text-color3-25 mt-1 text-center'>
                                Não tem uma conta?{' '}
                                <Link to='/cadastro' className='text-color1-400 font-bold hover:underline'>
                                    Cadastro
                                </Link>
                            </p>
                        </form>
                    </article>
                    <article className='hidden rounded-2xl bg-[url(/assets/images/mascote/login.png)] bg-cover bg-center bg-no-repeat lg:block'></article>
                </main>
                <Footer />
            </div>
        </ProtectedRoute>
    );
}
