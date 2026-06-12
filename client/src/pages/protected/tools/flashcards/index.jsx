import { useEffect, useState, useRef } from 'react';
import { disciplinasList } from '../../../../../public/assets/data/disciplinas';
import InputRange from '../../../../components/inputRange';
import clsx from 'clsx';

export default function GenerateFlashCards({ setOpen }) {
    const articleRef = useRef(null); // vai servir para eu verificar se a pessoa está clicando dentro/fora do "pop-up"; useRef serve para eu reverenciar o fomulário
    const [isClose, setClose] = useState(false); // serve para verificar se o "pop-up" está aparecendo
    const [quantidade, setQuantidade] = useState(5);

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
                            {Object.entries(disciplinasList).map(([key, disciplinas]) => (
                                <optgroup label={key}>
                                    {disciplinas.map(disciplina => (
                                        <option value={disciplina}>{disciplina}</option>
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
                    className='mt-4 h-12 cursor-pointer rounded-lg bg-button text-xl text-color4-100 transition-all duration-150 hover:shadow-lg-hard'
                >
                    Gerar
                </button>
            </form>
        </div>
    );
}
