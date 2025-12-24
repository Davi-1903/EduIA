import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthenticated } from '../../context/authContext';

export default function ProtectedRoute({ children, isPrivate }) {
    const [isOk, setOk] = useState(false);
    const { setAuthenticated } = useAuthenticated();

    useEffect(() => {
        fetch('/api/auth/check', { credentials: 'include' })
            .then(res => {
                const result = res.status === 200;
                setOk(result);
                setAuthenticated(result);
            })
            .catch(err => {
                setOk(false);
                setAuthenticated(false);
                console.error(err);
            });
    }, [setAuthenticated]);

    // Retornar loading;
    if (isPrivate && !isOk) return <Navigate to='/login' />;
    if (!isPrivate && isOk) return <Navigate to='/dash' />;
    return children;
}
