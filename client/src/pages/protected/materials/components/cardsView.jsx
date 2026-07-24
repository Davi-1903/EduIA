import MaterialCard from './material';

export default function CardsView({ materials }) {
    return (
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {materials.map(material => (
                <MaterialCard
                    key={material.id}
                    {...material}
                />
            ))}
        </div>
    );
}
