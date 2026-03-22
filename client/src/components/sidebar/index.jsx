import { useEffect, useState } from 'react';
import OpenButton from './components/openbutton';
import SidebarModel from './components/sidebar';

export default function SideBar() {
    const [isOpen, setOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setOpen(false);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <OpenButton isOpen={isOpen} setOpen={setOpen} />
            <SidebarModel isOpen={isOpen} setOpen={setOpen} />
        </>
    );
}
