import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconArrowLeft, IconEye, IconEyeOff, IconMail } from '@tabler/icons-react';
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
    const { setAuthenticated } = useAuthenticated();
    const { setMessages } = useMessages();
    const navigate = useNavigate();

    function toggleShowPassword() {
        setShowPassword(!showPassword);
    }

    async function submit(e) {
        e.preventDefault();

        try {
            const data = await POST('/api/auth/login', { email, senha });
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
            <Helmet>
                <title>EduIA | Login</title>
                <meta name='description' content='Página de autenticação de usuários do sistema EduIA' />
            </Helmet>
            <div className='wrapper'>
                <RenderMessages />
                <main className='grid min-h-screen grid-cols-1 bg-color4-200 p-4 lg:grid-cols-[2fr_3fr]'>
                    <article className='grid place-items-center p-4'>
                        <Link to='/' className='absolute top-4 left-4' aria-label='Voltar para a página inicial'>
                            <button className='cursor-pointer gap-2 rounded-lg p-2 transition-all duration-75 hover:bg-color4-100'>
                                <IconArrowLeft className='stroke-color1-100' />
                            </button>
                        </Link>
                        <form onSubmit={submit} className='box-content flex w-full max-w-80 flex-col gap-4'>
                            <h2 className='bg-linear-to-tr from-color1-100 via-color1-400 to-color4-25 bg-clip-text font-primary text-[2.5rem]/[50px] font-bold text-transparent'>
                                Login
                            </h2>
                            <div>
                                <label htmlFor='email' className='block text-color1-100'>
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
                                        <IconMail size={26} className='text-color1-100' />
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label htmlFor='senha' className='block text-color1-100'>
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
                                            <IconEye size={26} className='stroke-color1-100' />
                                        ) : (
                                            <IconEyeOff size={26} className='stroke-color1-100' />
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
                                className='mt-2 min-h-12 cursor-pointer rounded-lg bg-button text-xl text-color4-100 transition-all duration-150 hover:shadow-lg-hard'
                            >
                                Entrar
                            </button>
                            <p className='mt-1 text-center text-color3-25'>
                                Não tem uma conta?{' '}
                                <Link to='/cadastro' className='font-bold text-color1-400 hover:underline'>
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
