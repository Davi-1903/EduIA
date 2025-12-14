export default function LandingPageAbout() {
    return (
        <section className='bg-color4-200 flex flex-wrap items-center justify-center gap-8 px-8 py-32 md:min-h-screen md:p-24 md:pt-0'>
            <article className='flex-2 basis-80'>
                <h2 className='text-color2-200 font-primary mb-4 text-4xl font-bold md:text-5xl'>O que é o EduIA?</h2>
                <p className='text-md text-color3-100 font-secundary text-balance md:text-xl'>
                    O <strong>EduIA</strong> é um sistema de geração de materiais de estudo com <strong>IA</strong>{' '}
                    (Inteligência Artificial), desenvolvido por estudantes do ensino médio técnico integrado do{' '}
                    <strong>IFRN</strong> - campus Caicó. O sistema visa reduzir o tempo gasto por alunos e professores,
                    gerando materiais de estudo e de aula.
                </p>
            </article>
            <article className='hidden flex-1 basis-80 md:block'>
                {/* Adicionar uma imagem que tem a ver com o projeto */}
                <div className='bg-color4-25 mx-auto grid aspect-square h-120 place-items-center rounded-4xl'>IMG</div>
            </article>
        </section>
    );
}
