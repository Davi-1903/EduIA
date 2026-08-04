import { IconDots, IconTrash, IconRefresh } from '@tabler/icons-react';
import TituloDaAba from './TituloDaAba';

export default function OutrasOpcoes() {
    return (
        <section className='flex flex-col gap-5 rounded-2xl p-6.25 shadow-lg backdrop-blur-lg'>
            <TituloDaAba
                titulo='Outras Opções'
                Icon={IconDots}
            />
            <div className='flex flex-row items-center gap-2.5 px-4.5'>
                <h3 className="font-['Inter',sans-serif] text-2xl leading-[1.2] font-bold text-[#011F5B]">
                    Notificações por email
                </h3>
                <input
                    className='h-4.5 w-4.5 cursor-pointer rounded-[5px] border-[2.75px] border-[#011F5B] bg-white accent-[#011F5B]'
                    type='checkbox'
                    // checked={notificacoes}
                    // onChange={() => setNotificacoes(!notificacoes)}
                />
            </div>
            <button className='mx-4.5 my-0 flex w-150 cursor-pointer items-center justify-center gap-2.5 rounded-lg border-3 border-[#011F5B] bg-white px-5 py-4 text-[#011F5B] transition hover:bg-[#011F5B] hover:text-white'>
                <IconRefresh
                    size={24}
                    stroke={2}
                />
                <p className="font-['Inter',sans-serif] text-[20px] leading-[1.2]">Redefinir Configurações</p>
            </button>
            <button className='mx-4.5 my-0 flex w-150 cursor-pointer items-center justify-center gap-2.5 rounded-lg border-3 border-[#9f0712] bg-white px-5 py-4 text-[#9f0712] transition hover:bg-[#9f0712] hover:text-white'>
                <IconTrash
                    size={24}
                    stroke={2}
                />
                <p className="font-['Inter',sans-serif] text-[20px] leading-[1.2]">Deletar Conta</p>
            </button>
        </section>
    );
}
