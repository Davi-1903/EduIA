import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import clsx from 'clsx';

export default function Pagination({ cursor, setCursor, limit, length }) {
    const totalPages = Math.max(1, Math.ceil(length / limit));
    const currentPage = Math.min(Math.max(0, Math.floor(cursor / limit)), totalPages - 1);
    const pageItems = [];
    if (totalPages <= 7) {
        for (let i = 0; i < totalPages; i += 1) pageItems.push(i);
    } else {
        pageItems.push(0);
        const left = Math.max(1, currentPage - 1);
        const right = Math.min(totalPages - 2, currentPage + 1);
        if (left > 1) pageItems.push('left-ellipsis');
        for (let i = left; i <= right; i += 1) pageItems.push(i);
        if (right < totalPages - 2) pageItems.push('right-ellipsis');
        pageItems.push(totalPages - 1);
    }

    function next() {
        if (currentPage + 1 < totalPages) setCursor((currentPage + 1) * limit);
    }

    function previous() {
        if (currentPage > 0) setCursor((currentPage - 1) * limit);
    }

    return (
        <div className='flex w-full items-center justify-center gap-4'>
            <button
                className='rounded-lg p-2 transition-all not-disabled:cursor-pointer not-disabled:hover:bg-color4-25 disabled:opacity-50 disabled:saturate-50'
                onClick={previous}
                disabled={currentPage === 0}
            >
                <IconArrowLeft className='stroke-color2-100' />
            </button>
            {pageItems.map((item, i) =>
                typeof item === 'string' ? (
                    <button
                        key={`${item}-${i}`}
                        disabled
                        className='aspect-square h-10 rounded-lg font-secundary text-lg font-medium text-color2-100 opacity-50'
                    >
                        ...
                    </button>
                ) : (
                    <button
                        key={item}
                        onClick={() => setCursor(item * limit)}
                        disabled={item === currentPage}
                        className={clsx(
                            'aspect-square h-10 cursor-pointer rounded-lg bg-linear-to-br from-color4-100 to-color4-400 font-secundary text-lg font-medium text-color1-400 shadow-lg transition-all disabled:from-color1-400 disabled:to-color1-100 disabled:text-color4-100',
                            item === currentPage && 'scale-110 shadow-lg-hard',
                        )}
                    >
                        {item + 1}
                    </button>
                ),
            )}
            <button
                className='rounded-lg p-2 transition-all not-disabled:cursor-pointer not-disabled:hover:bg-color4-25 disabled:opacity-50 disabled:saturate-50'
                onClick={next}
                disabled={currentPage + 1 >= totalPages}
            >
                <IconArrowRight className='stroke-color2-100' />
            </button>
        </div>
    );
}
