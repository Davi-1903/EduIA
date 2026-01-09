import { Navigate } from 'react-router-dom';
import { useAuthenticated } from '../../context/authContext';

export default function ProtectedRoute({ children, isPrivate }) {
    const { isAuthenticated } = useAuthenticated();

    if (isPrivate && !isAuthenticated) return <Navigate to='/login' />;
    if (!isPrivate && isAuthenticated) return <Navigate to='/dash' />;
    return children;
}
