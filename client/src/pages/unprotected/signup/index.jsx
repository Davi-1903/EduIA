import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    IconArrowLeft,
    IconChalkboardTeacher,
    IconEye,
    IconEyeOff,
    IconMail,
    IconSchool,
    IconUser,
} from '@tabler/icons-react';
import { Helmet } from 'react-helmet-async';
import Footer from '../../../components/footer';
import ProtectedRoute from '../../../components/protectedRoute';
import { useAuthenticated } from '../../../context/authContext';
import { useMessages } from '../../../context/messagesContext';
import RenderMessages from '../../../components/renderMessages';
import { POST } from '../../../api/auth';

export default function SignUp() {
    const [mode, setMode] = useState(null);
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { setAuthenticated } = useAuthenticated();
    const { setMessages } = useMessages();
    const navigate = useNavigate();
    const passwordClassifications = [
        { indication: 'Muito Fraca', color: '#a52a2a' },
        { indication: 'Fraca', color: '#df7500' },
        { indication: 'Média', color: '#dfc500' },
        { indication: 'Forte', color: '#7add32' },
        { indication: 'Muito Forte', color: '#32cd42' },
    ];

    async function handleRegister(e) {
        e.preventDefault();

        try {
            const data = await POST('/api/auth/register', { nome, email, password, type: mode });
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

    function toggleShowPassword() {
        setShowPassword(!showPassword);
    }

    function classifyPassword(password) {
        const conditions = [/.{8,}/, /[a-z]/, /[A-Z]/, /[0-9]/, /\W/];
        let security = 0;
        for (let regex of conditions) {
            if (regex.test(password)) {
                security++;
            }
        }
        return security;
    }

    return (
        <ProtectedRoute isPrivate={false}>
            <Helmet>
                <title>EduIA | Cadastro</title>
                <meta name='description' content='Página de cadastro de usuários do sistema EduIA' />
            </Helmet>
            <div className='wrapper'>
                <RenderMessages />
                <main className='grid min-h-screen grid-cols-1 bg-color4-200 p-4 lg:grid-cols-[2fr_3fr]'>
                    <article className='grid place-items-center p-4 md:p-12'>
                        {/* Talvez fazer um botão que volte ao estado anterior, para a opções de escolher o tipo da conta */}
                        <Link to='/' className='absolute top-4 left-4' aria-label='Voltar para a página inicial'>
                            <button className='cursor-pointer gap-2 rounded-lg p-2 transition-all duration-75 hover:bg-color4-100'>
                                <IconArrowLeft className='stroke-color1-100' />
                            </button>
                        </Link>
                        {mode === null ? (
                            <article className='w-full max-w-md'>
                                <h2 className='bg-linear-to-tr from-color1-100 via-color1-400 to-color4-25 bg-clip-text font-primary text-6xl font-semibold text-transparent'>
                                    Olá!
                                </h2>
                                <p className='text-secundary mb-8 text-xl text-balance text-color3-25'>
                                    Para criar uma conta é preciso especificar o tipo da conta. Que tipo de conta
                                    deseja?
                                </p>
                                <div className='flex flex-wrap gap-4'>
                                    <button
                                        className='flex min-h-12 w-full flex-1 basis-50 cursor-pointer items-center justify-center gap-4 rounded-xl bg-button py-4 transition-all duration-150 hover:shadow-lg-hard'
                                        onClick={() => setMode('Student')}
                                    >
                                        <IconSchool size={26} className='stroke-color4-200' />
                                        <span className='text-lg font-semibold text-color4-200'>Aluno</span>
                                    </button>
                                    <button
                                        className='flex min-h-12 w-full flex-1 basis-50 cursor-pointer items-center justify-center gap-4 rounded-xl bg-button py-4 transition-all duration-150 hover:shadow-lg-hard'
                                        onClick={() => setMode('Teacher')}
                                    >
                                        <IconChalkboardTeacher size={26} className='stroke-color4-200' />
                                        <span className='text-lg font-semibold text-color4-200'>Professor</span>
                                    </button>
                                </div>
                            </article>
                        ) : (
                            <form className='flex w-full max-w-80 flex-col gap-4' onSubmit={handleRegister}>
                                <h2 className='bg-linear-to-tr from-color1-100 via-color1-400 to-color4-25 bg-clip-text font-primary text-4xl font-bold text-transparent'>
                                    Cadastro
                                </h2>
                                <div>
                                    <label htmlFor='nome' className='block text-color1-100'>
                                        Nome
                                    </label>
                                    <div className='relative'>
                                        <input
                                            type='text'
                                            id='nome'
                                            value={nome}
                                            onChange={e => setNome(e.target.value)}
                                            className='min-h-12 w-full rounded-lg bg-color4-100 pr-12 pl-4 outline-0'
                                            placeholder='Qual o seu nome?'
                                            required
                                            autoFocus
                                        />
                                        <label
                                            htmlFor='nome'
                                            className='absolute top-[0.3rem] right-[0.3rem] grid aspect-square h-[2.4rem] cursor-text place-items-center rounded-sm hover:bg-color4-50'
                                        >
                                            <IconUser size={26} className='stroke-color1-100' />
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor='email' className='block text-color1-100'>
                                        Email
                                    </label>
                                    <div className='relative'>
                                        <input
                                            type='email'
                                            id='email'
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            className='min-h-12 w-full rounded-lg bg-color4-100 pr-12 pl-4 outline-0'
                                            placeholder='exemplo@gmail.com'
                                            required
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
                                            className='min-h-12 w-full rounded-lg bg-color4-100 pr-12 pl-4 outline-0'
                                            placeholder='Sua senha secreta...'
                                            onChange={e => setPassword(e.target.value)}
                                            value={password}
                                            required
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
                                    </div>
                                    <div className='mt-2 h-1 rounded-full bg-color4-100'>
                                        <div
                                            className='h-full rounded-full transition-all duration-150'
                                            style={{
                                                width: `${classifyPassword(password) * 20}%`,
                                                backgroundColor:
                                                    passwordClassifications[classifyPassword(password) - 1]?.color,
                                            }}
                                        ></div>
                                    </div>
                                    <span className='mt-1 block text-right font-secundary text-color3-400'>
                                        {passwordClassifications[classifyPassword(password) - 1]?.indication}
                                    </span>
                                </div>
                                <button
                                    type='submit'
                                    className='min-h-12 cursor-pointer rounded-lg bg-button text-xl text-color4-100 transition-all duration-150 hover:shadow-lg-hard'
                                >
                                    Entrar
                                </button>
                                <div className='text-center'>
                                    <p className='mt-1 text-center text-color3-25'>
                                        Já tem uma conta?{' '}
                                        <Link to='/login' className='font-bold text-color1-400 hover:underline'>
                                            Login
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        )}
                    </article>
                    <article className='hidden rounded-2xl bg-[url(/assets/images/mascote/cadastro.webp)] bg-cover bg-center bg-no-repeat lg:block'></article>
                </main>
                <Footer />
            </div>
        </ProtectedRoute>
    );
}
