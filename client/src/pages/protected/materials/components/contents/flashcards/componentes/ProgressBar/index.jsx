

export default function ProgressBar({ currentCardID, cards }) {
    return (
        <>
            <div className='flex items-center gap-4 p-2'>
                <div className='h-4 flex-1 rounded-full bg-color4-100'>
                    <div
                        className='h-full rounded-full bg-linear-to-r from-color2-100 to-color1-400 transition-all duration-500 ease-out'
                        style={{
                            width: `${((currentCardID + 1) / cards.length) * 100}%`,
                        }}
                    ></div>
                </div>
                <span className='font-secundary text-base font-semibold text-color1-100'>
                    {currentCardID + 1}/{cards.length}
                </span>
            </div>
        </>
    );
}
