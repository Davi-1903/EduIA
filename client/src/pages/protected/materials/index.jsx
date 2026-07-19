import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import ProtectedRoute from '../../../components/protectedRoute';
import { useMessages } from '../../../context/messagesContext';
import { GET } from '../../../api/materials';
import MaterialCard from './components/material';
import Pagination from './components/pagination';

export default function Materials() {
    const { setMessages } = useMessages();
    const [materials, setMaterials] = useState(null);
    const [total, setTotal] = useState(0);
    const [cursor, setCursor] = useState(0);
    const limit = 50;

    useEffect(() => {
        GET(`/api/materials?cursor=${cursor}&limit=${limit}`)
            .then(data => {
                if (data.status !== 200) throw new Error('Não foi possível carregar os materiais');
                setMaterials(data.materials);
                setTotal(data.total);
            })
            .catch(err => {
                setMaterials(null);
                setMessages(prev => [
                    ...prev,
                    {
                        id: prev.length + 1,
                        message: err.message,
                        type: 'danger',
                    },
                ]);
            });
    }, [cursor, setMessages]);

    return (
        <ProtectedRoute isPrivate={true}>
            <Helmet>
                <title>EduIA | Materials</title>
                <meta
                    name='description'
                    content='Materiais geradas pelo usuário'
                />
            </Helmet>
            <main className='min-h-screen bg-linear-to-br from-color4-200 to-indigo-100 not-sm:col-span-2'>
                <section className='mx-auto max-w-7xl space-y-12 px-6 py-16 pt-16'>
                    <h1 className='text-4xl leading-tight font-bold text-color1-100 md:text-5xl'>Meus materiais</h1>

                    {materials?.length > 0 ? (
                        <>
                            <div>Filtros...</div>
                            <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
                                {materials.map(material => (
                                    <MaterialCard
                                        key={material.id}
                                        {...material}
                                    />
                                ))}
                            </div>
                            <Pagination
                                cursor={cursor}
                                setCursor={setCursor}
                                limit={limit}
                                length={total}
                            />
                        </>
                    ) : (
                        <div>
                            <h2>Não há materiais</h2>
                            <h3>Inicie seu aprendizado gerando materiais para qualquer assunto</h3>
                        </div>
                    )}
                </section>
            </main>
        </ProtectedRoute>
    );
}
