import clsx from 'clsx';
import HistoryCard from './history';

export default function CardsView({ history }) {
    return (
        <div
            className={clsx(
                'grid gap-8',
                history.length > 0 && history.length <= 4
                    ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-4'
                    : 'grid-cols-[repeat(auto-fit,minmax(18rem,1fr))]',
            )}
        >
            {history.map(item => (
                <HistoryCard
                    key={item.id}
                    {...item.material}
                />
            ))}
        </div>
    );
}
