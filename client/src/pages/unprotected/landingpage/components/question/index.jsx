import { useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import clsx from 'clsx';

export default function Question({ question, answer }) {
    const [open, setOpen] = useState(false);

    function toggleOpen() {
        setOpen(!open);
    }

    return (
        <article className='mb-2 overflow-hidden border-b-2 border-b-color3-400/25 p-4'>
            <div className='flex cursor-pointer items-center justify-between gap-4' onClick={toggleOpen}>
                <span className='font-primary text-xl font-semibold text-balance text-color1-100'>{question}</span>
                <IconPlus
                    role='button'
                    size={28}
                    strokeWidth={1.5}
                    className={clsx(
                        'box-content shrink-0 rounded-full bg-button stroke-color4-100 p-1 transition-all duration-150',
                        open && 'rotate-45',
                    )}
                />
            </div>
            <div
                className={clsx('grid pt-2 transition-all duration-150', open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}
            >
                <div className='overflow-hidden pt-0'>
                    <p className='font-secundary text-lg/normal text-color3-100'>{answer}</p>
                </div>
            </div>
        </article>
    );
}
