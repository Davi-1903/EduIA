import { Helmet } from 'react-helmet-async';
import ProtectedRoute from '../../../components/protectedRoute';
import { useAuthenticated } from '../../../context/authContext';
import { GET, DELETE } from '../../../api/materials';
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

// Classes reutilizadas nos itens de "Dados pessoais"
const itemClass = 'flex items-center gap-3 py-3 md:mr-10 md:mb-2 md:py-4';
const itemBorderClass = 'border-b border-color4-100';
const iconBoxClass = 'flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#EDF3FF]';
const itemLabelClass = 'text-base text-color3-200';
const itemValueClass = 'text-base break-words md:text-lg';

export default function Profile() {
    const { user } = useAuthenticated();
    const [conquistaSelecionada, setConquistaSelecionada] = useState(null);
    const materialsType = {
        desafio: 'Desafio',
        exercicio_guiado: 'Exercício guiado',
        explicacoes: 'Explicações',
        flashcards: 'Flashcards',
        formulario: 'Formulário',
        plano_de_aula: 'Plano de aula',
        questoes: 'Questões',
        quiz: 'Quiz',
        resumo: 'Resumo',
        roteiro: 'Roteiro de estudo',
    };
    const conquistas = [
        {
            id: 1,
            nome: 'Desafios',
            tipo: 'desafio',
            icone: (
                <IconLaurelWreath1
                    size={34}
                    className='stroke-color1-100'
                />
            ),
            skin: '/assets/images/mascote/achievements/skin_desafios.png',
            animacao: '/assets/images/mascotes_animados/desafios.webm',
        },
        {
            id: 2,
            nome: 'Exercícios Guiados',
            tipo: 'exercicio_guiado',
            icone: (
                <IconArrowBigUp
                    size={34}
                    className='stroke-color1-100'
                />
            ),
            skin: '/assets/images/mascote/achievements/skin_exercicios_guiados.png',
            animacao: '/assets/images/mascotes_animados/exercicio_guiado.webm',
        },
        {
            id: 3,
            nome: 'Explicações',
            tipo: 'explicacoes',
            icone: (
                <IconChalkboardTeacher
                    size={34}
                    className='stroke-color1-100'
                />
            ),
            skin: '/assets/images/mascote/achievements/skin_explicacoes.png',
            animacao: '/assets/images/mascotes_animados/explicacao.webm',
        },
        {
            id: 4,
            nome: 'Flashcards',
            tipo: 'flashcards',
            icone: (
                <IconCards
                    size={34}
                    className='stroke-color1-100'
                />
            ),
            skin: '/assets/images/mascote/achievements/skin_flashcards.png',
            animacao: '/assets/images/mascotes_animados/flashcard.webm',
        },
        {
            id: 5,
            nome: 'Formulários',
            tipo: 'formulario',
            icone: (
                <IconListDetails
                    size={34}
                    className='stroke-color1-100'
                />
            ),
            skin: '/assets/images/mascote/achievements/skin_formulario.png',
            animacao: '/assets/images/mascotes_animados/formulario.webm',
        },
        {
            id: 6,
            nome: 'Planos de Aula',
            tipo: 'plano_de_aula',
            icone: (
                <IconChalkboard
                    size={34}
                    className='stroke-color1-100'
                />
            ),
            skin: '/assets/images/mascote/achievements/skin_plano_de_aula.png',
            animacao: '/assets/images/mascotes_animados/plano_de_aula.webm',
        },
        {
            id: 7,
            nome: 'Questões',
            tipo: 'questoes',
            icone: (
                <IconListLetters
                    size={34}
                    className='stroke-color1-100'
                />
            ),
            skin: '/assets/images/mascote/achievements/skin_questoes.png',
            animacao: '/assets/images/mascotes_animados/questao.webm',
        },
        {
            id: 8,
            nome: 'Quiz',
            tipo: 'quiz',
            icone: (
                <IconTimeDuration10
                    size={34}
                    className='stroke-color1-100'
                />
            ),
            skin: '/assets/images/mascote/achievements/skin_quiz.png',
            animacao: '/assets/images/mascotes_animados/quiz.webm',
        },
        {
            id: 9,
            nome: 'Resumos',
            tipo: 'resumo',
            icone: (
                <IconFileDescription
                    size={34}
                    className='stroke-color1-100'
                />
            ),
            skin: '/assets/images/mascote/achievements/skin_resumos.png',
            animacao: '/assets/images/mascotes_animados/resumo.webm',
        },
        {
            id: 10,
            nome: 'Roteiros',
            tipo: 'roteiro',
            icone: (
                <IconReorder
                    size={34}
                    className='stroke-color1-100'
                />
            ),
            skin: '/assets/images/mascote/achievements/skin_roteiros.png',
            animacao: '/assets/images/mascotes_animados/roteiro.webm',
        },
    ];

    const [progresso, setProgresso] = useState({});
    const [materiais, setMateriais] = useState({});

    function getAchievementsByUserType(type) {
        const achievements = conquistas.filter(
            achievement =>
                !(type === 'professor' ? ['flashcards', 'roteiro'] : ['formulario', 'plano_de_aula']).includes(
                    achievement.tipo,
                ),
        );
        return achievements;
    }

    const conquistasDoUsuario = getAchievementsByUserType(user?.tipo);
    const totalDesbloqueadas = conquistasDoUsuario.filter(c => progresso[c.tipo]).length;
    const porcentagem = conquistasDoUsuario.length ? (totalDesbloqueadas / conquistasDoUsuario.length) * 100 : 0;

    useEffect(() => {
        async function carregarDados() {
            const [progressoRes, userRes] = await Promise.all([GET('/api/user/progresso'), GET('/api/user')]);
            setProgresso(progressoRes);
            setMateriais(userRes?.user?.materiais || {});
        }

        carregarDados();
    }, []);

    const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
    const [excluindo, setExcluindo] = useState(false);
    const [erroExclusao, setErroExclusao] = useState('');
    async function excluirPerfil() {
        setExcluindo(true);
        setErroExclusao('');
        try {
            const data = await DELETE('/api/user');

            if (!data.ok) {
                throw new Error(data.message || 'Não foi possível excluir o perfil');
            }
            window.location.href = '/';
        } catch (error) {
            setErroExclusao(error.message);
            setExcluindo(false);
        }
    }

    return (
        <ProtectedRoute isPrivate={true}>
            <Helmet>
                <title>EduIA | Perfil</title>
                <meta
                    name='description'
                    content='Página de perfil'
                />
            </Helmet>
            <main className='flex w-full min-w-0 flex-col gap-8 bg-color4-200 px-4 pt-4 pb-6 md:gap-15 md:pt-0 md:pr-4 md:pb-4 md:pl-6'>
                <div>
                    <h1 className='mt-12 bg-linear-to-tr from-color1-100 to-color4-100 bg-clip-text text-3xl leading-tight font-bold text-transparent sm:text-4xl md:mt-6 md:text-5xl'>
                        Meu perfil
                    </h1>
                </div>
                <div className='itens-center flex flex-wrap justify-center gap-6'>
                    <div className='mt-10 max-w-140 min-w-0 grow basis-90 md:mt-0 md:max-w-130 xl:max-w-110'>
                        <div className='flex h-60 w-full flex-col items-center justify-center rounded-xl bg-white p-4 shadow sm:p-6 md:h-80'>
                            <img
                                src={user?.foto}
                                className='relative -top-13 h-24 w-24 rounded-full border-3 border-color1-100 object-cover md:static md:top-0 md:left-0 md:h-26 md:w-26'
                                alt='Foto do usuário'
                            />
                            <h2 className='relative -top-12 bg-linear-to-tr from-color1-100 from-45% to-color4-100 bg-clip-text text-center text-xl leading-tight font-bold text-transparent sm:text-2xl md:top-0'>
                                {user?.nome?.toUpperCase()}
                            </h2>
                            <p className='relative -top-12 mb-1 text-center text-base break-all text-color3-200 md:top-0 md:text-lg'>
                                {user?.email_escolar}
                            </p>
                            <div className='relative -top-10 flex items-center gap-1 rounded-md bg-[#EEF2FB] px-4 py-1.5 md:top-0'>
                                {user?.tipo === 'professor' ? (
                                    <IconChalkboardTeacher
                                        size={19}
                                        className='stroke-color1-100'
                                    />
                                ) : (
                                    <IconSchool
                                        size={19}
                                        className='stroke-color1-100'
                                    />
                                )}
                                <p className='font-secundary text-sm font-medium text-color1-100'>
                                    {user?.tipo?.charAt(0).toUpperCase() + user?.tipo?.slice(1)}(a)
                                </p>
                            </div>
                            <button
                                type='button'
                                onClick={() => setConfirmandoExclusao(true)}
                                className='relative -top-10 mt-3 min-h-10 w-full cursor-pointer rounded-lg bg-red-700 px-6 text-base text-color4-100 transition-all duration-150 not-disabled:hover:shadow-lg not-disabled:hover:shadow-red-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto md:top-0'
                            >
                                Excluir perfil
                            </button>
                        </div>
                        {Object.keys(materiais).length > 0 && (
                            <div className='mt-6 flex w-full flex-col gap-3 rounded-xl bg-white p-4 shadow'>
                                {Object.entries(materiais).map(([tipo, quantidade]) => (
                                    <div
                                        key={tipo}
                                        className='flex items-center justify-between rounded-lg px-3 py-2 hover:bg-color4-100'
                                    >
                                        <span className='text-sm font-medium text-color2-200'>
                                            {materialsType[tipo]}
                                        </span>
                                        <span className='text-sm font-bold text-color1-100'>{quantidade}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className='flex max-w-140 min-w-0 grow-2 basis-lg flex-col gap-4 md:max-w-170 xl:max-w-400'>
                        <div className='flex flex-col rounded-xl bg-white p-4 shadow sm:p-6 md:mb-4'>
                            <h3 className='mb-4 text-2xl font-bold text-color1-100 md:mb-6 md:text-3xl'>
                                Dados pessoais
                            </h3>
                            <div className='grid grid-cols-1 md:grid-cols-2'>
                                <div className={`${itemClass} ${itemBorderClass}`}>
                                    <article className={iconBoxClass}>
                                        <IconUser
                                            size={28}
                                            className='stroke-color1-100'
                                        />
                                    </article>
                                    <article className='min-w-0'>
                                        <p className={itemLabelClass}>Nome completo</p>
                                        <p className={itemValueClass}>{user?.nome}</p>
                                    </article>
                                </div>
                                <div className={`${itemClass} ${itemBorderClass}`}>
                                    <article className={iconBoxClass}>
                                        <IconMail
                                            size={28}
                                            className='stroke-color1-100'
                                        />
                                    </article>
                                    <article className='min-w-0'>
                                        <p className={itemLabelClass}>Email escolar</p>
                                        <p className={itemValueClass}>{user?.email_escolar}</p>
                                    </article>
                                </div>
                                <div className={`${itemClass} ${itemBorderClass}`}>
                                    <article className={iconBoxClass}>
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
                                    <article className='min-w-0'>
                                        <p className={itemLabelClass}>Perfil</p>
                                        <p className={itemValueClass}>
                                            {user?.tipo?.charAt(0).toUpperCase() + user?.tipo?.slice(1)}(a)
                                        </p>
                                    </article>
                                </div>
                                <div className={`${itemClass} ${itemBorderClass}`}>
                                    <article className={iconBoxClass}>
                                        <IconMail
                                            size={28}
                                            className='stroke-color1-100'
                                        />
                                    </article>
                                    <article className='min-w-0'>
                                        <p className={itemLabelClass}>Email acadêmico</p>
                                        <p className={itemValueClass}>{user?.email_academico}</p>
                                    </article>
                                </div>
                                <div className={`${itemClass} ${itemBorderClass}`}>
                                    <article className={iconBoxClass}>
                                        <IconId
                                            size={28}
                                            className='stroke-color1-100'
                                        />
                                    </article>
                                    <article className='min-w-0'>
                                        <p className={itemLabelClass}>Matrícula</p>
                                        <p className={itemValueClass}>{user?.matricula}</p>
                                    </article>
                                </div>
                                <div className={`${itemClass} ${itemBorderClass}`}>
                                    <article className={iconBoxClass}>
                                        <IconMapPin
                                            size={28}
                                            className='stroke-color1-100'
                                        />
                                    </article>
                                    <article className='min-w-0'>
                                        <p className={itemLabelClass}>Campus</p>
                                        <p className={itemValueClass}>{user?.campus}</p>
                                    </article>
                                </div>
                                <div className={itemClass}>
                                    <article className={iconBoxClass}>
                                        <IconCalendar
                                            size={28}
                                            className='stroke-color1-100'
                                        />
                                    </article>
                                    <article className='min-w-0'>
                                        <p className={itemLabelClass}>Data de nascimento</p>
                                        <p className={itemValueClass}>
                                            {user?.nascimento?.split('-').reverse().join('/')}
                                        </p>
                                    </article>
                                </div>
                            </div>
                        </div>

                        <div className='rounded-xl bg-white p-4 shadow sm:p-6'>
                            <div className='mb-6'>
                                <div className='mb-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1'>
                                    <h3 className='text-2xl font-bold text-color1-100 md:text-3xl'>Conquistas</h3>
                                    <span className='text-sm text-color3-200'>
                                        {totalDesbloqueadas} de {conquistasDoUsuario.length} desbloqueadas
                                    </span>
                                </div>
                                <div
                                    role='progressbar'
                                    aria-valuemin={0}
                                    aria-valuemax={conquistasDoUsuario.length}
                                    aria-valuenow={totalDesbloqueadas}
                                    aria-label='Conquistas desbloqueadas'
                                    className='h-2 w-full overflow-hidden rounded-full bg-color4-100'
                                >
                                    <div
                                        className='h-full rounded-full bg-color1-100 transition-all duration-500'
                                        style={{ width: `${porcentagem}%` }}
                                    />
                                </div>
                            </div>
                            <div className='grid grid-cols-2 gap-x-4 gap-y-6 sm:flex sm:flex-wrap sm:justify-center sm:gap-10'>
                                {conquistasDoUsuario.map(conquista => {
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
                                                        className='h-25 w-25 rounded-md object-contain p-1'
                                                    />
                                                )}
                                            </div>

                                            <p className='text-center font-secundary text-base font-medium text-color1-100 sm:text-xl'>
                                                {conquista.nome}
                                            </p>
                                        </article>
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
                    className='fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm'
                >
                    <video
                        key={conquistaSelecionada.id}
                        src={conquistaSelecionada.animacao}
                        className='w-full max-w-100'
                        autoPlay
                        muted
                        playsInline
                    />
                </div>
            )}
            {confirmandoExclusao && (
                <div
                    onClick={() => !excluindo && setConfirmandoExclusao(false)}
                    className='fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm'
                >
                    <div
                        role='alertdialog'
                        aria-modal='true'
                        aria-labelledby='titulo-exclusao'
                        onClick={e => e.stopPropagation()}
                        className='w-full max-w-md rounded-xl bg-white p-6 shadow'
                    >
                        <h3
                            id='titulo-exclusao'
                            className='text-2xl font-bold text-red-700'
                        >
                            Excluir perfil?
                        </h3>
                        <p className='mt-2 text-base text-color3-200'>
                            Essa ação não pode ser desfeita. Sua conta, seus materiais e suas conquistas serão apagados.
                        </p>
                        {erroExclusao && <p className='mt-3 text-sm text-red-700'>{erroExclusao}</p>}
                        <div className='mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
                            <button
                                type='button'
                                disabled={excluindo}
                                onClick={() => setConfirmandoExclusao(false)}
                                className='min-h-10 cursor-pointer rounded-lg bg-color4-100 px-6 text-base text-color1-100 disabled:cursor-not-allowed disabled:opacity-60'
                            >
                                Cancelar
                            </button>
                            <button
                                type='button'
                                disabled={excluindo}
                                onClick={excluirPerfil}
                                className='min-h-10 cursor-pointer rounded-lg bg-red-700 px-6 text-base text-color4-100 disabled:cursor-not-allowed disabled:opacity-60'
                            >
                                {excluindo ? 'Excluindo...' : 'Sim, excluir'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ProtectedRoute>
    );
}
