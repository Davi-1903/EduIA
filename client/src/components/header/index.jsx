import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IconMenu3, IconX } from '@tabler/icons-react';
import Logo from '/logo_dark.svg';

export default function Header() {
    const [isOpenMenu, setOpenMenu] = useState(false);
    const [lockScroll, setLockScroll] = useState(false);

    function toggleMenu() {
        if (!isOpenMenu) {
            setOpenMenu(true);
            setLockScroll(true);
        } else {
            closeMenu();
        }
    }

    const closeMenu = useCallback(() => {
        if (isOpenMenu) {
            setOpenMenu(false);
            setLockScroll(false);
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
    }, [closeMenu]);

    useEffect(() => {
        document.body.style.overflowY = lockScroll ? 'hidden' : 'auto';
    }, [lockScroll]);

    return (
        <header className='bg-header sticky top-2 left-2 z-1 mx-auto flex h-[60px] w-[calc(100vw-1rem)] max-w-400 items-center justify-between rounded-2xl px-4 shadow-sm backdrop-blur-sm sm:h-20 sm:px-8'>
            <Link to='/' className='z-2'>
                <img src={Logo} alt='Logo EduIA' className='h-4 sm:h-7' />
            </Link>
            <nav className={isOpenMenu ? 'nav-header' : 'hidden sm:block'}>
                <ul className='flex items-center gap-8'>
                    <li>
                        <Link
                            to='/about'
                            className='font-primary text-color1-100 text-md font-medium'
                            onClick={closeMenu}
                        >
                            About
                        </Link>
                    </li>
                    <li>
                        <Link
                            to='/signin'
                            className='font-primary border-color1-100 text-color1-100 hover:bg-color1-100 hover:text-color3-100 text-md cursor-pointer rounded-lg border-2 px-4 py-2 font-medium transition-all duration-150'
                            onClick={closeMenu}
                        >
                            Signin
                        </Link>
                    </li>
                    <li>
                        <Link
                            to='/signup'
                            className='font-primary border-color1-100 text-color3-100 bg-color1-100 hover:shadow-link text-md cursor-pointer rounded-lg border-2 px-4 py-2 font-medium transition-all duration-150'
                            onClick={closeMenu}
                        >
                            Signup
                        </Link>
                    </li>
                </ul>
            </nav>
            <button
                className='hover:bg-color3-50 z-2 block cursor-pointer rounded-md p-2 sm:hidden'
                onClick={toggleMenu}
            >
                {isOpenMenu ? (
                    <IconX size={22} className='stroke-color1-100' />
                ) : (
                    <IconMenu3 size={22} className='stroke-color1-100' />
                )}
            </button>
        </header>
    );
}
