import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconArrowLeft, IconEye, IconEyeOff, IconMail, IconUser } from '@tabler/icons-react';

export default function SignUp() {
    const [showPassword, setShowPassword] = useState(false);

    function toggleShowPassword() {
        setShowPassword(!showPassword);
    }

    return (
        <main className='grid min-h-screen grid-cols-1 md:grid-cols-[3fr_2fr] lg:grid-cols-[2fr_3fr]'>
            <article className='bg-color3-200 grid place-items-center p-8'>
                <Link to='/' className='absolute top-4 left-4'>
                    <button className='hover:bg-color3-100 cursor-pointer gap-2 rounded-lg p-2 transition-all duration-75'>
                        <IconArrowLeft className='stroke-color1-100' />
                    </button>
                </Link>
                <form className='flex w-full max-w-80 flex-col gap-4'>
                    <h2 className='font-primary text-color1-100 text-4xl font-bold'>Cadastro</h2>
                    <div>
                        <label htmlFor='nome' className='text-color1-100 block'>
                            Nome
                        </label>
                        <div className='relative'>
                            <input
                                type='text'
                                id='nome'
                                className='bg-color3-100 min-h-12 w-full rounded-lg pr-12 pl-4 outline-0'
                                placeholder='Qual o seu nome?'
                                required
                            />
                            <label
                                htmlFor='nome'
                                className='hover:bg-color3-50 absolute top-[0.3rem] right-[0.3rem] grid aspect-square h-[2.4rem] cursor-text place-items-center rounded-sm'
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
                                className='bg-color3-100 min-h-12 w-full rounded-lg pr-12 pl-4 outline-0'
                                placeholder='exemplo@gmail.com'
                                required
                            />
                            <label
                                htmlFor='email'
                                className='hover:bg-color3-50 absolute top-[0.3rem] right-[0.3rem] grid aspect-square h-[2.4rem] cursor-text place-items-center rounded-sm'
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
                                className='bg-color3-100 min-h-12 w-full rounded-lg pr-12 pl-4 outline-0'
                                placeholder='Sua senha secreta...'
                                required
                            />
                            <button
                                type='button'
                                className='hover:bg-color3-50 absolute top-[0.3rem] right-[0.3rem] grid aspect-square h-[2.4rem] cursor-pointer place-items-center rounded-sm'
                                onClick={toggleShowPassword}
                            >
                                {showPassword ? (
                                    <IconEye size={26} className='stroke-color1-100' />
                                ) : (
                                    <IconEyeOff size={26} className='stroke-color1-100' />
                                )}
                            </button>
                        </div>
                    </div>
                    <button
                        type='submit'
                        className='bg-color1-100 text-color3-100 hover:shadow-lg-hard mt-2 min-h-12 cursor-pointer rounded-lg text-xl transition-all duration-150'
                    >
                        Entrar
                    </button>
                    <div className='text-center'>
                        <p className='text-color1-25 mt-1 text-center'>
                            Já tem uma conta?{' '}
                            <Link to='/login' className='text-color1-400 font-bold hover:underline'>
                                Login
                            </Link>
                        </p>
                    </div>
                </form>
            </article>
            <article className='bg-auth hidden md:block'></article> {/** Imagem provisória */}
        </main>
    );
}
