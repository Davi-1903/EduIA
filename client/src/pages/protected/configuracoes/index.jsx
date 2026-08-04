import { Helmet } from 'react-helmet-async';

import TituloDaPagina from './components/TituloDaPagina';
import DadosPessoais from './components/DadosPessoais';
import OutrasOpcoes from './components/OutrasOpcoes';
import Aparencia from './components/Aparencia';

import ProtectedRoute from '../../../components/protectedRoute';

export default function Configuracoes() {
    return (
        <section className='mt-15 bg-[#E9EEFD] p-8'>
            <div className='flex flex-row justify-between rounded-2xl bg-white shadow-lg backdrop-blur-lg'>
                <div className='flex flex-row items-center'>
                    <Helmet>
                        <title>EduIA | Configurações</title>
                        <meta
                            name='configuracoes'
                            content='Página de configurações'
                        />
                    </Helmet>
                    <div>
                        <main className='flex flex-col gap-6.25 px-8 py-12'>
                            <TituloDaPagina />
                            <div className='relative flex w-fit flex-col gap-5'>
                                <DadosPessoais />
                                <Aparencia />
                                <OutrasOpcoes />
                            </div>
                        </main>
                    </div>
                </div>
                <div className='sticky top-0 flex h-screen flex-1 items-center justify-center'>
                    <img
                        src='/assets/images/mascote/dudu-configuracoes.webp'
                        alt='Mascote do EduIA para configurações'
                        className='mx-auto max-h-100 max-w-100 animate-floating'
                    />
                </div>
            </div>
        </section>
    );
}
