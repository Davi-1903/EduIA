import { useState } from 'react';
import { IconArrowRight, IconBook, IconBulb } from '@tabler/icons-react';
import Alternativas from './Alternativas';
import { Dica, MostrarResposta, Resposta } from './Painel';

export default function Questions({ discipline, difficulty, tipo, questoes, onFinish }) {
    const [indice, setIndice] = useState(0);
    const [revelada, setRevelada] = useState(false);
    const [mostrarDica, setMostrarDica] = useState(false);

    const questao = questoes[indice];
    const ultima = indice === questoes.length - 1;
    const progresso = Math.round(((indice + 1) / questoes.length) * 100);

    function proxima() {
        setRevelada(false);
        setMostrarDica(false);
        if (ultima) onFinish();
        else setIndice(i => i + 1);
    }

    return (
        <article className='flex flex-1 flex-col gap-5'>
            {/* Cabeçalho */}
            <header className='flex items-center gap-3'>
                <div className='bg-black/3 p-4 rounded-full'>
                    <IconBook size={30} className='stroke-color1-100' />
                </div>
                <div>
                    <h2 className='font-primary text-xl font-bold text-color1-100'>Exercícios guiados</h2>
                    <span className='block font-secundary text-md text-color1-100/70'>
                        {discipline} · {difficulty} · {questoes.length} questões
                    </span>
                </div>
            </header>

            {/* Progresso */}
            <div className='flex flex-col gap-2'>
                <div className='flex items-center justify-between font-secundary text-md font-bold text-black'>
                    <span>
                        Questão {indice + 1} de {questoes.length}
                    </span>
                    <span>{progresso}%</span>
                </div>
                <div className='h-2 w-full rounded-full bg-color4-100'>
                    <div
                        className='h-2 rounded-full bg-button transition-all duration-250'
                        style={{ width: `${progresso}%` }}
                    />
                </div>
            </div>

            {/* Enunciado */}
            <p className='font-primary text-xl font-medium text-color1-black'>{indice + 1}. {questao.question}</p>

            <Alternativas tipo={tipo} questao={questao} revelada={revelada} />

            {mostrarDica && questao.hint && (
                <Dica texto={questao.hint} onClose={() => setMostrarDica(false)} />
            )}

            {revelada ? (
                <Resposta tipo={tipo} questao={questao} onClose={() => setRevelada(false)} />
            ) : (
                <MostrarResposta
                    onClick={() => {
                        setRevelada(true);
                        setMostrarDica(false);
                    }}
                />
            )}

            {/* Rodapé */}
            <div className='mt-auto flex gap-4'>
                {questao.hint && (
                    <button
                        type='button'
                        onClick={() => {
                            setMostrarDica(v => !v);
                            setRevelada(false);
                        }}
                        className='flex cursor-pointer items-center gap-2 rounded-xl border-3 border-color1-100 px-6 py-2 font-secundary text-base font-bold text-color1-100 transition-all duration-250 hover:bg-button hover:text-color4-400'
                    >
                        <IconBulb size={32} />
                        Ver dica
                    </button>
                )}
                <button
                    type='button'
                    onClick={proxima}
                    className='group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-button px-8 py-2 font-secundary text-base font-bold text-color4-400 transition-all duration-250 hover:shadow-lg-hard'
                >
                    <span>{ultima ? 'Finalizar' : 'Próxima questão'}</span>
                    <IconArrowRight size={22} className='transition-all duration-250 group-hover:ml-2' />
                </button>
            </div>
        </article>
    );
}