import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IconMenu3, IconX } from '@tabler/icons-react';
import Logo from '/logo_dark.svg';

export default function Header() {
    const [isOpenMenu, setOpenMenu] = useState(false);

    function toggleMenu() {
        if (!isOpenMenu) {
            setOpenMenu(true);
            document.body.style.overflowY = 'hidden';
        } else {
            closeMenu();
        }
    }

    const closeMenu = useCallback(() => {
        if (isOpenMenu) {
            setOpenMenu(false);
            document.body.style.overflowY = 'auto';
        }
    }, [isOpenMenu]);

    useEffect(() => {
        function handleEscape(event) {
            if (event.key === 'Escape') closeMenu();
        }

        window.addEventListener('resize', closeMenu);
        window.addEventListener('keydown', handleEscape);
        return () => {
            window.removeEventListener('resize', closeMenu);
            window.removeEventListener('keydown', handleEscape);
        };
    }, [isOpenMenu, closeMenu]);

    return (
        <header className='h-header bg-header sticky top-2 left-2 z-1 mx-auto flex w-[calc(100vw-1rem)] max-w-400 items-center justify-between rounded-2xl px-4 shadow-sm backdrop-blur-sm sm:px-8'>
            <Link to='/' className='z-2'>
                <img src={Logo} alt='Logo EduIA' className='h-5 sm:h-7' />
            </Link>
            <nav className={isOpenMenu ? 'nav-header' : 'hidden sm:block'}>
                <ul className='flex items-center gap-8'>
                    <li>
                        <Link
                            to='/about'
                            className='font-primary text-color1-normal text-md font-medium'
                            onClick={closeMenu}
                        >
                            About
                        </Link>
                    </li>
                    <li>
                        <Link
                            to='/signin'
                            className='font-primary border-color1-normal text-color1-normal hover:bg-color1-normal hover:text-color3-normal text-md cursor-pointer rounded-lg border-2 px-4 py-2 font-medium transition-all duration-150'
                            onClick={closeMenu}
                        >
                            Signin
                        </Link>
                    </li>
                    <li>
                        <Link
                            to='/signup'
                            className='font-primary border-color1-normal text-color3-normal bg-color1-normal hover:shadow-link text-md cursor-pointer rounded-lg border-2 px-4 py-2 font-medium transition-all duration-150'
                            onClick={closeMenu}
                        >
                            Signup
                        </Link>
                    </li>
                </ul>
            </nav>
            <button
                className='hover:bg-color3-dark z-2 block cursor-pointer rounded-md p-2 sm:hidden'
                onClick={toggleMenu}
            >
                {isOpenMenu ? (
                    <IconX size={24} className='stroke-color1-normal' />
                ) : (
                    <IconMenu3 size={24} className='stroke-color1-normal' />
                )}
            </button>
        </header>
    );
}
