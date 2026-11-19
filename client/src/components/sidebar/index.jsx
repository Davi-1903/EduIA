import { useState } from 'react';
import OpenButton from './components/openbutton';
import SidebarModel from './components/sidebar';

export default function SideBar() {
    const [isOpen, setOpen] = useState(false);

    return (
        <>
            <OpenButton
                isOpen={isOpen}
                setOpen={setOpen}
            />
            <SidebarModel
                isOpen={isOpen}
                setOpen={setOpen}
            />
        </>
    );
}
