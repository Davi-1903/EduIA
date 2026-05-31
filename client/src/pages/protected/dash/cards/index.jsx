export default function Cards({ title, description }) {
    return (
        <div className='flex cursor-pointer items-center rounded-lg bg-color4-200 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg'>
            <div className='flex items-center gap-4'>
                <div>
                    <h3 className='text-lg font-semibold text-color1-100'>{title}</h3>
                    <p className='text-sm text-color3-200'>{description}</p>
                </div>
            </div>
        </div>
    );
}
