export default function Card({ title, description }) {
    return (
        <article className='min-w-60 rounded-2xl bg-color2-200 p-4 md:min-w-80'>
            <h3 className='mb-2 font-primary text-xl font-semibold text-color4-100 md:text-2xl'>{title}</h3>
            <hr className='my-2 rounded-full border border-color4-400/25' />
            <p className='font-secundary text-base/normal text-color4-50 md:text-lg/normal'>{description}</p>
        </article>
    );
}
