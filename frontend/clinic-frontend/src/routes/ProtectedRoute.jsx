import { Navigate, Outlet } from 'react-router-dom';
import { getToken, getRole } from '../hooks/useAuth';

const ProtectedRoute = ({ allowedRoles }) => {
    const token = getToken();
    const role = getRole();

    if (!token) return <Navigate to="/login" replace />;

    if (allowedRoles && !allowedRoles.includes(role))
        return <Navigate to="/" replace />;

    return <Outlet />;
};

export default ProtectedRoute;
