export default function TituloDaAba(props) {
    return (
        <div className="relative flex w-fit items-center gap-1.5 font-bold after:absolute after:right-0 after:bottom-0 after:left-0 after:h-0.75 after:bg-[rgba(5,25,51,0.15)] after:content-['']">
            <h2 className="font-['Inter',sans-serif] leading-[1.2] flex items-center gap-1.5 text-3xl text-[#051933]">{props.titulo}</h2>

            <props.Icon
                size={24}
                className='text-[#051933]'
                stroke={2}
            />
        </div>
    );
}
