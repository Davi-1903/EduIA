import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import ProtectedRoute from '../../../components/protectedRoute';
import { useAuthenticated } from '../../../context/authContext';
import { useMessages } from '../../../context/messagesContext';
import { GET } from '../../../api/materials';
import Pagination from './components/pagination';
import EmptyMaterials from './components/empty';
import Filters from './components/filters';
import CardsView from './components/cardsView';

export default function Materials() {
    const { user } = useAuthenticated();
    const { setMessages } = useMessages();
    const [materials, setMaterials] = useState(null);
    const [type, setType] = useState('all');
    const [discipline, setDiscipline] = useState('all');
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [difficulty, setDifficulty] = useState('all');
    const [total, setTotal] = useState(0);
    const [cursor, setCursor] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const limit = 50;

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        setCursor(0);
    }, [type, discipline, difficulty, debouncedSearch]);

    const fetchMaterials = useCallback(
        async signal => {
            setIsLoading(true);
            try {
                const params = new URLSearchParams({
                    cursor: String(cursor),
                    limit: String(limit),
                    search: debouncedSearch,
                    type,
                    discipline,
                    difficulty,
                });
                const data = await GET(`/api/materials?${params.toString()}`, { signal });
                if (data.status === 401) return;
                if (data.status !== 200) throw new Error('Não foi possível carregar os materiais');
                setMaterials(data.materials);
                setTotal(data.total);
            } catch (err) {
                if (err.name === 'AbortError') return;
                setMaterials(null);
                setTotal(0);
                setMessages(prev => [
                    ...prev,
                    {
                        id: prev.length + 1,
                        message: err.message,
                        type: 'danger',
                    },
                ]);
            } finally {
                setIsLoading(false);
            }
        },
        [cursor, difficulty, discipline, debouncedSearch, setMessages, type],
    );

    function clearFilters() {
        if (!confirm('Deseja limpar todos os filtros')) return;

        setDebouncedSearch('');
        setDifficulty('all');
        setDiscipline('all');
        setType('all');
    }

    useEffect(() => {
        const controller = new AbortController();
        fetchMaterials(controller.signal);
        return () => controller.abort();
    }, [fetchMaterials]);

    return (
        <ProtectedRoute isPrivate={true}>
            <Helmet>
                <title>EduIA | Materials</title>
                <meta
                    name='description'
                    content='Materiais geradas pelo usuário'
                />
            </Helmet>
            <main className='min-h-screen bg-color4-200 not-sm:col-span-2'>
                <section className='mx-auto space-y-12 px-6 py-16 pt-16'>
                    <h1 className='text-4xl leading-tight font-bold text-color1-100 md:text-5xl'>Meus materiais</h1>
                    <Filters
                        user={user.tipo}
                        type={type}
                        discipline={discipline}
                        search={search}
                        difficulty={difficulty}
                        setType={setType}
                        setDiscipline={setDiscipline}
                        setSearch={setSearch}
                        setDifficulty={setDifficulty}
                        clearFilters={clearFilters}
                    />
                    {isLoading && !materials ? (
                        <p className='pt-12 text-center text-xl font-bold text-color3-400'>Carregando materiais...</p>
                    ) : total > 0 && materials ? (
                        <>
                            <CardsView materials={materials} />
                            <Pagination
                                cursor={cursor}
                                setCursor={setCursor}
                                limit={limit}
                                length={total}
                            />
                        </>
                    ) : (
                        <EmptyMaterials />
                    )}
                </section>
            </main>
        </ProtectedRoute>
    );
}
