import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { IconMenu3, IconX } from '@tabler/icons-react';
import Logo from '/assets/images/logo.svg';
import clsx from 'clsx';

function Header() {
    const [isOpenMenu, setOpenMenu] = useState(false);
    const [lockScroll, setLockScroll] = useState(false);
    const [dropHeader, setDropHeader] = useState(true);
    const lastY = useRef(null);

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

        function handleScroll() {
            const scrolled = window.scrollY;
            setDropHeader(lastY.current === null || scrolled < lastY.current);
            lastY.current = scrolled;
        }

        window.addEventListener('resize', closeMenu);
        window.addEventListener('keydown', handleEscape);
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('resize', closeMenu);
            window.removeEventListener('keydown', handleEscape);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [closeMenu]);

    useEffect(() => {
        document.body.style.overflowY = lockScroll ? 'hidden' : 'auto';
    }, [lockScroll]);

    return (
        <header
            className={clsx(
                'fixed z-5 h-header w-full bg-color4-400/75 px-4 shadow-lg backdrop-blur-lg transition-all duration-250 sm:px-8',
                dropHeader ? 'top-0' : '-top-(--height-header)',
            )}
        >
            <div className='mx-auto flex h-full max-w-400 items-center justify-between'>
                <Link to='/' className='z-2' onClick={closeMenu} prefetch='intent'>
                    <img src={Logo} alt='Logo EduIA' loading='lazy' className='h-7 sm:h-9' />
                </Link>
                <nav className={isOpenMenu ? 'nav-header' : 'hidden sm:block'}>
                    <ul className='flex items-center gap-8'>
                        <li>
                            <Link
                                to='/sobre'
                                className='font-primary text-sm font-medium text-color1-100'
                                onClick={closeMenu}
                                prefetch='intent'
                            >
                                Sobre
                            </Link>
                        </li>
                        <li>
                            <Link
                                to='/login'
                                className='cursor-pointer rounded-lg border-2 border-color1-100 px-4 py-2 font-primary text-sm font-medium text-color1-100 transition-all duration-150 hover:bg-button hover:text-color4-100'
                                onClick={closeMenu}
                                prefetch='intent'
                            >
                                Login
                            </Link>
                        </li>
                        <li>
                            <Link
                                to='/cadastro'
                                className='cursor-pointer rounded-lg border-2 border-color1-100 bg-button px-4 py-2 font-primary text-sm font-medium text-color4-100 transition-all duration-150 hover:shadow-link'
                                onClick={closeMenu}
                                prefetch='intent'
                            >
                                Cadastro
                            </Link>
                        </li>
                    </ul>
                </nav>
                <button
                    className='z-2 block cursor-pointer rounded-md p-2 hover:bg-color4-50 sm:hidden'
                    onClick={toggleMenu}
                    aria-label='Abrir menu'
                >
                    {isOpenMenu ? (
                        <IconX size={22} className='stroke-color1-100' />
                    ) : (
                        <IconMenu3 size={22} className='stroke-color1-100' />
                    )}
                </button>
            </div>
        </header>
    );
}

export default memo(Header);
