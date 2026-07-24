import { disciplinasList } from '../../../../../public/assets/data/disciplinas';

export default function Filters({
    user,
    type,
    discipline,
    search,
    difficulty,
    setType,
    setDiscipline,
    setSearch,
    setDifficulty,
    clearFilters,
}) {
    const materialsType = [
        { type: 'desafio', label: 'Desafio' },
        { type: 'exercicio guiado', label: 'Exercício guiado' },
        { type: 'explicacao', label: 'Explicação' },
        { type: 'flashcards', label: 'Flashcards' },
        { type: 'formulario', label: 'Formulário' },
        { type: 'plano de aula', label: 'Plano de aula' },
        { type: 'questoes', label: 'Questões' },
        { type: 'quiz', label: 'Quiz' },
        { type: 'resumo', label: 'Resumo' },
        { type: 'roteiro', label: 'Roteiro' },
    ];

    function filterMaterials(tipo, material, idx) {
        const exclusivoProfessores = ['formulario', 'plano de aula'];
        const exclusivoAlunos = ['flashcards', 'roteiro de estudo'];

        if (
            (tipo === 'professor' && exclusivoAlunos.includes(material.type)) ||
            (tipo === 'aluno' && exclusivoProfessores.includes(material.type))
        )
            return null;
        return (
            <option
                key={idx}
                value={material.type}
            >
                {material.label}
            </option>
        );
    }

    return (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-[1fr_auto] lg:grid-cols-[2fr_1fr_1fr_1fr] lg:gap-x-8 lg:gap-y-4'>
            <div className='not-lg:md:col-span-3'>
                <label
                    htmlFor='search'
                    className='block font-secundary text-color1-100'
                >
                    Pesquise pelo assunto
                </label>
                <input
                    type='search'
                    id='search'
                    className='min-h-12 w-full rounded-lg bg-color4-100 pr-12 pl-4 outline-none'
                    placeholder='Ex.: Geometria'
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>
            <div>
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
                    {materialsType.map((type, idx) => filterMaterials(user, type, idx))}
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
            <div className='col-span-full'>
                <button
                    className='cursor-pointer rounded-lg bg-button px-4 py-2 text-color4-100 transition-all duration-150'
                    onClick={clearFilters}
                >
                    Limpar filtros
                </button>
            </div>
        </div>
    );
}
