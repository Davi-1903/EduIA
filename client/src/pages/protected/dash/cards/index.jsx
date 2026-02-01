export default function Cards({ title, description }) {
    return (
        <div
            className="
                bg-color4-200
                rounded-lg
                p-6
                shadow-sm
                hover:shadow-lg
                transition-all
                hover:-translate-y-1
                cursor-pointer
                flex items-center
            "
        >
            <div className="flex items-center gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-color1-100">
                        {title}
                    </h3>
                    <p className="text-sm text-color3-200">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
}
