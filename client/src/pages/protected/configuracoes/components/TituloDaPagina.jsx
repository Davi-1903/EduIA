import { IconSettings } from '@tabler/icons-react';

export default function TituloDaPagina() {
    return (
        <section className="relative flex w-fit items-center justify-between gap-1.5 after:absolute after:right-0 after:bottom-0 after:left-0 after:h-0.75 after:bg-[rgba(5,25,51,0.15)] after:content-['']">
            <h1 className="font-['Inter',sans-serif] leading-[1.2] text-5xl font-bold text-[#051933]">Configurações</h1>
            <IconSettings
                size={42}
                stroke={2}
                className='text-[#051933]'
            />
        </section>
    );
}
