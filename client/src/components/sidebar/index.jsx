import { Link } from 'react-router-dom';
import { IconBook2, IconClock, IconLogout, IconSettings, IconUser } from '@tabler/icons-react';
import Logo from '/assets/images/logo.svg';

const links = [
    // {
    //     id: 1,
    //     path: '#',
    //     name: 'Perfil',
    //     icon: <IconUser />,
    // },
    {
        id: 2,
        path: '#',
        name: 'Meus materiais',
        icon: <IconBook2 size={30} className='stroke-color1-100' />,
    },
    {
        id: 3,
        path: '#',
        name: 'Histórico',
        icon: <IconClock size={30} className='stroke-color1-100' />,
    },
    {
        id: 4,
        path: '#',
        name: 'Configurações',
        icon: <IconSettings size={30} className='stroke-color1-100' />,
    },
];

export default function Sidebar() {
    return (
        <div className='sticky top-0 flex h-screen flex-col gap-4 bg-color4-200 p-4 shadow-[0.25rem_0rem_1rem] shadow-color3-100/25'>
            <div>
                <Link to='/'>
                    <img src={Logo} alt='Logo' className='w-10' />
                </Link>
            </div>
            <hr className='w-full rounded-full border border-color3-100/15' />
            <div className='flex-1'>
                <ul>
                    {links.map(link => (
                        <li key={link.id} className='not-last:mb-4'>
                            <a
                                href={link.path}
                                className='grid aspect-square place-items-center rounded-md transition-colors duration-150 hover:bg-color3-100/20'
                                target='_parent'
                            >
                                {link.icon}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <ul>
                    <li>
                        <a
                            href='#'
                            className='mb-4 grid aspect-square place-items-center rounded-md transition-colors duration-150 hover:bg-color3-100/20'
                            target='_parent'
                        >
                            <IconUser size={30} className='stroke-color1-100' />
                        </a>
                    </li>
                    <li>
                        <a
                            href='#'
                            className='grid aspect-square place-items-center rounded-md transition-colors duration-150 hover:bg-color3-100/20'
                            target='_parent'
                        >
                            <IconLogout size={30} className='stroke-red-800' />
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
}
