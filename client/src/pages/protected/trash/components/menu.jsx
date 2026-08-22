import { useEffect, useRef } from 'react';
import { IconRestore, IconTrash } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useMessages } from '../../../../context/messagesContext';
import { DELETE, PATCH } from '../../../../api/materials';

export default function MenuCard({ x, y, id, setMenu, fetchMaterials }) {
    const { setMessages } = useMessages();
    const menuRef = useRef(null);
    const navigate = useNavigate();

    function handleRestore() {
        if (!confirm('Você tem certeza?')) return;

        setMenu(null);
        PATCH(`/api/materials/${id}/restore`)
            .then(data => {
                if (data.status !== 200) throw new Error(data.message);
                setMessages(prev => [...prev, { id: prev.length + 1, message: 'Arquivo restaurado', type: 'ok' }]);
                navigate('/materials');
            })
            .catch(err =>
                setMessages(prev => [...prev, { id: prev.length + 1, message: err.message, type: 'danger' }]),
            );
    }

    function handleDelete() {
        if (!confirm('Você tem certeza? Essa ação é irreverssível')) return;

        setMenu(null);
        DELETE(`/api/materials/${id}/trash`)
            .then(data => {
                if (data.status !== 200) throw new Error(data.message);
                setMessages(prev => [...prev, { id: prev.length + 1, message: 'Arquivo apagado', type: 'ok' }]);
                fetchMaterials();
            })
            .catch(err =>
                setMessages(prev => [...prev, { id: prev.length + 1, message: err.message, type: 'danger' }]),
            );
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
                onClick={handleRestore}
            >
                <IconRestore className='stroke-color1-100' />
                <span className='font-secundary font-medium text-color1-100'>Restaurar</span>
            </button>
            <hr className='border border-color4-25' />
            <button
                className='flex items-center gap-2 rounded-sm px-2 py-1 hover:bg-color4-100'
                onClick={handleDelete}
            >
                <IconTrash className='stroke-red-800' />
                <span className='font-secundary font-medium text-red-800'>Apagar material</span>
            </button>
        </div>
    );
}
