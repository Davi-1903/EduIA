export default function Cards({ title, description }) {
    return (
        <div className='bg-color4-200 flex cursor-pointer items-center rounded-lg p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg'>
            <div className='flex items-center gap-4'>
                <div>
                    <h3 className='text-color1-100 text-lg font-semibold'>{title}</h3>
                    <p className='text-color3-200 text-sm'>{description}</p>
                </div>
            </div>
        </div>
    );
}
