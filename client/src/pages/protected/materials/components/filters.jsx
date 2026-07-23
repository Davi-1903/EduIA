import { disciplinasList } from '../../../../../public/assets/data/disciplinas';

export default function Filters({
    type,
    discipline,
    search,
    difficulty,
    setType,
    setDiscipline,
    setSearch,
    setDifficulty,
}) {
    const materialsType = [
        'desafio',
        'exercicio guiado',
        'explicacao',
        'flashcards',
        'formulario',
        'plano de aula',
        'questoes',
        'quiz',
        'resumo',
        'roteiro',
    ];

    return (
        <div className='flex gap-8'>
            <div className='min-w-lg'>
                <label
                    htmlFor='search'
                    className='block font-secundary text-color1-100'
                >
                    Pesquise pelo nome, assunto, ...
                </label>
                <input
                    type='search'
                    id='search'
                    className='min-h-12 w-full rounded-lg bg-color4-100 pr-12 pl-4 outline-none'
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>
            <div className='max-w-sm'>
                <label
                    htmlFor='disciplines'
                    className='block font-secundary text-color1-100'
                >
                    Disciplinas
                </label>
                <select
                    id='disciplines'
                    className='min-h-12 w-full rounded-lg bg-color4-100 pr-12 pl-4 outline-none'
                    value={discipline}
                    onChange={e => setDiscipline(e.target.value)}
                >
                    <option value='all'>Todas as disciplinas</option>
                    {Object.entries(disciplinasList).map(([key, disciplinas], idx) => (
                        <optgroup
                            key={idx}
                            label={key}
                        >
                            {disciplinas.map((disciplina, idx) => (
                                <option
                                    key={idx}
                                    value={disciplina}
                                >
                                    {disciplina}
                                </option>
                            ))}
                        </optgroup>
                    ))}
                </select>
            </div>
            <div>
                <label
                    htmlFor='material-type'
                    className='block font-secundary text-color1-100'
                >
                    Tipo do material
                </label>
                <select
                    id='material-type'
                    className='min-h-12 w-full rounded-lg bg-color4-100 pr-12 pl-4 outline-none'
                    value={type}
                    onChange={e => setType(e.target.value)}
                >
                    <option value='all'>Todos os tipos</option>
                    {materialsType.map((type, idx) => (
                        <option
                            key={idx}
                            value={type}
                        >
                            {type.replaceAll('_', ' ').toUpperCase()[0] +
                                type.replaceAll('_', ' ').toLowerCase().slice(1)}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label
                    htmlFor='difficulty'
                    className='block font-secundary text-color1-100'
                >
                    Dificuldade
                </label>
                <select
                    id='difficulty'
                    className='min-h-12 w-full rounded-lg bg-color4-100 pr-12 pl-4 outline-none'
                    value={difficulty}
                    onChange={e => setDifficulty(e.target.value)}
                >
                    <option value='all'>Todos as dificuldades</option>
                    <option value='Muito fácil'>Muito fácil</option>
                    <option value='Fácil'>Fácil</option>
                    <option value='Médio'>Médio</option>
                    <option value='Difícil'>Difícil</option>
                    <option value='Muito difícil'>Muito difícil</option>
                </select>
            </div>
        </div>
    );
}
