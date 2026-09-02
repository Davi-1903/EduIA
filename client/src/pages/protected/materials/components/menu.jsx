import { useEffect, useRef } from 'react';
import { IconFolderOpen, IconTrash } from '@tabler/icons-react';

export default function MenuCard({ x, y, setMenu, handleOpen, handleDelete }) {
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClick(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenu(null);
            }
        }

        function handleKey(event) {
            if (event.key === 'Escape') setMenu(null);
        }

        document.addEventListener('mousedown', handleClick);
        document.addEventListener('keydown', handleKey);
        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('keydown', handleKey);
        };
    }, [setMenu]);

    const estimatedMenuHeight = 110;

    return (
        <div
            ref={menuRef}
            className={'fixed z-8 flex flex-col gap-2 rounded-xl border-color4-25 bg-color4-400 p-2 shadow-lg'}
            style={{
                left: x - Math.max(0, x - window.innerWidth + 200),
                top: y - Math.max(0, y - window.innerHeight + estimatedMenuHeight),
            }}
        >
            <button
                className='flex items-center gap-2 rounded-sm px-2 py-1 hover:bg-color4-100'
                onClick={handleOpen}
            >
                <IconFolderOpen className='stroke-color1-100' />
                <span className='font-secundary font-medium text-color1-100'>Abrir</span>
            </button>
            <hr className='border border-color4-25' />
            <button
                className='flex items-center gap-2 rounded-sm px-2 py-1 hover:bg-color4-100'
                onClick={handleDelete}
            >
                <IconTrash className='stroke-red-800' />
                <span className='font-secundary font-medium text-red-800'>Mover para lixeira</span>
            </button>
        </div>
    );
}
