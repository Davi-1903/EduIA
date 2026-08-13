import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import ProtectedRoute from '../../../components/protectedRoute';
import { useMessages } from '../../../context/messagesContext';
import { GET } from '../../../api/materials';
import Pagination from './components/pagination';
import EmptyHistory from './components/empty';
import CardsView from './components/cardsView';

export default function History() {
    const { setMessages } = useMessages();
    const [historico, setHistorico] = useState(null);
    const [total, setTotal] = useState(0);
    const [cursor, setCursor] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const limit = 50;

    const fetchMaterials = useCallback(
        async signal => {
            setIsLoading(true);
            try {
                const params = new URLSearchParams({
                    cursor: String(cursor),
                    limit: String(limit),
                });
                const data = await GET(`/api/historico/?${params.toString()}`, { signal });
                if (data.status === 401) return;
                if (data.status !== 200) throw new Error('Não foi possível carregar o histórico');

                setHistorico(data.historico);
                setTotal(data.total);
            } catch (err) {
                if (err.name === 'AbortError') return;
                setHistorico(null);
                setTotal(0);
                setMessages(prev => [
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
        [cursor, setMessages],
    );

    useEffect(() => {
        const controller = new AbortController();
        fetchMaterials(controller.signal);
        return () => controller.abort();
    }, [fetchMaterials]);

    return (
        <ProtectedRoute isPrivate={true}>
            <Helmet>
                <title>EduIA | Histórico</title>
                <meta
                    name='description'
                    content='Histórico de materiais geradas pelo usuário'
                />
            </Helmet>
            <main className='min-h-screen bg-color4-200 not-sm:col-span-2'>
                <section className='mx-auto max-w-400 space-y-12 px-6 py-16'>
                    <h1 className='bg-linear-to-tr from-color1-100 to-color4-100 bg-clip-text text-4xl leading-tight font-bold text-transparent md:text-5xl'>
                        Histórico
                    </h1>
                    {isLoading && !historico ? (
                        <p className='pt-12 text-center text-xl font-bold text-color3-400'>Carregando histórico...</p>
                    ) : total > 0 && historico ? (
                        <>
                            <CardsView history={historico} />
                            <Pagination
                                cursor={cursor}
                                setCursor={setCursor}
                                limit={limit}
                                length={total}
                            />
                        </>
                    ) : (
                        <EmptyHistory />
                    )}
                </section>
            </main>
        </ProtectedRoute>
    );
}
