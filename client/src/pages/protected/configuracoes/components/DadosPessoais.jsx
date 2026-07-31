import { IconEdit, IconUser } from '@tabler/icons-react';
import TituloDaAba from './TituloDaAba';

import { useAuthenticated } from '../../../../context/authContext';

export default function DadosPessoais() {
    const { user } = useAuthenticated();
    return (
        <div className='dados-pessoais flex flex-col gap-6.25'>
            <TituloDaAba
                titulo='Dados Pessoais'
                Icon={IconUser}
            />

            <div className='flex flex-col gap-3.25'>
                <div className='px-4.5'>
                    <h3 className="font-['Inter',sans-serif] text-2xl leading-[1.2] font-bold text-[#051933]">Nome</h3>
                </div>
                <div className='flex flex-row px-11 text-2xl font-bold text-[#051933]'>
                    <p>{user?.nome ?? 'Carregando...'}</p>
                </div>
            </div>

            <div className='flex flex-col gap-3.25'>
                <div className='px-4.5'>
                    <h3 className="font-['Inter',sans-serif] text-2xl leading-[1.2] font-bold text-[#051933]">Email</h3>
                </div>

                <div className='flex flex-row px-11 text-2xl font-bold text-[#051933]'>
                    <p>{user?.email ?? 'Carregando...'}</p>
                    <button type='button' className='cursor-pointer'>
                        <IconEdit
                            size={24}
                            className='text-[#051933]'
                            stroke={2}
                        />
                    </button>
                </div>
            </div>

            <div className='flex flex-col gap-3.25'>
                <div className='px-4.5'>
                    <h3 className="font-['Inter',sans-serif] text-2xl leading-[1.2] font-bold text-[#051933]">Senha</h3>
                </div>

                <div className='flex flex-row px-11 text-2xl font-bold text-[#051933]'>
                    <p>*****</p>
                    <button type='button' className='cursor-pointer'>
                        <IconEdit
                            size={24}
                            className='text-[#051933]'
                            stroke={2}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}
