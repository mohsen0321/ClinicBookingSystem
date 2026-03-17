import axios from 'axios';
import { toast } from 'react-toastify';
import { getToken, doLogout } from '../hooks/useAuth';

const api = axios.create({
    baseURL: 'https://localhost:7278/api',
    timeout: 10000,
});

// endpoints اللي مش محتاجة تعمل logout لو جاء 401
const AUTH_URLS = ['/auth/login', '/auth/register', '/Password/'];

const isAuthUrl = (url) =>
    AUTH_URLS.some((path) => url?.includes(path));

// إضافة التوكن للطلبات
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// التعامل مع الردود
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const url = error.config?.url;
        const status = error.response?.status;

        // 401 بس لو مش في صفحة auth — يعمل logout عالمي
        if (status === 401 && !isAuthUrl(url)) {
            toast.error('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى');
            doLogout();
        }

        // باقي الأخطاء بترجع للـ catch في كل صفحة
        return Promise.reject(error);
    }
);

export default api;