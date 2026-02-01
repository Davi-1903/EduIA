import Logo from '/assets/images/logo.svg';

// Loading provisório. Vamos fazer com skeletons
export default function Loading() {
    return (
        <div className='bg-color4-200 flex min-h-screen flex-col items-center justify-center gap-8'>
            <article className='animate-pulse'>
                <img src={Logo} alt='Logo EduIA' className='mx-auto mb-8 h-46' />
                <p className='text-color3-100 text-xl font-semibold'>Verificando autenticação...</p>
            </article>
        </div>
    );
}
