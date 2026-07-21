import { Helmet } from 'react-helmet-async';
import ProtectedRoute from '../../../components/protectedRoute';

export default function Settings() {
    return (
        <ProtectedRoute isPrivate={true}>
            <Helmet>
                <title>EduIA | Configurações</title>
                <meta
                    name='description'
                    content='Configurações do sistema EduIA'
                />
            </Helmet>
            <main className='p-12'>
                <h1 className='text-5x1 font-bold'>Configurações</h1>
            </main>
        </ProtectedRoute>
    );
}
