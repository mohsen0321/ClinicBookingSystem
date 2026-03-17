import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TOKEN_KEY = 'clinic_jwt';
const ROLE_KEY = 'clinic_role';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getRole = () => localStorage.getItem(ROLE_KEY);

const decodeToken = (token) => {
    try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        return decoded;
    } catch {
        return null;
    }
};

const getNameFromToken = (token) => {
    if (!token) return null;
    const decoded = decodeToken(token);
    if (!decoded) return null;
    return (
        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
        decoded['name'] ||
        decoded['unique_name'] ||
        decoded['given_name'] ||
        decoded['fullName'] ||
        null
    );
};

export const doLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    window.location.href = '/login';
};

export const useAuth = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState(() => {
        const token = getToken();
        return {
            token,
            role: getRole(),
            name: getNameFromToken(token),
        };
    });

    const login = (token, role) => {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(ROLE_KEY, role);
        const name = getNameFromToken(token);
        setUser({ token, role, name });
        navigate(role === 'Doctor' ? '/doctor' : '/patient');
    };

    const logout = () => {
        doLogout();
        setUser({ token: null, role: null, name: null });
    };

    const isAuthenticated = !!user.token;

    return { user, login, logout, isAuthenticated };
};