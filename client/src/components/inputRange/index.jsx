import { memo } from 'react';

function InputRange({ value, trueValue, setValue, id, min, max, steps = 1, formatValue = null }) {
    function handleFormat(value) {
        if (!formatValue) return value;
        return formatValue(value);
    }

    return (
        <div className='group relative mx-[7px]'>
            <div
                className='absolute -translate-x-1/2 -translate-y-9 rounded-sm bg-color4-400 px-1 pt-[3px] pb-0.5 font-secundary text-base font-medium text-color1-100 opacity-0 shadow-md transition-all duration-150 ease-[cubic-bezier(.65,.37,.55,1.28)] group-hover:opacity-100'
                style={{
                    left: `calc(${((trueValue - min) / (max - min)) * 100}%)`,
                }}
            >
                <span className='text-nowrap'>{handleFormat(value)}</span>
                <div className='absolute -bottom-1 left-1/2 aspect-square w-2 -translate-x-1/2 rotate-45 bg-color4-400'></div>
            </div>
            <input
                type='range'
                id={id}
                value={trueValue}
                onChange={e => setValue(e.target.value)}
                className='input-range'
                step={steps}
                min={min}
                max={max}
            />
        </div>
    );
}

export default memo(InputRange);
