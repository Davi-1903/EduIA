import { IconMoon, IconPalette, IconSun } from '@tabler/icons-react';
import TituloDaAba from './TituloDaAba';

export default function Aparencia() {
    return (
        <section className='flex flex-col gap-5 rounded-2xl p-6.25 shadow-lg backdrop-blur-lg'>
            <TituloDaAba
                titulo='Aparência'
                Icon={IconPalette}
            />
            <div className='flex flex-col gap-2.5'>
                <div className='px-4.5'>
                    <h3 className="font-['Inter',sans-serif] text-2xl leading-[1.2] font-bold text-[#011F5B]">Tema</h3>
                </div>
                <div className='flex flex-row items-center gap-1.5 px-11 text-2xl font-bold text-[#011F5B]'>
                    <IconSun
                        size={24}
                        className='text-[#011F5B]'
                        stroke={2}
                    />
                    <button className='flex h-4.5 w-7 cursor-pointer items-center justify-start rounded-[30px] border-[2.75px] bg-white px-[2.75px]'>
                        <span className='h-[7.75px] w-[7.75px] rounded-[100%] bg-[#011F5B]'></span>
                    </button>
                    <IconMoon
                        size={24}
                        className='text-[#011F5B]'
                        stroke={2}
                    />
                </div>
            </div>
        </section>
    );
}
