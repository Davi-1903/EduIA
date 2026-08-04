import { IconEdit, IconUser } from '@tabler/icons-react';
import TituloDaAba from './TituloDaAba';

import { useAuthenticated } from '../../../../context/authContext';

export default function DadosPessoais() {
    const { user } = useAuthenticated();
    return (
        <div className='flex flex-col gap-5 rounded-2xl p-6.25 shadow-lg backdrop-blur-lg'>
            <TituloDaAba
                titulo='Dados Pessoais'
                Icon={IconUser}
            />

            <div className='flex flex-col gap-2.5'>
                <div className='px-4.5'>
                    <h3 className="font-['Inter',sans-serif] text-2xl leading-[1.2] font-bold text-[#011F5B]">Nome</h3>
                </div>
                <div className='flex flex-row px-11'>
                    <p className="font-['Inter',sans-serif] text-[20px] text-[#011F5B]">
                        {user?.nome ?? 'Carregando...'}
                    </p>
                </div>
            </div>

            <div className='flex flex-col gap-2.5'>
                <div className='px-4.5'>
                    <h3 className="font-['Inter',sans-serif] text-2xl leading-[1.2] font-bold text-[#011F5B]">Email</h3>
                </div>

                <div className='flex flex-row gap-2.5 px-11'>
                    <p className="font-['Inter',sans-serif] text-[20px] text-[#011F5B]">
                        {user?.email ?? 'Carregando...'}
                    </p>
                    <button
                        type='button'
                        className='cursor-pointer'
                    >
                        <IconEdit
                            size={24}
                            className='text-[#011F5B]'
                            stroke={2}
                        />
                    </button>
                </div>
            </div>

            <div className='flex flex-col gap-2.5'>
                <div className='px-4.5'>
                    <h3 className="font-['Inter',sans-serif] text-2xl leading-[1.2] font-bold text-[#011F5B]">Senha</h3>
                </div>

                <div className='flex flex-row gap-2.5 px-11'>
                    <p className="font-['Inter',sans-serif] text-[20px] text-[#011F5B]">*****</p>
                    <button
                        type='button'
                        className='cursor-pointer'
                    >
                        <IconEdit
                            size={24}
                            className='text-[#011F5B]'
                            stroke={2}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}
