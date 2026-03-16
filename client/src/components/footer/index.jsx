import { memo } from 'react';
import { Link } from 'react-router-dom';
import { IconArrowUp, IconBrandGithub } from '@tabler/icons-react';
import { useAuthenticated } from '../../context/authContext';
import Logo from '/assets/images/logo_dark.svg';
import clsx from 'clsx';

function Footer() {
    const { isAuthenticated } = useAuthenticated();
    const funcionalidades = [
        'Questões',
        'Formulários',
        'Quizzes',
        'Flashcards',
        'Resumos',
        'Explicações',
        'Exercícios guiados',
        'Planos de aula',
        'Roteiros de estudo',
        'Desafios',
    ];

    return (
        <footer className={clsx('bg-color4-400', isAuthenticated && 'col-start-2')}>
            <div className='mx-auto flex max-w-360 flex-col justify-between gap-4 p-4 sm:p-12 lg:flex-row'>
                <article className='lg:max-w-md'>
                    <Link to='/' prefetch='intent'>
                        <img src={Logo} alt='Logo EduIA' loading='lazy' className='my-4 h-6 sm:h-9' />
                    </Link>
                    <p className='font-primary text-base/normal text-balance text-color1-100'>
                        Sistema de geração inteligente de materiais de aula e de estudo. Desenvolvido por estudantes do
                        ensino médio técnico integrado do <strong>IFRN</strong> - Campus Caicó.
                    </p>
                    <ul className='my-4 flex gap-4'>
                        <li>
                            <Link
                                to='https://github.com/Davi-1903/EduIA'
                                target='_blank'
                                aria-label='Link para o repostitório no github'
                            >
                                <IconBrandGithub
                                    size={32}
                                    strokeWidth={2}
                                    className='box-content rounded-lg stroke-color1-100 p-2 hover:bg-color4-50'
                                />
                            </Link>
                        </li>
                    </ul>
                    <button
                        className='flex cursor-pointer gap-2 rounded-lg border-3 border-color1-100 stroke-color1-100 px-4 py-2 text-color1-100 transition-all duration-100 hover:bg-button hover:stroke-color3-100 hover:text-color4-100'
                        onClick={() => window.scroll({ top: 0, behavior: 'smooth' })}
                    >
                        <span className='font-primary font-medium'>Voltar para o topo</span>
                        <IconArrowUp />
                    </button>
                </article>
                <div className='flex flex-col gap-4 md:flex-row lg:w-160'>
                    <article className='flex-1'>
                        <h2 className='mb-2 font-primary text-xl font-bold text-color1-100 md:text-2xl'>
                            Funcionalidades
                        </h2>
                        <ul>
                            {funcionalidades.map((material, idx) => (
                                <li key={idx}>
                                    <Link to='/sobre' className='font-primary text-color1-100 hover:underline'>
                                        Gerar {material}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </article>
                    <article className='flex-1'>
                        <h2 className='mb-2 font-primary text-xl font-bold text-color1-100 md:text-2xl'>
                            Institucional
                        </h2>
                        <ul>
                            <li>
                                <Link
                                    to='/sobre'
                                    className='font-primary text-color1-100 hover:underline'
                                    prefetch='intent'
                                >
                                    Sobre o <strong>EduIA</strong>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to='https://portal.ifrn.edu.br/campus/caico/'
                                    target='_blank'
                                    className='font-primary text-color1-100 hover:underline'
                                >
                                    <strong>IFRN</strong> - Campus Caicó
                                </Link>
                            </li>
                        </ul>
                    </article>
                </div>
            </div>
            <p className='bg-color1-50 p-4 text-center font-primary text-sm text-color4-100'>
                Copyright &copy; {new Date().getFullYear()} <strong>EduIA</strong> | Todos os direitos reservados.
            </p>
        </footer>
    );
}

export default memo(Footer);
