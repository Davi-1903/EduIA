import { IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand } from '@tabler/icons-react';

export default function OpenButton({ setOpen }) {
    return (
        <button
            className='fixed z-2 rounded-br-lg bg-color4-400 p-2 shadow-[0.25rem_0.25rem_0.5rem] shadow-color3-100/20'
            onClick={() => setOpen(true)}
        >
            <div className='absolute top-0 -right-2 aspect-square w-2 bg-color4-400 mask-radial-from-transparent mask-radial-from-2 mask-radial-to-black mask-radial-to-2 mask-radial-at-bottom-right'></div>
            <div className='absolute -bottom-2 left-0 aspect-square w-2 bg-color4-400 mask-radial-from-transparent mask-radial-from-2 mask-radial-to-black mask-radial-to-2 mask-radial-at-bottom-right'></div>
            <IconLayoutSidebarLeftExpand size={30} className='stroke-color1-100' />
        </button>
    );
}
