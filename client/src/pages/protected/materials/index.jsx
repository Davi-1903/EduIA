import { Helmet } from 'react-helmet-async';
import ProtectedRoute from '../../../components/protectedRoute';

export default function Materials() {
    return (
        <ProtectedRoute isPrivate={true}>
            <Helmet>
                <title>EduIA | Materials</title>
                <meta
                    name='description'
                    content='Materiais geradas pelo usuário'
                />
            </Helmet>
            <main className='min-h-screen bg-linear-to-br from-color4-200 to-indigo-100'>
                <section className='mx-auto max-w-7xl space-y-24 px-6 py-16 pt-24'>
                    <h1 className='text-4xl leading-tight font-bold text-color1-100 md:text-5xl'>Meus materiais</h1>

                    {/* Materiais do banco de dados */}
                </section>
            </main>
        </ProtectedRoute>
    );
}
