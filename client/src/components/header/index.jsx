import { Link } from 'react-router-dom';
import Logo from '/logo_dark.svg';

export default function Header() { // Deixar responsivo :)
    return (
        <header className='h-header bg-header sticky top-2 left-2 z-1 mx-auto flex w-[calc(100vw-1rem)] max-w-400 items-center justify-between rounded-2xl px-8 shadow-sm backdrop-blur-sm'>
            <Link to='/'>
                <img src={Logo} alt='Logo EduIA' className='h-12 lg:h-16' />
            </Link>
            <nav>
                <ul className='flex items-center gap-8'>
                    <li className='link-header'>
                        <Link to='/about'>About</Link>
                    </li>
                    <li>
                        <Link
                            to='/signin'
                            className='font-primary border-color1 text-color1 hover:bg-color1 hover:text-color3 cursor-pointer rounded-lg border-2 px-4 py-2 text-[1rem] font-medium transition-all duration-150'
                        >
                            Signin
                        </Link>
                    </li>
                    <li>
                        <Link
                            to='/signup'
                            className='font-primary border-color1 text-color3 bg-color1 hover:shadow-link cursor-pointer rounded-lg border-2 px-4 py-2 text-[1rem] font-medium transition-all duration-125'
                        >
                            Signup
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}
