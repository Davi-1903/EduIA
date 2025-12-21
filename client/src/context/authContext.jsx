import { createContext, useContext, useState } from 'react';

const AuthenticatedContext = createContext();

export function AuthenticatedProvider({ children }) {
    const [isAuthenticated, setAuthenticated] = useState(false);

    return (
        <AuthenticatedContext.Provider value={{ isAuthenticated, setAuthenticated }}>
            {children}
        </AuthenticatedContext.Provider>
    );
}

export function useAuthenticated() {
    return useContext(AuthenticatedContext);
}
