import clsx from 'clsx';

export const LETRAS = ['A', 'B', 'C', 'D', 'E'];

export function obterResposta(tipo, questao) {
    if (tipo === 'multiple_choice') {
        const i = questao.answers.findIndex(a => a.id === questao.correctAnswerId);
        return i === -1 ? '' : `${LETRAS[i]}) ${questao.answers[i].text}`;
    }
    if (tipo === 'true_or_false') return questao.correctAnswer ? 'Verdadeiro' : 'Falso';
    return questao.expectedAnswer;
}

// Opção só para leitura (não clicável)
function Opcao({ destaque, children }) {
    return (
        <li
            className={clsx(
                'flex gap-3 rounded-xl border-2 border-color1-100 p-3 font-secundary text-base text-black transition-all duration-250',
                destaque ? 'border-green-500 bg-green-50' : 'border-black/50',
            )}
        >
            {children}
        </li>
    );
}

export default function Alternativas({ tipo, questao, revelada }) {
    if (tipo === 'multiple_choice') {
        return (
            <ul className='flex flex-col gap-3'>
                {questao.answers.map((a, i) => (
                    <Opcao key={a.id} destaque={revelada && a.id === questao.correctAnswerId}>
                        <strong>{LETRAS[i]})</strong>
                        <span>{a.text}</span>
                    </Opcao>
                ))}
            </ul>
        );
    }

    if (tipo === 'true_or_false') {
        return (
            <ul className='flex gap-2'>
                {[
                    { valor: true, texto: 'Verdadeiro' },
                    { valor: false, texto: 'Falso' },
                ].map(op => (
                    <li
                        key={op.texto}
                        destaque={revelada && op.valor === questao.correctAnswer}
                        className='transition-all duration-250 hover:bg-button hover:text-color4-400 p-3 w-28 text-center text-color1-100 font-medium rounded-xl border-2 b-color1-100'
                    >
                        <span>{op.texto}</span>
                    </li>
                ))}
            </ul>
        );
    }

    return null;
}