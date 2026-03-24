import { memo, useEffect, useRef } from 'react';
import {
    IconBook2,
    IconClock,
    IconDashboard,
    IconLayoutSidebarLeftCollapse,
    IconLayoutSidebarLeftExpand,
    IconLogout,
    IconSettings,
    IconUser,
} from '@tabler/icons-react';
import Logo from '/assets/images/logo.svg';
import clsx from 'clsx';
import getCSRF from '../../../api/csrf';
import { useAuthenticated } from '../../../context/authContext';

const links = [
    {
        id: 1,
        path: '/dash',
        name: 'Dashboard',
        icon: <IconDashboard size={28} className='stroke-color1-100' />,
    },
    {
        id: 2,
        path: '#',
        name: 'Meus materiais',
        icon: <IconBook2 size={28} className='stroke-color1-100' />,
    },
    {
        id: 3,
        path: '#',
        name: 'Histórico',
        icon: <IconClock size={28} className='stroke-color1-100' />,
    },
    {
        id: 4,
        path: '#',
        name: 'Configurações',
        icon: <IconSettings size={28} className='stroke-color1-100' />,
    },
];

function SidebarModel({ isOpen, setOpen }) {
    const sidebarRef = useRef(null);
    const { setAuthenticated } = useAuthenticated();

    useEffect(() => {
        const handleClick = event => {
            if (isOpen && !sidebarRef.current?.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [isOpen, setOpen]);

    async function handleLogout(e) {
        e.preventDefault();

        const csrf = await getCSRF();

        const response = await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
            headers: { 'X-CSRFToken': csrf },
        });

        if (response.ok) {
            setAuthenticated(false);
        } else {
            console.error('Erro ao deslogar');
        }
    }

    return (
        <div
            className={clsx(
                'fixed z-3 not-sm:inset-0 sm:static',
                isOpen ? 'pointer-events-auto bg-color3-100/20' : 'not-sm:pointer-events-none',
            )}
        >
            <div
                ref={sidebarRef}
                className={clsx(
                    'sticky top-0 flex h-screen -translate-x-full flex-col gap-4 bg-color4-200 p-4 shadow-[0.25rem_0rem_1rem] shadow-color3-100/25 transition-all duration-500 sm:translate-x-0',
                    isOpen ? 'w-4/5 translate-x-0 sm:w-60' : 'sm:w-18',
                )}
            >
                <div
                    className='group grid aspect-square w-10 place-items-center rounded-sm bg-color3-100/20'
                    role='button'
                    onClick={() => setOpen(!isOpen)}
                >
                    <img src={Logo} alt='Logo' className='w-full group-hover:hidden' />
                    {isOpen ? (
                        <IconLayoutSidebarLeftCollapse
                            size={32}
                            className='hidden stroke-color1-100 group-hover:block'
                        />
                    ) : (
                        <IconLayoutSidebarLeftExpand size={32} className='hidden stroke-color1-100 group-hover:block' />
                    )}
                </div>
                <div className='flex-1'>
                    <ul>
                        {links.map(link => (
                            <li key={link.id} className='not-last:mb-4'>
                                <a
                                    href={link.path}
                                    className='flex items-center gap-2 overflow-x-hidden rounded-md p-1.5 transition-colors duration-150 hover:bg-color3-100/20'
                                    target='_parent'
                                >
                                    <div>{link.icon}</div>
                                    <span className='font-secundary text-nowrap text-color1-100'>{link.name}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                <hr className='w-full rounded-full border border-color3-100/15' />
                <div>
                    <ul>
                        <li>
                            <a
                                href='#'
                                className='mb-4 flex items-center gap-2 overflow-x-hidden rounded-md p-1.5 transition-colors duration-150 hover:bg-color3-100/20'
                                target='_parent'
                            >
                                <div>
                                    <IconUser size={28} className='stroke-color1-100' />
                                </div>
                                <span className='font-secundary text-nowrap text-color1-100'>Perfil</span>
                            </a>
                        </li>
                        <li>
                            <a
                                onClick={handleLogout}
                                href='#'
                                className='flex items-center gap-2 overflow-x-hidden rounded-md p-1.5 transition-colors duration-150 hover:bg-color3-100/20'
                                target='_parent'
                            >
                                <div>
                                    <IconLogout size={28} className='stroke-red-800' />
                                </div>
                                <span className='font-secundary text-nowrap text-red-800'>Sair</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default memo(SidebarModel);
