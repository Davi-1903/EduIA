import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';

export default function Question({ question, answer }) {
    const [open, setOpen] = useState(false);

    function toggleOpen() {
        setOpen(!open);
    }

    return (
        <article className='border-b-color3-400/25 overflow-hidden border-b-2'>
            <div className='flex cursor-pointer items-center justify-between gap-4 p-4' onClick={toggleOpen}>
                <span className='font-primary text-color1-100 text-xl font-semibold text-balance'>{question}</span>
                <IconPlus
                    role='button'
                    size={28}
                    strokeWidth={1.5}
                    className={`bg-color1-100 stroke-color4-100 box-content shrink-0 rounded-full p-1 transition-all duration-150 ${open ? 'rotate-45' : ''}`}
                />
            </div>
            <div className={`grid transition-all duration-150 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className='overflow-hidden p-4 pt-0'>
                    <p className='font-secundary text-color3-100 text-lg/normal'>{answer}</p>
                </div>
            </div>
        </article>
    );
}
