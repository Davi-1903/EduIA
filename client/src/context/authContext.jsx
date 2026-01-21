import { createContext, useContext, useEffect, useState } from 'react';
import Loading from '../components/loading';

const AuthenticatedContext = createContext();

export function AuthenticatedProvider({ children }) {
    const [isAuthenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/auth/check', { credentials: 'include' })
            .then(res => setAuthenticated(res.status === 200))
            .catch(() => setAuthenticated(false))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Loading />;
    return (
        <AuthenticatedContext.Provider value={{ isAuthenticated, setAuthenticated }}>
            {children}
        </AuthenticatedContext.Provider>
    );
}

export function useAuthenticated() {
    return useContext(AuthenticatedContext);
}
