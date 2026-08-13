import MaterialCard from './material';

export default function CardsView({ materials }) {
    return (
        <div className='grid grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] gap-8'>
            {materials.map(material => (
                <MaterialCard
                    key={material.id}
                    {...material}
                />
            ))}
        </div>
    );
}
