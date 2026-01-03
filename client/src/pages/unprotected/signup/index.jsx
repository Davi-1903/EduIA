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
import getCSRF from '../../../api/csrf';
import Footer from '../../../components/footer';
import ProtectedRoute from '../../../components/protectedRoute';
import { useAuthenticated } from '../../../context/authContext';
import { useMessages } from '../../../context/messagesContext';
import RenderMessages from '../../../components/renderMessages';

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
        const csrf = await getCSRF();

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrf,
                },
                credentials: 'include',
                body: JSON.stringify({ nome, email, password, type: mode }),
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
                <main className='bg-color4-200 grid min-h-screen grid-cols-1 p-4 lg:grid-cols-[2fr_3fr]'>
                    <article className='grid place-items-center p-4 md:p-12'>
                        {/* Talvez fazer um botão que volte ao estado anterior, para a opções de escolher o tipo da conta */}
                        <Link to='/' className='absolute top-4 left-4'>
                            <button className='hover:bg-color4-100 cursor-pointer gap-2 rounded-lg p-2 transition-all duration-75'>
                                <IconArrowLeft className='stroke-color1-100' />
                            </button>
                        </Link>
                        {mode === null ? (
                            <article className='w-full max-w-md'>
                                <h2 className='font-primary text-color1-100 text-6xl font-semibold'>Olá!</h2>
                                <p className='text-color3-25 text-secundary mb-8 text-xl text-balance'>
                                    Para criar uma conta é preciso especificar o tipo da conta. Que tipo de conta
                                    deseja?
                                </p>
                                <div className='flex flex-wrap gap-4'>
                                    <button
                                        className='bg-button hover:shadow-lg-hard flex min-h-12 w-full flex-1 basis-50 cursor-pointer items-center justify-center gap-4 rounded-xl py-4 transition-all duration-150'
                                        onClick={() => setMode('Student')}
                                    >
                                        <IconSchool size={26} className='stroke-color4-200' />
                                        <span className='text-color4-200 text-lg font-semibold'>Aluno</span>
                                    </button>
                                    <button
                                        className='bg-button hover:shadow-lg-hard flex min-h-12 w-full flex-1 basis-50 cursor-pointer items-center justify-center gap-4 rounded-xl py-4 transition-all duration-150'
                                        onClick={() => setMode('Teacher')}
                                    >
                                        <IconChalkboardTeacher size={26} className='stroke-color4-200' />
                                        <span className='text-color4-200 text-lg font-semibold'>Professor</span>
                                    </button>
                                </div>
                            </article>
                        ) : (
                            <form className='flex w-full max-w-80 flex-col gap-4' onSubmit={handleRegister}>
                                <h2 className='font-primary text-color1-100 text-4xl font-bold'>Cadastro</h2>
                                <div>
                                    <label htmlFor='nome' className='text-color1-100 block'>
                                        Nome
                                    </label>
                                    <div className='relative'>
                                        <input
                                            type='text'
                                            id='nome'
                                            value={nome}
                                            onChange={e => setNome(e.target.value)}
                                            className='bg-color4-100 min-h-12 w-full rounded-lg pr-12 pl-4 outline-0'
                                            placeholder='Qual o seu nome?'
                                            required
                                        />
                                        <label
                                            htmlFor='nome'
                                            className='hover:bg-color4-50 absolute top-[0.3rem] right-[0.3rem] grid aspect-square h-[2.4rem] cursor-text place-items-center rounded-sm'
                                        >
                                            <IconUser size={26} className='stroke-color1-100' />
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor='email' className='text-color1-100 block'>
                                        Email
                                    </label>
                                    <div className='relative'>
                                        <input
                                            type='email'
                                            id='email'
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            className='bg-color4-100 min-h-12 w-full rounded-lg pr-12 pl-4 outline-0'
                                            placeholder='exemplo@gmail.com'
                                            required
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
                                            className='bg-color4-100 min-h-12 w-full rounded-lg pr-12 pl-4 outline-0'
                                            placeholder='Sua senha secreta...'
                                            onChange={e => setPassword(e.target.value)}
                                            value={password}
                                            required
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
                                    </div>
                                    <div className='bg-color4-100 mt-2 h-1 rounded-full'>
                                        <div
                                            className='h-full rounded-full transition-all duration-150'
                                            style={{
                                                width: `${classifyPassword(password) * 20}%`,
                                                backgroundColor:
                                                    passwordClassifications[classifyPassword(password) - 1]?.color,
                                            }}
                                        ></div>
                                    </div>
                                    <span className='font-secundary text-color3-400 mt-1 block text-right'>
                                        {passwordClassifications[classifyPassword(password) - 1]?.indication}
                                    </span>
                                </div>
                                <button
                                    type='submit'
                                    className='bg-button text-color4-100 hover:shadow-lg-hard min-h-12 cursor-pointer rounded-lg text-xl transition-all duration-150'
                                >
                                    Entrar
                                </button>
                                <div className='text-center'>
                                    <p className='text-color3-25 mt-1 text-center'>
                                        Já tem uma conta?{' '}
                                        <Link to='/login' className='text-color1-400 font-bold hover:underline'>
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
