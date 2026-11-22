import { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import ProtectedRoute from '../../../components/protectedRoute';
import { useAuthenticated } from '../../../context/authContext';
import { useMessages } from '../../../context/messagesContext';
import { GET } from '../../../api/materials';
import Pagination from './components/pagination';
import EmptyMaterials from './components/empty';
import Filters from './components/filters';
import CardsView from './components/cardsView';
import { IconPlus } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

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
    const [withFilter, setWithFilter] = useState(false);
    const setMessagesRef = useRef(setMessages);
    const limit = 50;

    useEffect(() => {
        setMessagesRef.current = setMessages;
    }, [setMessages]);

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
                setWithFilter(data.withFilter);
                setTotal(data.total);
            } catch (err) {
                if (err.name === 'AbortError') return;
                setMaterials(null);
                setTotal(0);
                setMessagesRef.current(prev => [
                    ...prev,
                    {
                        id: prev.length + 1,
                        message:
                            err.name === 'SyntaxError' ? 'Ocorreu um problema com a resposta do servidor' : err.message,
                        type: 'danger',
                    },
                ]);
            } finally {
                setIsLoading(false);
            }
        },
        [cursor, difficulty, discipline, debouncedSearch, type],
    );

    function clearFilters() {
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
                    content='Materiais gerados pelo usuário'
                />
            </Helmet>
            <main className='min-h-screen bg-color4-200 not-sm:col-span-2'>
                <section className='mx-auto max-w-400 space-y-12 px-6 py-16'>
                    <div className='flex flex-col items-baseline sm:flex-row'>
                        <h1 className='bg-linear-to-tr from-color1-100 to-color4-100 bg-clip-text text-4xl leading-tight font-bold text-transparent not-sm:mb-6 not-sm:w-full not-sm:text-center md:text-5xl'>
                            Meus materiais
                        </h1>
                        <Link
                            to='/dash'
                            className='group ml-auto not-sm:w-full'
                        >
                            <button className='flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-button px-2 py-2 font-primary text-lg text-color4-100 transition-all duration-250 group-hover:gap-3 group-hover:shadow-lg-hard sm:pr-4 sm:pl-3'>
                                <IconPlus className='transition-all duration-250 ease-[cubic-bezier(.94,.01,.51,1.27)] group-hover:-rotate-90' />
                                <span>Gerar materiais</span>
                            </button>
                        </Link>
                    </div>
                    {(total > 0 || withFilter) && (
                        <Filters
                            user={user?.tipo}
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
                    )}
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
                        <EmptyMaterials withFilter={withFilter} />
                    )}
                </section>
            </main>
        </ProtectedRoute>
    );
}
