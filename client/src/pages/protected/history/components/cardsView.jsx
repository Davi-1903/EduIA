import HistoryCard from './history';

export default function CardsView({ history }) {
    return (
        <div className='grid grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] gap-8'>
            {history.map(item => (
                <HistoryCard
                    key={item.id}
                    {...item.material}
                />
            ))}
        </div>
    );
}
