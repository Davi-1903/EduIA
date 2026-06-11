import { useEffect, useRef, useState } from 'react';
import InputRange from '../../../../components/inputRange';
import clsx from 'clsx';

export default function GenerateQuestions({ setOpen }) {
    const articleRef = useRef(null);
    const [dificuldade, setDificuldade] = useState(0);
    const [quantidade, setQuantidade] = useState(5);
    const [isClose, setClose] = useState(false);
    const dificuldades = ['Muito fácil', 'Fácil', 'Médio', 'Difícil', 'Muito difícil'];
    const disciplinas = [
        {
            nome: 'Disciplinas Comuns',
            disciplinas: [
                'Língua Portuguesa e Literatura',
                'Inglês',
                'Espanhol/Francês',
                'Arte',
                'Educação Física',
                'Geografia',
                'História',
                'Filosofia',
                'Sociologia',
                'Matemática',
                'Física',
                'Química',
                'Biologia',
                'Informática',
            ],
        },
        {
            nome: 'Informática para Internet',
            disciplinas: [
                'Filosofia, Ciência e Tecnologia',
                'Sociologia do Trabalho',
                'Qualidade de Vida e Trabalho',
                'Gestão Organizaciona',
                'Fundamentos de Lógica e Algoritmo',
                'Análise e Projeto Orientados a Objeto',
                'Projeto de Desenvolvimento de Sistemas para Internet',
                'Princípios de Design e Projeto Gráfica',
                'Design Web e Arquitetura da Informação',
                'Programação Estruturada e Orientada a Objetos',
                'Banco de Dados',
                'Programação de Sistemas para Internet',
                'Instalação e Configuração de Servidores',
                'Projeto de Interface do Usuário',
                'Programação Orientada a Serviços',
            ],
        },
        {
            nome: 'Eletrotécnica',
            disciplinas: [
                'Segurança do Trabalho',
                'Gestão Organizacional',
                'Desenho Técnico',
                'Desenho CAD',
                'Noções de Mecânica',
                'Eletricidade Básica',
                'Circuitos Elétricos',
                'Medidas Elétricas',
                'Eletrônica Digital',
                'Eletrônica Analógica',
                'Instalações Elétricas de Baixa Tensão',
                'Máquinas e Acionamentos Elétricos',
                'Instalações Elétricas de Alta Tensão',
                'Eletrônica Aplicado',
                'Hidráulica e Pneumático',
                'Controladores Lógicos Programáveil',
                'Manutenção Elétrica Industrial',
            ],
        },
        {
            nome: 'Têxtil',
            disciplinas: [
                'Filosofia, Ciência e Tecnologia',
                'Sociologia do Trabalho',
                'Qualidade de Vida e Trabalho',
                'Gestão e Psicologia das Organizações',
                'Sistemas de Manutenção',
                'Inglês Aplicado à Indústria Têxtil',
                'Introdução à Tecnologia Têxtil',
                'Tecnologia das Fibras Têxteil',
                'Tecnologia da Fiação',
                'Tecnologia da Preparação à Tecelagem',
                'Desenvolvimento de Padronagens',
                'Tecnologia da Tecelagem',
                'Tecnologia da Produção de Não Tecido',
                'Tecnologia do Beneficiamento Primário',
                'Introdução à Colorimetria',
                'Tecnologia do Beneficiamento Secundário',
                'Tecnologia do Beneficiamento Terciário',
                'Tecnologia da Estamparia',
                'Controle de Qualidade na Indústria Têxtil',
                'Lavanderia Industrial',
                'Planejamento e Controle da Produção',
                'Higiene e Segurança do Trabalho na Indústria Têxtil e de Confecções',
                'Tecnologia e Meio Ambiente',
                'Tecnologia da Malha',
            ],
        },
        {
            nome: 'Vestuário',
            disciplinas: [
                'Matemática Básica',
                'Filosofia, Ciência e Tecnologia',
                'Sociologia do Trabalho',
                'Qualidade de Vida e Trabalho',
                'Gestão e Psicologia das Organizações',
                'Sistemas de Manutenção',
                'Inglês Aplicado à Indústria Têxtil',
                'Introdução à Tecnologia Têxtil',
                'História da Indumentária',
                'Introdução à Tecnologia da Costura',
                'Introdução à Tecnologia do Enfesto e Corte',
                'Tecnologia da Modelagem I',
                'Tecnologia da Modelagem II',
                'Empreendedorismo na Indústria da Confecção do Vestuário e de Acessórios',
                'Tempos e Métodos do Processo Produtivo',
                'Planejamento e Controle da Produção',
                'Desenho Técnico do Vestuário',
                'Planejamento e Criação de Coleção',
                'Marketing e Moda',
                'Estamparia Aplicada à Indústria do Vestuário',
                'Lavanderia Industrial',
                'Laboratório de CAD Aplicado ao Vestuário',
                'Mecânica de Máquinas de Costura Industrial',
                'Tecnologia e Meio Ambiente',
                'Normas Técnicas e Controle de Qualidade na Confecção do Vestuário',
                'Higiene e Segurança do Trabalho na Indústria Têxtil e de Confecções',
            ],
        },
        {
            nome: 'Disciplinas Compartilhadas entre Têxtil e Vestuário',
            disciplinas: [
                'Filosofia, Ciência e Tecnologia',
                'Sociologia do Trabalho',
                'Qualidade de Vida e Trabalho',
                'Gestão e Psicologia das Organizações',
                'Sistemas de Manutenção',
                'Inglês Aplicado à Indústria Têxtil',
                'Introdução à Tecnologia Têxtil',
                'Planejamento e Controle da Produção',
                'Lavanderia Industrial',
                'Tecnologia e Meio Ambiente',
                'Higiene e Segurança do Trabalho na Indústria Têxtil e de Confecções',
            ],
        },
        {
            nome: 'Disciplinas Compartilhadas entre Informática para Internet e Eletrotécnica',
            disciplinas: ['Gestão Organizacional'],
        },
    ];

    function formatQuantidade(value) {
        return String(value).padStart(2, '0');
    }

    function handleAnimationEnd() {
        if (isClose) setOpen(false);
    }

    useEffect(() => {
        function handleClick(event) {
            if (!articleRef.current.contains(event.target)) setClose(true);
        }

        function handleKey(event) {
            if (event.key === 'Escape') setClose(true);
        }

        document.addEventListener('mousedown', handleClick);
        document.addEventListener('keydown', handleKey);
        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('keydown', handleKey);
        };
    }, []);

    return (
        <div
            onAnimationEnd={handleAnimationEnd}
            className={clsx(
                'fixed inset-0 z-7 grid place-items-center bg-gray-800/20 backdrop-blur-sm',
                isClose ? 'animate-fade-out' : 'animate-fade-in',
            )}
        >
            <form
                ref={articleRef}
                className='flex w-xl flex-col gap-6 rounded-2xl bg-color4-200 px-6 py-12'
            >
                <h2 className='bg-linear-to-tr from-color1-100 to-color4-100 bg-clip-text font-primary text-4xl font-bold text-transparent'>
                    Questões
                </h2>
                <div>
                    <label
                        className='block font-secundary text-base font-bold text-color1-100'
                        htmlFor='disciplina'
                    >
                        Disciplina
                    </label>
                    <select
                        id='disciplina'
                        className='h-12 w-full rounded-lg border border-color4-25 px-4 font-medium text-[#757575] outline-none'
                    >
                        {disciplinas.map(disciplina => (
                            <optgroup label={disciplina.nome}>
                                {disciplina.disciplinas.map(value => (
                                    <option value={value}>{value}</option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                </div>
                <div>
                    <label
                        className='block font-secundary text-base font-bold text-color1-100'
                        htmlFor='conteudo'
                    >
                        Conteúdo
                    </label>
                    <input
                        type='text'
                        id='conteudo'
                        placeholder='Descreva o assunto das questões'
                        className='h-12 w-full rounded-lg border border-color4-25 px-4 font-medium outline-none'
                        required
                    />
                </div>
                <div>
                    <label
                        className='block font-secundary text-base font-bold text-color1-100'
                        htmlFor='dificuldade'
                    >
                        Dificuldade
                    </label>
                    <InputRange
                        value={dificuldades[dificuldade]}
                        trueValue={dificuldade}
                        setValue={setDificuldade}
                        steps={1}
                        min={0}
                        max={4}
                    />
                </div>
                <div>
                    <label
                        className='block font-secundary text-base font-bold text-color1-100'
                        htmlFor='quantidade'
                    >
                        Quantidade
                    </label>
                    <InputRange
                        value={quantidade}
                        trueValue={quantidade}
                        setValue={setQuantidade}
                        formatValue={formatQuantidade}
                        max={50}
                        min={5}
                    />
                </div>
                <div>
                    <label
                        className='block font-secundary text-base font-bold text-color1-100'
                        htmlFor='observacoes'
                    >
                        Observações
                    </label>
                    <textarea
                        id='observacoes'
                        className='h-24 w-full resize-none rounded-lg border border-color4-25 px-4 py-2 font-medium outline-none'
                        placeholder='Caso deseje, descreva aqui suas observações'
                    ></textarea>
                </div>
                <button className='h-12 cursor-pointer rounded-lg bg-button text-xl text-color4-100'>Gerar</button>
            </form>
        </div>
    );
}
