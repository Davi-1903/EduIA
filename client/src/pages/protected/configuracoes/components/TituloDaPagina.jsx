import { IconSettings } from '@tabler/icons-react';

export default function TituloDaPagina() {
    return (
        <section className='flex flex-col gap-1.5'>
            <div className='relative flex w-fit items-center justify-between gap-1.5'>
                <h1 className="font-['Inter',sans-serif] text-[42px] leading-[1.2] font-bold text-[#011F5B]">
                    Configurações
                </h1>
                <IconSettings
                    size={48}
                    stroke={2}
                    className='text-[#011F5B]'
                />
            </div>
            <p className="font-['Inter',sans-serif] text-[18px] leading-[1.2] text-[#011F5B]">
                Faça alterações para utilizar o EduIA de acordo com suas preferências!
            </p>
        </section>
    );
}
