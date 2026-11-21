import clsx from 'clsx';

export default function LoadingMaterial({ message, isLoading, setAnimation }) {
    return (
        <div
            className={clsx(
                'fixed inset-0 z-8 grid place-items-center bg-radial from-yellow-100 from-10% to-color4-100 to-90% backdrop-blur-3xl',
                isLoading ? 'animate-fade-in' : 'animate-fade-out',
            )}
            onAnimationEnd={() => isLoading || setAnimation(false)}
        >
            <div>
                <video
                    src='/assets/images/mascotes_animados/loading_materials.webm'
                    className='h-[65dvh]'
                    autoPlay
                    loop
                />
                <h1 className='absolute top-1/4 left-1/2 -translate-1/2 animate-pulse text-center text-2xl font-bold text-color3-400'>
                    {message}
                </h1>
            </div>
        </div>
    );
}
