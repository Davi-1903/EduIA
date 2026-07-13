import { createContext, useContext, useEffect, useState } from 'react';
import Loading from '../components/loading';

const AuthenticatedContext = createContext();

export function AuthenticatedProvider({ children }) {
    const [isAuthenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch('/api/user', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    setAuthenticated(true);
                    setUser(data.user);
                } else {
                    setAuthenticated(false);
                    setUser(null);
                }
            })
            .catch(() => {
                setAuthenticated(false);
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Loading />;
    return (
        <AuthenticatedContext.Provider
            value={{
                isAuthenticated,
                setAuthenticated,
                user,
                setUser,
            }}
        >
            {children}
        </AuthenticatedContext.Provider>
    );
}

export function useAuthenticated() {
    return useContext(AuthenticatedContext);
}
