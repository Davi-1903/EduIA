import { Link } from 'react-router-dom';
import { IconArrowUp, IconBrandGithub } from '@tabler/icons-react';
import Logo from '/logo_dark.svg';

export default function Footer() {
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
        <footer className='bg-footer'>
            <div className='mx-auto flex max-w-360 flex-col justify-between gap-4 p-4 sm:p-12 lg:flex-row'>
                <article className='lg:max-w-md'>
                    <Link to='/'>
                        <img src={Logo} alt='Logo EduIA' className='my-4 h-6 sm:h-9' />
                    </Link>
                    <p className='text-md/normal font-primary text-color1-100 text-balance'>
                        Sistema de geração inteligente de materiais de aula e de estudo. Desenvolvido por estudantes do
                        ensino médio técnico integrado do <strong>IFRN</strong> - Campus Caicó.
                    </p>
                    <ul className='my-4 flex gap-4'>
                        <li>
                            <Link to='https://github.com/Davi-1903/EduIA' target='_blank'>
                                <IconBrandGithub
                                    size={32}
                                    strokeWidth={2}
                                    className='stroke-color1-100 hover:bg-color4-50 box-content rounded-lg p-2'
                                />
                            </Link>
                        </li>
                    </ul>
                    <button
                        className='border-color1-100 hover:bg-color1-100 text-color1-100 hover:stroke-color3-100 stroke-color1-100 hover:text-color4-100 flex cursor-pointer gap-2 rounded-lg border-3 px-4 py-2 transition-all duration-100'
                        onClick={() => window.scroll({ top: 0, behavior: 'smooth' })}
                    >
                        <span className='font-primary font-medium'>Voltar para o topo</span>
                        <IconArrowUp />
                    </button>
                </article>
                <div className='flex flex-col gap-4 md:flex-row lg:w-160'>
                    <article className='flex-1'>
                        <h2 className='font-primary text-color1-100 mb-2 text-xl font-bold md:text-2xl'>
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
                        <h2 className='font-primary text-color1-100 mb-2 text-xl font-bold md:text-2xl'>
                            Institucional
                        </h2>
                        <ul>
                            <li>
                                <Link to='/sobre' className='font-primary text-color1-100 hover:underline'>
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
            <p className='font-primary bg-color1-50 text-color4-100 p-4 text-center text-sm'>
                Copyright &copy; {new Date().getFullYear()} <strong>EduIA</strong> | Todos os direitos reservados.
            </p>
        </footer>
    );
}
