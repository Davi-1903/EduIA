export default function Card({ title, description }) {
    return (
        <article className='bg-color2-200 min-w-60 rounded-2xl p-4 md:min-w-80'>
            <h3 className='text-color4-100 font-primary mb-2 text-xl font-semibold md:text-2xl'>{title}</h3>
            <hr className='border-color3-100 my-2 border' />
            <p className='font-secundary text-color4-50 text-md/normal md:text-lg/normal'>{description}</p>
        </article>
    );
}
