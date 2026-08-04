export default function TituloDaAba(props) {
    return (
        <div className='relative flex w-fit items-center gap-1.5 font-bold'>
            <props.Icon
                size={40}
                className='text-[#011F5B]'
                stroke={2}
            />

            <h2 className="flex items-center font-['Inter',sans-serif] text-3xl leading-[1.2] text-[#011F5B]">
                {props.titulo}
            </h2>
        </div>
    );
}
