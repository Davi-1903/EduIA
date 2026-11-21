import { Helmet } from 'react-helmet-async';
import ProtectedRoute from '../../../components/protectedRoute';
import { useAuthenticated } from '../../../context/authContext';
import { GET } from '../../../api/materials';
import {
    IconUser,
    IconMail,
    IconSchool,
    IconChalkboardTeacher,
    IconId,
    IconMapPin,
    IconCalendar,
    IconLaurelWreath1,
    IconArrowBigUp,
    IconCards,
    IconListDetails,
    IconChalkboard,
    IconListLetters,
    IconTimeDuration10,
    IconFileDescription,
    IconReorder,
} from '@tabler/icons-react';
import { useState, useEffect } from 'react';

export default function Profile() {
    const { user } = useAuthenticated();
    const [conquistaSelecionada, setConquistaSelecionada] = useState(null);

    const conquistas = [
        {
            id: 1,
            nome: 'Desafios',
            tipo: 'desafio',
            icone: <IconLaurelWreath1 size={34} className='stroke-color1-100' />,
            skin: '/assets/images/mascote/achievements/skin_desafios.png',
            animacao: '/assets/images/mascotes_animados/desafios.webm',
        },
        {
            id: 2,
            nome: 'Exercícios Guiados',
            tipo: 'exercicio_guiado',
            icone: <IconArrowBigUp size={34} className='stroke-color1-100' />,
            skin: '/assets/images/mascote/achievements/skin_exercicios_guiados.png',
            animacao: '/assets/images/mascotes_animados/exercicio_guiado.webm',
        },
        {
            id: 3,
            nome: 'Explicações',
            tipo: 'explicacoes',
            icone: <IconChalkboardTeacher size={34} className='stroke-color1-100' />,
            skin: '/assets/images/mascote/achievements/skin_explicacoes.png',
            animacao: '/assets/images/mascotes_animados/explicacao.webm',
        },
        {
            id: 4,
            nome: 'Flashcards',
            tipo: 'flashcards',
            icone: <IconCards size={34} className='stroke-color1-100' />,
            skin: '/assets/images/mascote/achievements/skin_flashcards.png',
            animacao: '/assets/images/mascotes_animados/flashcard.webm',
        },
        {
            id: 5,
            nome: 'Formulários',
            tipo: 'formulario',
            icone: <IconListDetails size={34} className='stroke-color1-100' />,
            skin: '/assets/images/mascote/achievements/skin_formulario.png',
            animacao: '/assets/images/mascotes_animados/formulario.webm',
        },
        {
            id: 6,
            nome: 'Planos de Aula',
            tipo: 'plano_de_aula',
            icone: <IconChalkboard size={34} className='stroke-color1-100' />,
            skin: '/assets/images/mascote/achievements/skin_plano_de_aula.png',
            animacao: '/assets/images/mascotes_animados/plano_de_aula.webm',
        },
        {
            id: 7,
            nome: 'Questões',
            tipo: 'questoes',
            icone: <IconListLetters size={34} className='stroke-color1-100' />,
            skin: '/assets/images/mascote/achievements/skin_questoes.png',
            animacao: '/assets/images/mascotes_animados/questao.webm',
        },
        {
            id: 8,
            nome: 'Quiz',
            tipo: 'quiz',
            icone: <IconTimeDuration10 size={34} className='stroke-color1-100' />,
            skin: '/assets/images/mascote/achievements/skin_quiz.png',
            animacao: '/assets/images/mascotes_animados/quiz.webm',
        },
        {
            id: 9,
            nome: 'Resumos',
            tipo: 'resumo',
            icone: <IconFileDescription size={34} className='stroke-color1-100' />,
            skin: '/assets/images/mascote/achievements/skin_resumos.png',
            animacao: '/assets/images/mascotes_animados/resumo.webm',
        },
        {
            id: 10,
            nome: 'Roteiros',
            tipo: 'roteiro',
            icone: <IconReorder size={34} className='stroke-color1-100' />,
            skin: '/assets/images/mascote/achievements/skin_roteiros.png',
            animacao: '/assets/images/mascotes_animados/roteiro.webm',
        },
    ];

    const atividades = user?.atividades || [];
    const [progresso, setProgresso] = useState({});

    function getAchievementsByUserType(type) {
        const achievements = conquistas.filter(
            achievement =>
                !(type === 'professor' ? ['flashcards', 'roteiro'] : ['formulario', 'plano_de_aula']).includes(
                    achievement.tipo,
                ),
        );
        return achievements;
    }

    useEffect(() => {
        async function carregarProgresso() {
            const response = await GET('/api/user/progresso');
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
                        <div className='flex min-w-75 flex-col items-center justify-center rounded-xl bg-white p-6 shadow'>
                            <img
                                src={user?.foto}
                                className='relative -top-15 left-5 h-22 w-22 rounded-full md:static md:top-0 md:left-0 md:h-25 md:w-25'
                                alt='Foto do usuário'
                            />
                            <h2 className='text-md bg-linear-to-tr from-color1-100 from-45% to-color4-100 bg-clip-text leading-tight font-bold text-transparent md:text-2xl'>
                                {user?.nome?.toUpperCase()}
                            </h2>
                            <p className='text-lg text-color3-200'>{user?.email_escolar}</p>
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
                                className='text-md mt-2 min-h-9 cursor-pointer rounded-lg bg-red-700 px-6 text-color4-100 transition-all duration-150 not-disabled:hover:shadow-lg-hard disabled:cursor-not-allowed disabled:opacity-60'
                            >
                                Excluir perfil
                            </button>
                        </div>
                        <div className='mt-6 flex w-full flex-col gap-3 rounded-xl bg-white p-4 shadow'>
                            {Object.entries(user?.materiais || {}).map(([tipo, quantidade]) => (
                                <div
                                    key={tipo}
                                    className='flex items-center justify-between rounded-lg px-3 py-2 hover:bg-color4-100'
                                >
                                    <span className='text-sm font-medium text-color2-200 capitalize'>
                                        {tipo}
                                    </span>

                                    <span className='text-sm font-bold text-color1-100'>
                                        {quantidade}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='flex flex-col gap-6 md:w-2/3'>
                        <div className='mb-4 flex flex-col rounded-xl bg-white p-6 shadow'>
                            <h3 className='mb-3 text-2xl font-bold text-color1-100'>Dados pessoais</h3>
                            <div className='grid grid-cols-2'>
                                <div className='mb-6 flex items-center gap-3'>
                                    <article className='flex h-11 w-11 items-center justify-center rounded-lg bg-[#EDF3FF]'>
                                        <IconUser
                                            size={28}
                                            className='stroke-color1-100'
                                        />
                                    </article>
                                    <article>
                                        <p className='text-md text-color3-200'>Nome completo</p>
                                        <p className='text-lg'>{user?.nome}</p>
                                    </article>
                                </div>
                                <div className='mb-6 flex items-center gap-3'>
                                    <article className='flex h-11 w-11 items-center justify-center rounded-lg bg-[#EDF3FF]'>
                                        <IconMail
                                            size={28}
                                            className='stroke-color1-100'
                                        />
                                    </article>
                                    <article>
                                        <p className='text-md text-color3-200'>Email escolar</p>
                                        <p className='text-lg'>{user?.email_escolar}</p>
                                    </article>
                                </div>
                                <div className='mb-6 flex items-center gap-3'>
                                    <article className='flex h-11 w-11 items-center justify-center rounded-lg bg-[#EDF3FF]'>
                                        {user?.tipo === 'professor' ? (
                                            <IconChalkboardTeacher
                                                size={24}
                                                className='stroke-color1-100'
                                            />
                                        ) : (
                                            <IconSchool
                                                size={28}
                                                className='stroke-color1-100'
                                            />
                                        )}
                                    </article>
                                    <article>
                                        <p className='text-md text-color3-200'>Perfil</p>
                                        <p className='text-lg'>
                                            {user?.tipo?.charAt(0).toUpperCase() + user?.tipo?.slice(1)}(a)
                                        </p>
                                    </article>
                                </div>
                                <div className='mb-6 flex items-center gap-3'>
                                    <article className='flex h-11 w-11 items-center justify-center rounded-lg bg-[#EDF3FF]'>
                                        <IconMail
                                            size={28}
                                            className='stroke-color1-100'
                                        />
                                    </article>
                                    <article>
                                        <p className='text-md text-color3-200'>Email acadêmico</p>
                                        <p className='text-lg'>{user?.email_academico}</p>
                                    </article>
                                </div>
                                <div className='mb-6 flex items-center gap-3'>
                                    <article className='flex h-11 w-11 items-center justify-center rounded-lg bg-[#EDF3FF]'>
                                        <IconId
                                            size={28}
                                            className='stroke-color1-100'
                                        />
                                    </article>
                                    <article>
                                        <p className='text-md text-color3-200'>Matrícula</p>
                                        <p className='text-lg'>{user?.matricula}</p>
                                    </article>
                                </div>
                                <div className='mb-6 flex items-center gap-3'>
                                    <article className='flex h-11 w-11 items-center justify-center rounded-lg bg-[#EDF3FF]'>
                                        <IconMapPin
                                            size={28}
                                            className='stroke-color1-100'
                                        />
                                    </article>
                                    <article>
                                        <p className='text-md text-color3-200'>Campus</p>
                                        <p className='text-lg'>{user?.campus}</p>
                                    </article>
                                </div>
                                <div className='flex items-center gap-3'>
                                    <article className='flex h-11 w-11 items-center justify-center rounded-lg bg-[#EDF3FF]'>
                                        <IconCalendar
                                            size={28}
                                            className='stroke-color1-100'
                                        />
                                    </article>
                                    <article>
                                        <p className='text-md text-color3-200'>Data de nascimento</p>
                                        <p className='text-lg'>{user?.nascimento?.split('-').reverse().join('/')}</p>
                                    </article>
                                </div>
                            </div>
                        </div>

                        <div className='rounded-xl bg-white p-6 shadow'>
                            <h3 className='mb-4 text-2xl font-bold text-color1-100'>Conquistas</h3>
                            <div className='flex flex-wrap justify-center gap-10'>
                                {getAchievementsByUserType(user?.tipo).map(conquista => {
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
                                                    <img
                                                        src='/assets/images/mascote/achievements/skin_bloqueado.png'
                                                        alt='Conquista bloqueada'
                                                        className='h-25 w-25 rounded-md object-contain p-1'
                                                    />
                                                )}
                                                {desbloqueada && (
                                                    <img
                                                        src={conquista.skin}
                                                        alt={`Mascote de ${conquista.nome}`}
                                                        className='h-25 w-25 rounded-m object-contain p-1'
                                                    />
                                                )}
                                            </div>

                                            <p className='text-xl font-secundary font-medium text-color1-100'>{conquista.nome}</p>
                                        </article>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Atividades recentes */}
                        <div className='rounded-xl bg-white p-6 shadow'>
                            <h3 className='mb-4 text-2xl font-bold text-color1-100'>Atividades recentes</h3>
                            <div className='flex flex-col gap-6'>
                                {atividades.length === 0 && (
                                    <p className='text-sm text-color3-200'>Você ainda não gerou nenhum material.</p>
                                )}

                                {atividades.map(a => {
                                    const conquista = conquistas.find(c => c.tipo === a.tipo);

                                    return (
                                        <div
                                            key={a.id}
                                            className='flex items-center gap-3'
                                        >
                                            <article className='flex h-16 w-16 items-center justify-center rounded-lg bg-[#EDF3FF]'>
                                                {conquista?.icone}
                                            </article>
                                            <div>
                                                <p className='text-color5-100 text-xl font-medium'>
                                                    {conquista?.nome}
                                                    {a.assunto ? ` - ${a.assunto}` : ''}
                                                </p>
                                                <p className='text-color3-300 text-sm opacity-70'>
                                                    {new Date(a.data).toLocaleDateString('pt-BR')}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
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
                    <video
                        key={conquistaSelecionada.id}
                        src={conquistaSelecionada.animacao}
                        className='w-100'
                        autoPlay
                        muted
                        playsInline
                    />
                </div>
            )}
        </ProtectedRoute>
    );
}