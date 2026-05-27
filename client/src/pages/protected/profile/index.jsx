import { Helmet } from 'react-helmet-async';
import ProtectedRoute from '../../../components/protectedRoute';
import { useAuthenticated } from '../../../context/authContext';
import { IconMail, IconSchool, IconChalkboardTeacher } from '@tabler/icons-react';

export default function Profile() {
    const { user } = useAuthenticated();
    return (
        <ProtectedRoute isPrivate={true}>
            <Helmet>
                <title>EduIA | Perfil</title>
                <meta name='description' content='Página de perfil' />
            </Helmet>
            <main className='sm:flex flex-col justify-center items-center gap-15 bg-[linear-gradient(135deg,#e0e9fb_0%,#f4f7ff_100%)]'>
                <div className='flex flex-col md:flex-row md:mt-6 gap-4 w-full md:w-9/10 rounded-3xl md:p-5 md:bg-color4-200'>
                    <div className="bg-color3-200 h-20 p-5 md:hidden"></div>

                    <article className='bg-color4-100 w-22 h-22 rounded-full border-2 border-color2-100 relative left-5 md:static -top-15 md:w-25 md:h-25 md:top-0 md:left-0
                    '></article>
                    <article className='flex justify-between items-center gap-2 relative -top-13 px-3 md:flex-col md:static md:items-start'>
                        <div className='md:flex md:flex-col md:items-start px-6'>
                            <h1 className='font-primary text-xl font-bold text-color2-100'>
                                {user?.nome?.toUpperCase()}
                            </h1>
                            <div className='flex intems-center gap-1 pl-3'>
                                {
                                    user?.tipo === 'professor' ? (
                                        <IconChalkboardTeacher
                                            size={19}
                                            className='stroke-color2-100'
                                        />
                                    ) : (
                                        <IconSchool
                                            size={19}
                                            className='stroke-color2-100'
                                        />
                                    )
                                }
                                <p className='font-secundary opacity-65 text-sm'>
                                    {user?.tipo}
                                </p>
                            </div>
                            <div className='flex intems-center gap-1 pl-3'>
                                <IconMail size={18} className='stroke-color2-100'/>
                                <p className='font-secundary opacity-65 text-sm'>
                                    {user?.email}
                                </p>
                            </div>
                            <span className='bg-color2-100 text-color4-200 px-1.5 py-0.5 text-sm rounded-full text-center mt-1'>
                                Nível intermediário
                            </span>
                        </div>
                        <button className='mt-2 border border-color2-100 bg-color4-200 text-color2-100 rounded-lg text-md py-1.5 px-4 hover:text-color4-200 hover:bg-color2-100 ml-7 md:self-start'>
                            Editar
                        </button>
                    </article>
                </div>

                <div className="w-9/10 ml-8">
                    <h1 className="font-primary mb-4 text-2xl font-semibold text-color2-100">
                        Atividades Recentes
                    </h1>
                    <div className="mt-8  relative py-1 ">
                        <div className="absolute left-[17px] top-0 w-1 h-full bg-gray-300"></div>  
                        <div className="relative pl-8">                      
                            <div className="relative mb-5">
                                <div className="absolute -left-4.5 top-12 w-2.5 h-2.5 bg-color2-200 rounded-full border-2 border-color4-400"></div>
                                <div className="bg-color4-400 p-3 rounded-xl shadow-sm">
                                    <small className="text-xs opacity-60">Hoje</small>
                                    <p className="py-1 text-md font-semibold text-color2-200">
                                    Redes de Computadores
                                    </p>
                                    <small className="text-xs opacity-60">Flashcards</small>
                                </div>
                            </div>

                        </div>
                        <div className="relative pl-8">
                            <div className="relative mb-5">
                            <div className="absolute -left-4.5 top-12 w-2.5 h-2.5 bg-color2-200 rounded-full border-2 border-color4-400"></div>

                            <div className="bg-color4-400 p-3 rounded-xl shadow-sm">
                                <small className="text-xs opacity-60">Hoje</small>
                                <p className="py-1 text-md font-semibold text-color2-200">
                                Redes de Computadores
                                </p>
                                <small className="text-xs opacity-60">Flashcards</small>
                            </div>
                            </div>

                        </div>
                        </div>
                        <button className="block mx-auto mt-4 text-sm font-semibold text-color2-100 hover:bg-color2-200 hover:text-color4-400 px-3 py-2 rounded-lg">
                            Ver mais
                        </button>
                    </div>

        <div className='w-9/10 mb-6 ml-8'>
            <h1 className='font-primary mb-4 text-2xl font-semibold text-color2-100'>Conquistas</h1>

            <div className='flex gap-5 flex-wrap justify-center items-center'>
                <div className='w-40 md:w-60 py-8 text-center bg-color4-400 rounded-tl-xl rounded-br-xl border-b-3 border-b-color1-100 hover:-translate-y-2 transition duration-300'>
                    <p>Quiiz</p>
                </div>
                <div className='w-40 md:w-60 py-8 text-center bg-color4-400 rounded-tl-xl rounded-br-xl border-b-3 border-b-color1-100 hover:-translate-y-2 transition duration-300'>
                    <p>Flashcards</p>
                </div>
                <div className='w-40 md:w-60 py-8 text-center bg-color4-400 rounded-tl-xl rounded-br-xl border-b-3 border-b-color1-100 hover:-translate-y-2 transition duration-300'>
                    <p>Lista de questões</p>
                </div>
                <div className='w-40 md:w-60 py-8 text-center bg-color4-200 rounded-tl-xl rounded-br-xl border-b-3 border-b-color1-100 opacity-50'>
                    <p>Bloqueado</p>
                </div>
            </div>

        </div>
            </main>
        </ProtectedRoute>
    );
}