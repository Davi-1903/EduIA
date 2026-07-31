import { IconMoon, IconPalette, IconSun } from '@tabler/icons-react';
import TituloDaAba from './TituloDaAba';

export default function Aparencia() {
    return (
        <section className='flex flex-col gap-6.25'>
            <TituloDaAba
                titulo='Aparência' 
                Icon={IconPalette}
            />
            <div className='flex flex-col gap-3.25'>
                <div className='px-4.5'>
                    <h3 className="font-['Inter',sans-serif] text-2xl leading-[1.2] font-bold text-[#051933]">Tema</h3>
                </div>
                <div className='flex items-center gap-1.5 flex-row px-11 text-2xl font-bold text-[#051933]'>
                    <IconSun
                        size={24}
                        className='text-[#051933]'
                        stroke={2}
                    />
                    <button
                        className='flex items-center px-[2.75px] justify-start border-[2.75px] w-7 h-4.5 rounded-[30px] bg-white cursor-pointer'
                    >
                        <span className='h-[7.75px] w-[7.75px] bg-[#051933] rounded-[100%]'></span>
                    </button>
                    <IconMoon
                        size={24}
                        className='text-[#051933]'
                        stroke={2}
                    />
                </div>
            </div>
        </section>
    );
}
