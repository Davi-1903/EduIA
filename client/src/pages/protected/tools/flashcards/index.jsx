import { useEffect, useState, useRef } from 'react';
import clsx from 'clsx';
import InputRange from '../../../../components/inputRange';

export default function GenerateFlashCards({ setOpen }) {
    const articleRef = useRef(null); // vai servir para eu verificar se a pessoa está clicando dentro/fora do "pop-up"; useRef serve para eu reverenciar o fomulário
    const [isClose, setClose] = useState(false); // serve para verificar se o "pop-up" está aparecendo
    const [quantidade, setQuantidade] = useState(5);
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

    function handleAnimationEnd() {
        // essa função serve para fazer "aparecer" ou "desaparecer" o formulário, entra no operador ternário dentro da div
        if (isClose) setOpen(false);
    }

    // useEffect dispara quando acontece um evento
    useEffect(() => {
        // tenho que verificar se estou clicando no formulário ou cliquei fora, por isso faço as verificações abaixo:

        function handleClick(event) {
            // essa função serve para verificar se a pessoa clicou fora do formulário, se sim, muda o valor dentro de articleRef
            if (!articleRef.current.contains(event.target)) setClose(true);
        }

        function handleKey(event) {
            // essa função serve para verificar se a pessoa clicou 'esc', se sim, muda o valor dentro de articleRef
            if (event.key === 'Escape') setClose(true);
        }

        // mousedown é para quando aperto uma parte da tela
        document.addEventListener('mousedown', handleClick);
        // keydown é para quando aperto uma tecla
        document.addEventListener('keydown', handleKey);

        // depois que minha função foi "chamada", eu preciso parar os eventos, se não ia ficar chamando os eventos sempre e ia travar
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
                // se estiver aberto ele vai mostrar o formulário, se não, o formulário desaparece
            )}
        >
            <form
                ref={articleRef}
                className='flex w-xl flex-col gap-5 rounded-2xl bg-white p-8 shadow-lg'
            >
                <h2 className='bg-linear-to-tr from-color1-100 to-color4-100 bg-clip-text font-primary text-4xl font-bold text-transparent'>
                    FlashCards
                </h2>
                <div className='flex flex-col gap-5'>
                    <div>
                        <label
                            className='block font-secundary text-base font-bold text-color1-100'
                            htmlFor='disciplina'
                        >
                            Disciplina
                        </label>
                        <select
                            id='disciplina'
                            className='h-12 w-full rounded-lg border border-gray-300 px-4 font-medium text-color1-100 outline-none'
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
                        <label className='block font-secundary text-base font-bold text-color1-100'>Assunto</label>
                        <input
                            type='text'
                            placeholder='Descreva o assunto'
                            className='w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-color1-400'
                            required
                        />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label className='block font-secundary text-base font-bold text-color1-100'>Quantidade</label>
                        <InputRange
                            value={quantidade}
                            trueValue={quantidade}
                            setValue={setQuantidade}
                            min={5}
                            max={50}
                        />
                    </div>
                </div>
                <button
                    type='submit'
                    className='h-12 cursor-pointer rounded-lg bg-button text-xl text-color4-100'
                >
                    Gerar
                </button>
            </form>
        </div>
    );
}
