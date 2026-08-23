import { Helmet } from 'react-helmet-async';
import ProtectedRoute from '../../../components/protectedRoute';
import { useAuthenticated } from '../../../context/authContext';
import { GET } from '../../../api/materials';
import {
    IconArrowBigUp,
    IconCards,
    IconChalkboard,
    IconFileDescription,
    IconLaurelWreath1,
    IconListDetails,
    IconListLetters,
    IconReorder,
    IconTimeDuration10,
    IconUser,
    IconMail,
    IconEyeOff,
    IconLock,
    IconSchool,
    IconChalkboardTeacher,
    IconFileText,
} from '@tabler/icons-react';
import { useState, useEffect } from 'react';

export default function Profile() {
    const { user } = useAuthenticated();
    const [conquistaSelecionada, setConquistaSelecionada] = useState(null);

    const menuItems = [
        { label: 'Resumos', num: 12 },
        { label: 'Questões', num: 9 },
        { label: 'Quiz', num: 3 },
        { label: 'Exercícios', num: 2 },
    ];

    const conquistas = [
        {
            id: 1,
            nome: 'Desafios',
            tipo: 'desafio',
            icone: (
                <IconLaurelWreath1
                    size={60}
                    className='rounded-md bg-amber-400 stroke-color4-200 p-3'
                />
            ),
            skin: '/assets/images/mascote/achievements/skin-flashcard.png',
        },
        {
            id: 2,
            nome: 'Exercícios Guiados',
            tipo: 'exercicio_guiado',
            icone: (
                <IconChalkboardTeacher
                    size={60}
                    className='rounded-md bg-amber-400 stroke-color4-200 p-3'
                />
            ),
            skin: '/assets/images/mascote/achievements/skin-flashcard.png',
        },
        {
            id: 3,
            nome: 'Explicações',
            tipo: 'explicacao',
            icone: (
                <IconChalkboardTeacher
                    size={60}
                    className='rounded-md bg-amber-400 stroke-color4-200 p-3'
                />
            ),
            skin: '/assets/images/mascote/achievements/skin-flashcard.png',
        },
        {
            id: 4,
            nome: 'Flashcards',
            tipo: 'flashcard',
            icone: (
                <IconCards
                    size={60}
                    className='rounded-md bg-amber-400 stroke-color4-100 p-3'
                />
            ),
            skin: '/assets/images/mascote/achievements/skin-flashcard.png',
        },
        {
            id: 5,
            nome: 'Formulários',
            tipo: 'formulario',
            icone: (
                <IconListDetails
                    size={60}
                    className='rounded-md bg-amber-400 stroke-color4-200 p-3'
                />
            ),
            skin: '/assets/images/mascote/achievements/skin-flashcard.png',
        },
        {
            id: 6,
            nome: 'Planos de Aula',
            tipo: 'plano_de_aula',
            icone: (
                <IconChalkboard
                    size={60}
                    className='rounded-md bg-amber-400 stroke-color4-200 p-3'
                />
            ),
            skin: '/assets/images/mascote/achievements/skin-flashcard.png',
        },
        {
            id: 7,
            nome: 'Questões',
            tipo: 'questoes',
            icone: (
                <IconListLetters
                    size={60}
                    className='rounded-md bg-amber-400 stroke-color4-200 p-3'
                />
            ),
            skin: '/assets/images/mascote/achievements/skin-flashcard.png',
        },
        {
            id: 8,
            nome: 'Quiz',
            tipo: 'quiz',
            icone: (
                <IconTimeDuration10
                    size={60}
                    className='rounded-md bg-amber-400 stroke-color4-200 p-3'
                />
            ),
            skin: '/assets/images/mascote/achievements/skin-flashcard.png',
        },
        {
            id: 9,
            nome: 'Resumos',
            tipo: 'resumo',
            icone: (
                <IconFileDescription
                    size={60}
                    className='rounded-md bg-amber-400 stroke-color4-200 p-3'
                />
            ),
            skin: '/assets/images/mascote/achievements/skin-flashcard.png',
        },
        {
            id: 10,
            nome: 'Roteiros',
            tipo: 'roteiro',
            icone: (
                <IconReorder
                    size={60}
                    className='rounded-md bg-amber-400 stroke-color4-200 p-3'
                />
            ),
            skin: '/assets/images/mascote/achievements/skin-flashcard.png',
        },
    ];

    const atividades = [
        { titulo: 'Resumo - Brasil Colônia', data: '12/08/2025' },
        { titulo: 'Resumo - Brasil Colônia', data: '12/08/2025' },
    ];
    const [progresso, setProgresso] = useState({});

    useEffect(() => {
        async function carregarProgresso() {
            const response = await GET('/api/user/progresso');

            console.log('Resposta do progresso:', response);

            setProgresso(response);
        }

        carregarProgresso();
    }, []);

    return (
        <ProtectedRoute isPrivate={true}>
            <Helmet>
                <title>EduIA | Perfil</title>
                <meta
                    name='description'
                    content='Página de perfil'
                />
            </Helmet>
            <main className='flex w-full flex-col gap-15 bg-[linear-gradient(135deg,#e0e9fb_0%,#f4f7ff_100%)] pb-4 pl-6'>
                <div>
                    <h1 className='bg-linear-to-tr from-color1-100 from-45% to-color4-100 bg-clip-text text-4xl leading-tight font-bold text-transparent md:mt-6 md:text-5xl'>
                        Meu perfil
                    </h1>
                    <p className='text-lg text-color3-200'>
                        Gerencie suas informações pessoais, conquistas e atividades da plataforma
                    </p>
                </div>
                <div className='flex flex-col gap-6 md:flex-row'>
                    <div>
                        <div className='flex min-w-[300px] flex-col items-center justify-center rounded-xl bg-white p-6 shadow'>
                            <article className='relative -top-15 left-5 h-22 w-22 rounded-full bg-gray-300 md:static md:top-0 md:left-0 md:h-25 md:w-25'></article>
                            <h2 className='text-md bg-linear-to-tr from-color1-100 from-45% to-color4-100 bg-clip-text leading-tight font-bold text-transparent md:text-2xl'>
                                {user?.nome?.toUpperCase()}
                            </h2>
                            <p className='text-lg text-color3-200'>{user?.email}</p>
                            <div className='intems-center flex gap-1 rounded-xl bg-color1-100 px-3 py-0.5'>
                                {user?.tipo === 'professor' ? (
                                    <IconChalkboardTeacher
                                        size={19}
                                        className='stroke-color4-100'
                                    />
                                ) : (
                                    <IconSchool
                                        size={19}
                                        className='stroke-color4-100'
                                    />
                                )}
                                <p className='font-secundary text-sm text-color4-100'>
                                    {user?.tipo?.charAt(0).toUpperCase() + user?.tipo?.slice(1)}(a)
                                </p>
                            </div>
                            <button
                                type='submit'
                                className='text-md mt-2 min-h-9 cursor-pointer rounded-lg bg-button px-6 text-color4-100 transition-all duration-150 not-disabled:hover:shadow-lg-hard disabled:cursor-not-allowed disabled:opacity-60'
                            >
                                Editar perfil
                            </button>
                            <button
                                type='submit'
                                className='text-md mt-2 min-h-9 cursor-pointer rounded-lg bg-red-700 px-6 text-color4-100 transition-all duration-150 not-disabled:hover:shadow-lg-hard disabled:cursor-not-allowed disabled:opacity-60'
                            >
                                Excluir perfil
                            </button>
                        </div>
                        <div className='mt-6 flex w-full flex-col gap-3 rounded-xl bg-white p-4 shadow'>
                            {menuItems.map(item => (
                                <div
                                    key={item.label}
                                    className='flex items-center justify-between rounded-lg px-3 py-2 hover:bg-color4-100'
                                >
                                    <span className='text-sm font-medium text-color2-200'>{item.label}</span>
                                    <span className='text-sm font-bold text-color1-100'>{item.num}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='flex flex-col gap-6 md:w-2/3'>
                        <div className='mb-4 flex flex-col rounded-xl bg-white p-6 shadow'>
                            <h3 className='mb-3 text-2xl font-bold text-color1-100'>Dados pessoais</h3>
                            <div className='grid grid-cols-2'>
                                <div className='mb-6 flex items-center gap-3'>
                                    <article className='flex h-10 w-10 items-center justify-center rounded-lg bg-[#EDF3FF]'>
                                        <IconUser
                                            size={24}
                                            className='stroke-color1-100'
                                        />
                                    </article>
                                    <article>
                                        <p className='text-sm text-color3-200'>Nome completo</p>
                                        <p className='text-lg'>{user?.nome}</p>
                                    </article>
                                </div>
                                <div className='mb-6 flex items-center gap-3'>
                                    <article className='flex h-10 w-10 items-center justify-center rounded-lg bg-[#EDF3FF]'>
                                        <IconMail
                                            size={24}
                                            className='stroke-color1-100'
                                        />
                                    </article>
                                    <article>
                                        <p className='text-sm text-color3-200'>Email</p>
                                        <p className='text-lg'>{user?.email}</p>
                                    </article>
                                </div>
                                <div className='flex items-center gap-3'>
                                    <article className='flex h-10 w-10 items-center justify-center rounded-lg bg-[#EDF3FF]'>
                                        {user?.tipo === 'professor' ? (
                                            <IconChalkboardTeacher
                                                size={24}
                                                className='stroke-color1-100'
                                            />
                                        ) : (
                                            <IconSchool
                                                size={24}
                                                className='stroke-color1-100'
                                            />
                                        )}
                                    </article>
                                    <article>
                                        <p className='text-sm text-color3-200'>Perfil</p>
                                        <p className='text-lg'>
                                            {user?.tipo?.charAt(0).toUpperCase() + user?.tipo?.slice(1)}(a)
                                        </p>
                                    </article>
                                </div>
                            </div>
                        </div>

                        <div className='rounded-xl bg-white p-6 shadow'>
                            <h3 className='mb-4 text-2xl font-bold text-color1-100'>Conquistas</h3>
                            <div className='flex flex-wrap justify-center gap-10'>
                                {conquistas.map(conquista => {
                                    const desbloqueada = progresso[conquista.tipo];

                                    return (
                                        <article
                                            key={conquista.id}
                                            onClick={() => {
                                                if (desbloqueada) {
                                                    setConquistaSelecionada(conquista);
                                                }
                                            }}
                                            className='flex cursor-pointer flex-col items-center gap-2'
                                        >
                                            <div className='relative'>
                                                {!desbloqueada && (
                                                    <IconLock
                                                        size={60}
                                                        className='rounded-sm bg-gray-300 stroke-gray-600 p-4'
                                                    />
                                                )}
                                                {desbloqueada && conquista.icone}
                                            </div>

                                            <p className='text-md font-secundary font-medium'>{conquista.nome}</p>
                                        </article>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Atividades recentes */}
                        <div className='rounded-xl bg-white p-6 shadow'>
                            <h3 className='mb-4 text-2xl font-bold text-color1-100'>Atividades recentes</h3>
                            <div className='flex flex-col gap-6'>
                                {atividades.map((a, index) => (
                                    <div
                                        key={index}
                                        className='flex items-center gap-3'
                                    >
                                        <article className='flex h-12 w-12 items-center justify-center rounded-lg bg-[#EDF3FF]'>
                                            <IconFileText
                                                size={26}
                                                className='stroke-color1-100'
                                            />
                                        </article>
                                        <div>
                                            <p className='text-color5-100 text-sm'>{a.titulo}</p>
                                            <p className='text-color3-300 text-xs opacity-70'>{a.data}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            {conquistaSelecionada && (
                <div
                    onClick={() => setConquistaSelecionada(null)}
                    className='fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm'
                >
                    <img
                        src={conquistaSelecionada.skin}
                        alt={`Mascote de ${conquistaSelecionada.nome}`}
                        className='w-100'
                    />
                </div>
            )}
        </ProtectedRoute>
    );
}
