import { Link } from 'react-router-dom';
import { IconUser } from '@tabler/icons-react';
import Logo from '/assets/images/logo.svg';

const links = [
    {
        id: 1,
        path: '#',
        name: 'Perfil',
        icon: <IconUser />,
    },
];

export default function Sidebar() {
    return (
        <div className='sticky top-0 h-screen bg-color4-200 p-4 shadow-[0.25rem_0rem_1rem] shadow-color3-100/25'>
            <div>
                <Link to='/'>
                    <img src={Logo} alt='Logo' className='w-10' />
                </Link>
            </div>
            <hr className='my-4 w-full rounded-full border-2 border-color3-100/15' />
            <div>
                <ul>
                    {links.map(link => (
                        <li key={link.id}>
                            <a href={link.path}>
                                {link.icon}
                                {/* <span>{link.name}</span> */}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
