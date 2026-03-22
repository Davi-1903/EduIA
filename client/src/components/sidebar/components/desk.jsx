import { useState } from 'react';
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

const links = [
    {
        id: 1,
        path: '#',
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

export default function Sidebar() {
    const [isOpen, setOpen] = useState(false);

    return (
        <div>
            <div
                className={clsx(
                    'sticky top-0 flex h-screen flex-col gap-4 bg-color4-200 p-4 shadow-[0.25rem_0rem_1rem] shadow-color3-100/25 transition-all duration-500',
                    isOpen ? 'w-60' : 'w-18',
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
