import { useEffect, useRef } from 'react';
import { IconFolderOpen, IconTrash } from '@tabler/icons-react';

export default function MenuCard({ x, y, id, setMenu }) {
    const menuRef = useRef(null);

    function handleOpen() {
        setMenu(null);
        alert('Funcionalidade ainda não implementada');
    }

    function handleDelete() {
        setMenu(null);
        alert('Funcionalidade ainda não implementada');
    }

    useEffect(() => {
        function handleClick(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenu(null);
            }
        }

        function handleKey(e) {
            if (e.key === 'Escape') setMenu(null);
        }

        document.addEventListener('mousedown', handleClick);
        document.addEventListener('keydown', handleKey);
        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('keydown', handleKey);
        };
    }, [setMenu]);

    return (
        <div
            ref={menuRef}
            className={'fixed z-8 flex flex-col gap-2 rounded-xl border-color4-25 bg-color4-400 p-2 shadow-lg'}
            style={{
                left: x - Math.max(0, x - window.innerWidth + 200),
                top: y,
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
