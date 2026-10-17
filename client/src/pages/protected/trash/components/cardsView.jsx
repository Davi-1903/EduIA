import clsx from 'clsx';
import MaterialCard from './material';

export default function CardsView({ materials, fetchMaterials }) {
    return (
        <div
            className={clsx(
                'grid gap-8',
                materials.length > 0 && materials.length <= 4
                    ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-4'
                    : 'grid-cols-[repeat(auto-fit,minmax(18rem,1fr))]',
            )}
        >
            {materials.map(material => (
                <MaterialCard
                    key={material.id}
                    fetchMaterials={fetchMaterials}
                    {...material}
                />
            ))}
        </div>
    );
}
