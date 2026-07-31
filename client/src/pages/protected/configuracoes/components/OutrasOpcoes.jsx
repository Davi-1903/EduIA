import { IconDots } from '@tabler/icons-react';
import TituloDaAba from './TituloDaAba';

export default function OutrasOpcoes() {
    return (
        <section className='outras-configuracoes flex flex-col gap-6.25'>
            <TituloDaAba
                titulo='Outras Opções'
                Icon={IconDots}
            />
            <div className='notificacoes flex flex-row items-center gap-1.5 px-4.5'>
                <h3 className="font-['Inter',sans-serif] text-2xl leading-[1.2] font-bold text-[#051933]">
                    Notificações por email
                </h3>
                <input
                    className='h-4.5 w-4.5 rounded-[5px] border-[2.75px] border-[#051933] bg-white accent-[#051933] cursor-pointer'
                    type='checkbox'
                    // checked={notificacoes}
                    // onChange={() => setNotificacoes(!notificacoes)}
                />
            </div>
            <button className='mx-4.5 my-0 w-fit rounded-lg border-3 border-[#051933] bg-white px-5 py-4 cursor-pointer text-[#051933] hover:bg-[#051933] hover:text-white transition'>
                <p className="font-['Inter',sans-serif] text-[20px] leading-[1.2]">
                    Redefinir Configurações
                </p>
            </button>
            <button className='mx-4.5 my-0 w-fit rounded-lg border-3 border-[#9f0712] bg-white px-5 py-4 cursor-pointer text-[#9f0712] hover:bg-[#9f0712] hover:text-white transition'>
                <p className="font-['Inter',sans-serif] text-[20px] leading-[1.2]">Deletar Conta</p>
            </button>
        </section>
    );
}
