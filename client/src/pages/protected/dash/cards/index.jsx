import {
    IconArrowBigUp,
    IconCards,
    IconChalkboard,
    IconChalkboardTeacher,
    IconFile,
    IconFileDescription,
    IconLaurelWreath1,
    IconListDetails,
    IconListLetters,
    IconReorder,
    IconTimeDuration10,
} from '@tabler/icons-react';
import { cloneElement, memo, useEffect, useState } from 'react';

function Card({ id, title, description, component }) {
    const [open, setOpen] = useState(false);

    function handleClick() {
        if (component) setOpen(true);
    }

    function getIcon(type) {
        const icons = {
            1: <IconListLetters className='stroke-color1-100' />,
            2: <IconListDetails className='stroke-color1-100' />,
            3: <IconTimeDuration10 className='stroke-color1-100' />,
            4: <IconCards className='stroke-color1-100' />,
            5: <IconFileDescription className='stroke-color1-100' />,
            6: <IconChalkboardTeacher className='stroke-color1-100' />,
            7: <IconArrowBigUp className='stroke-color1-100' />,
            8: <IconChalkboard className='stroke-color1-100' />,
            9: <IconReorder className='stroke-color1-100' />,
            10: <IconLaurelWreath1 className='stroke-color1-100' />,
        };
        return icons[type] ?? <IconFile className='stroke-color1-100' />;
    }

    useEffect(() => {
        document.body.style.overflowY = open ? 'hidden' : 'auto';
    }, [open]);

    return (
        <>
            {open && cloneElement(component, { setOpen })}
            <div
                className='flex cursor-pointer items-center gap-4 rounded-lg bg-color4-400 p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg'
                role='button'
                onClick={handleClick}
            >
                <div>{getIcon(id)}</div>
                <div>
                    <h3 className='font-primary text-xl font-semibold text-color1-100'>{title}</h3>
                    <p className='font-secundary text-sm text-color3-200'>{description}</p>
                </div>
            </div>
        </>
    );
}

export default memo(Card);
