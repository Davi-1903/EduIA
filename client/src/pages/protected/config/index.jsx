import { useState } from 'react';
import ProtectedRoute from '../../../components/protectedRoute';

export default function Settings() {
    return (
        <ProtectedRoute isPrivate={true}>
            <Helmet>
                <title>EduIA | Configurações</title>
            </Helmet>
            <main className='p-12'>
                <h1 className='text-5x1 font-bold'>Configurações</h1>
            </main>
        </ProtectedRoute>
    );
}
