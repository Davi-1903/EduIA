import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import ProtectedRoute from '../../../components/protectedRoute';
import { useMessages } from '../../../context/messagesContext';
import { GET } from '../../../api/materials';
import Pagination from './components/pagination';
import EmptyMaterials from './components/empty';
import CardsView from './components/cardsView';

export default function Trash() {
    const { setMessages } = useMessages();
    const [materials, setMaterials] = useState(null);
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
                const data = await GET(`/api/trash?${params.toString()}`, { signal });
                if (data.status === 401) return;
                if (data.status !== 200) throw new Error('Não foi possível carregar os materiais');

                setMaterials(data.materials);
                setTotal(data.total);
            } catch (err) {
                setMaterials(null);
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
                <title>EduIA | Lixeira</title>
                <meta
                    name='description'
                    content='Lixeira do materiais gerados pelo usuário'
                />
            </Helmet>
            <main className='min-h-screen bg-color4-200 not-sm:col-span-2'>
                <section className='mx-auto max-w-400 space-y-12 px-6 py-16'>
                    <div>
                        <h1 className='bg-linear-to-tr from-color1-100 to-color4-100 bg-clip-text text-4xl leading-tight font-bold text-transparent md:text-5xl'>
                            Minha lixeira
                        </h1>
                        <p className='mt-6 text-lg text-color3-200'>
                            Os materiais movidos para a lixeira são apagados após <strong>30 dias</strong>
                        </p>
                    </div>
                    {isLoading && !materials ? (
                        <p className='pt-12 text-center text-xl font-bold text-color3-400'>Carregando materiais...</p>
                    ) : total > 0 && materials ? (
                        <>
                            <CardsView
                                materials={materials}
                                fetchMaterials={fetchMaterials}
                            />
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
