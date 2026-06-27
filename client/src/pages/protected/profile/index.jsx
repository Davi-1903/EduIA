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
                <meta
                    name='description'
                    content='Página de perfil'
                />
            </Helmet>
            <main className='flex-col items-center justify-center gap-15 bg-[linear-gradient(135deg,#e0e9fb_0%,#f4f7ff_100%)] sm:flex'>
                <div className='flex w-full flex-col gap-4 rounded-3xl md:mt-6 md:w-9/10 md:flex-row md:bg-color4-200 md:p-5'>
                    <div className='h-20 bg-color3-200 p-5 md:hidden'></div>

                    <article className='relative -top-15 left-5 h-22 w-22 rounded-full border-2 border-color2-100 bg-color4-100 md:static md:top-0 md:left-0 md:h-25 md:w-25'></article>
                    <article className='relative -top-13 flex items-center justify-between gap-2 px-3 md:static md:flex-col md:items-start'>
                        <div className='px-6 md:flex md:flex-col md:items-start'>
                            <h1 className='font-primary text-xl font-bold text-color2-100'>
                                {user?.nome?.toUpperCase()}
                            </h1>
                            <div className='intems-center flex gap-1 pl-3'>
                                {user?.tipo === 'professor' ? (
                                    <IconChalkboardTeacher
                                        size={19}
                                        className='stroke-color2-100'
                                    />
                                ) : (
                                    <IconSchool
                                        size={19}
                                        className='stroke-color2-100'
                                    />
                                )}
                                <p className='font-secundary text-sm opacity-65'>{user?.tipo}</p>
                            </div>
                            <div className='intems-center flex gap-1 pl-3'>
                                <IconMail
                                    size={18}
                                    className='stroke-color2-100'
                                />
                                <p className='font-secundary text-sm opacity-65'>{user?.email}</p>
                            </div>
                            <span className='mt-1 rounded-full bg-color2-100 px-1.5 py-0.5 text-center text-sm text-color4-200'>
                                Nível intermediário
                            </span>
                        </div>
                        <button className='text-md mt-2 ml-7 rounded-lg border border-color2-100 bg-color4-200 px-4 py-1.5 text-color2-100 hover:bg-color2-100 hover:text-color4-200 md:self-start'>
                            Editar
                        </button>
                    </article>
                </div>

                <div className='ml-8 w-9/10'>
                    <h1 className='mb-4 font-primary text-2xl font-semibold text-color2-100'>Atividades Recentes</h1>
                    <div className='relative mt-8 py-1'>
                        <div className='absolute top-0 left-[17px] h-full w-1 bg-gray-300'></div>
                        <div className='relative pl-8'>
                            <div className='relative mb-5'>
                                <div className='absolute top-12 -left-4.5 h-2.5 w-2.5 rounded-full border-2 border-color4-400 bg-color2-200'></div>
                                <div className='rounded-xl bg-color4-400 p-3 shadow-sm'>
                                    <small className='text-xs opacity-60'>Hoje</small>
                                    <p className='text-md py-1 font-semibold text-color2-200'>Redes de Computadores</p>
                                    <small className='text-xs opacity-60'>Flashcards</small>
                                </div>
                            </div>
                        </div>
                        <div className='relative pl-8'>
                            <div className='relative mb-5'>
                                <div className='absolute top-12 -left-4.5 h-2.5 w-2.5 rounded-full border-2 border-color4-400 bg-color2-200'></div>

                                <div className='rounded-xl bg-color4-400 p-3 shadow-sm'>
                                    <small className='text-xs opacity-60'>Hoje</small>
                                    <p className='text-md py-1 font-semibold text-color2-200'>Redes de Computadores</p>
                                    <small className='text-xs opacity-60'>Flashcards</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className='mx-auto mt-4 block rounded-lg px-3 py-2 text-sm font-semibold text-color2-100 hover:bg-color2-200 hover:text-color4-400'>
                        Ver mais
                    </button>
                </div>

                <div className='mb-6 ml-8 w-9/10'>
                    <h1 className='mb-4 font-primary text-2xl font-semibold text-color2-100'>Conquistas</h1>

                    <div className='flex flex-wrap items-center justify-center gap-5'>
                        <div className='w-40 rounded-tl-xl rounded-br-xl border-b-3 border-b-color1-100 bg-color4-400 py-8 text-center transition duration-300 hover:-translate-y-2 md:w-60'>
                            <p>Quiiz</p>
                        </div>
                        <div className='w-40 rounded-tl-xl rounded-br-xl border-b-3 border-b-color1-100 bg-color4-400 py-8 text-center transition duration-300 hover:-translate-y-2 md:w-60'>
                            <p>Flashcards</p>
                        </div>
                        <div className='w-40 rounded-tl-xl rounded-br-xl border-b-3 border-b-color1-100 bg-color4-400 py-8 text-center transition duration-300 hover:-translate-y-2 md:w-60'>
                            <p>Lista de questões</p>
                        </div>
                        <div className='w-40 rounded-tl-xl rounded-br-xl border-b-3 border-b-color1-100 bg-color4-200 py-8 text-center opacity-50 md:w-60'>
                            <p>Bloqueado</p>
                        </div>
                    </div>
                </div>
            </main>
        </ProtectedRoute>
    );
}
