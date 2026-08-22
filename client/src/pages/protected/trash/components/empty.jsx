import Mascote from '/assets/images/mascote/lixeira.webp';

export default function EmptyMaterials() {
    return (
        <div className='pt-12'>
            <h2 className='text-center font-secundary text-2xl font-semibold text-color3-400 lg:text-3xl'>
                Não há materiais apagados. Ainda bem...
            </h2>
            <img
                src={Mascote}
                alt='Mascote'
                loading='lazy'
                className='mx-auto -mt-12 w-full max-w-120 select-none'
            />
        </div>
    );
}
