// Loading provisório. Vamos fazer com skeletons
export default function Loading() {
    return (
        <div className='bg-color4-200 grid min-h-screen place-items-center'>
            <div className='from-color4-200 to-color1-400 aspect-square h-30 animate-spin rounded-full bg-conic'>
                <div className='bg-color4-200 m-3 aspect-square h-4/5 rounded-full'></div>
            </div>
        </div>
    );
}
