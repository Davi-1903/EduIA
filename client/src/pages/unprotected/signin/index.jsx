import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconEye, IconEyeOff, IconMail } from '@tabler/icons-react';

export default function SignIn() {
    // Adicionar responsividade
    const [showPassword, setShowPassword] = useState(false);

    function toggleShowPassword() {
        setShowPassword(!showPassword);
    }

    return (
        <main className='grid min-h-[calc(100vh-var(--height-header))] place-items-center p-4'>
            <form className='bg-color3-200 flex w-sm min-w-80 flex-col gap-4 rounded-3xl p-8 shadow-lg'>
                <h2 className='font-primary text-color1-100 text-center text-[2.5rem]/[50px] font-bold'>Login</h2>
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
                    <Link className='text-color1-100 font-bold hover:underline'>Esqueceu sua senha?</Link>
                    <p className='mt-1 text-center'>
                        Não tem uma conta?{' '}
                        <Link to='/cadastro' className='text-color1-100 font-bold hover:underline'>
                            Cadastro
                        </Link>
                    </p>
                </div>
            </form>
        </main>
    );
}
