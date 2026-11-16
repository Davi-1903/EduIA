import { memo, useState } from 'react';
import clsx from 'clsx';

function InputRange({ value, trueValue, setValue, id, min, max, steps = 1, formatValue = null, readOnly = false }) {
    const [show, setShow] = useState(false);

    function handleFormat(value) {
        if (!formatValue) return value;
        return formatValue(value);
    }

    function handleChange(event) {
        setShow(true);
        if (!readOnly) setValue(event.target.value);
    }

    return (
        <div className='group relative mx-1.75'>
            <div
                className={clsx(
                    'absolute -translate-x-1/2 -translate-y-9 rounded-sm bg-color4-400 px-1 pt-0.75 pb-0.5 font-secundary text-base font-medium text-color1-100 opacity-0 shadow-md transition-all duration-150 ease-[cubic-bezier(.65,.37,.55,1.28)]',
                    show ? 'opacity-100' : 'group-hover:opacity-100',
                )}
                style={{
                    left: `calc(${window.innerWidth <= 600 && handleFormat(value).length > 8 ? Math.min(Math.max((trueValue - min) / (max - min), 0.08), 0.88) * 100 : ((trueValue - min) / (max - min)) * 100}%)`,
                }}
            >
                <span className='text-nowrap'>{handleFormat(value)}</span>
                <div className='absolute -bottom-1 left-1/2 aspect-square w-2 -translate-x-1/2 rotate-45 bg-color4-400'></div>
            </div>
            <input
                type='range'
                id={id}
                value={trueValue}
                onChange={handleChange}
                onBlur={() => setShow(false)}
                className='input-range'
                style={{
                    backgroundImage: `linear-gradient(to right, var(--base-color1) 0%, var(--color-color1-400) ${((trueValue - min) / (max - min)) * 100}%, var(--color-color4-25) ${((trueValue - min) / (max - min)) * 100}%, var(--color-color4-50) 100%)`,
                }}
                step={steps}
                min={min}
                max={max}
            />
        </div>
    );
}

export default memo(InputRange);
