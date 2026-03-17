import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import "./LoginPage.css";

const orbs = [
    { size: 320, x: -80, y: -80, delay: '0s', dur: '8s' },
    { size: 200, x: '70%', y: '60%', delay: '2s', dur: '10s' },
    { size: 150, x: '85%', y: '-10%', delay: '1s', dur: '7s' },
    { size: 100, x: '20%', y: '80%', delay: '3s', dur: '9s' },
];

const crosses = [
    { x: '8%', y: '15%', size: 18, opacity: 0.15, delay: '0s' },
    { x: '92%', y: '25%', size: 12, opacity: 0.10, delay: '0.5s' },
    { x: '15%', y: '75%', size: 14, opacity: 0.12, delay: '1s' },
    { x: '88%', y: '80%', size: 20, opacity: 0.08, delay: '1.5s' },
    { x: '50%', y: '5%', size: 10, opacity: 0.10, delay: '2s' },
];

function CrossIcon({ size, opacity, delay }) {
    return (
        <svg
            width={size} height={size}
            viewBox="0 0 20 20"
            style={{ opacity, animation: `spin 20s linear infinite`, animationDelay: delay }}
        >
            <path d="M9 0h2v20H9zM0 9h20v2H0z" fill="white" />
        </svg>
    );
}

export default function LoginPage() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 50);
        return () => clearTimeout(t);
    }, []);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/auth/login', {
                email: form.email,
                password: form.password,
            });
            login(data.token, data.role);
            toast.success('تم تسجيل الدخول بنجاح');
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                err.response?.data?.title ||
                (typeof err.response?.data === 'string' ? err.response.data : null) ||
                'البريد الإلكتروني أو كلمة المرور غير صحيحة';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            dir="rtl"
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #0a1628 0%, #0d2347 50%, #0a1628 100%)',
                fontFamily: "'Tajawal', sans-serif",
                overflow: 'hidden',
                position: 'relative',
                padding: '16px',
            }}
        >

            {orbs.map((o, i) => (
                <div key={i} style={{
                    position: 'absolute',
                    left: o.x, top: o.y,
                    width: o.size, height: o.size,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(24,95,165,0.35) 0%, rgba(24,95,165,0) 70%)',
                    animation: `floatOrb ${o.dur} ease-in-out infinite`,
                    animationDelay: o.delay,
                    pointerEvents: 'none',
                }} />
            ))}
            {crosses.map((c, i) => (
                <div key={i} style={{
                    position: 'absolute',
                    left: c.x, top: c.y,
                    pointerEvents: 'none',
                }}>
                    <CrossIcon size={c.size} opacity={c.opacity} delay={c.delay} />
                </div>
            ))}
            <div className="card-reveal" style={{
                width: '100%',
                maxWidth: '400px',
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(40px)',
                WebkitBackdropFilter: 'blur(40px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '28px',
                padding: '40px 36px 36px',
                boxShadow: '0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
                position: 'relative',
                zIndex: 10,
            }}>
                <div className="field-reveal-1" style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{
                        width: '64px', height: '64px',
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, rgba(24,95,165,0.8), rgba(13,61,117,0.8))',
                        border: '1px solid rgba(56,138,221,0.4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px',
                        animation: 'pulse 3s ease infinite',
                        boxShadow: '0 8px 32px rgba(24,95,165,0.3)',
                    }}>
                        <svg width="30" height="30" fill="white" viewBox="0 0 24 24">
                            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                        </svg>
                    </div>
                    <h1 style={{
                        fontSize: '26px', fontWeight: 900,
                        color: 'white', margin: '0 0 6px',
                        letterSpacing: '-0.5px',
                    }}>مرحباً بعودتك</h1>
                    <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', margin: 0 }}>
                        سجّل دخولك للمتابعة
                    </p>
                </div>
                <form onSubmit={handleSubmit} noValidate>

                    <div className="field-reveal-2" style={{ marginBottom: '14px' }}>
                        <label style={{
                            display: 'block', fontSize: '11px', fontWeight: 700,
                            color: 'rgba(255,255,255,0.4)', marginBottom: '8px',
                            letterSpacing: '0.06em',
                        }}>البريد الإلكتروني</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="example@email.com"
                            className="login-input"
                            value={form.email}
                            onChange={handleChange}
                            autoComplete="email"
                        />
                    </div>

                    <div className="field-reveal-3" style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block', fontSize: '11px', fontWeight: 700,
                            color: 'rgba(255,255,255,0.4)', marginBottom: '8px',
                            letterSpacing: '0.06em',
                        }}>كلمة المرور</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            className="login-input"
                            value={form.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                        />
                    </div>

                    <div className="field-reveal-4">
                        <button type="submit" disabled={loading} className="login-btn" style={{ marginBottom: '12px' }}>
                            {loading ? <span className="loading-dots">جاري الدخول</span> : 'دخول'}
                        </button>
                    </div>
                </form>
                <div className="field-reveal-4" style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    margin: '4px 0 12px',
                }}>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>أو</span>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                </div>

                <div className="field-reveal-5">
                    <button
                        type="button"
                        className="ghost-btn"
                        style={{ marginBottom: '20px' }}
                        onClick={() => navigate('/forgot-password')}
                    >
                        نسيت كلمة المرور؟
                    </button>
                </div>

                <div className="field-reveal-5" style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>
                        ليس لديك حساب؟{' '}
                    </span>
                    <button
                        type="button"
                        style={{
                            background: 'none', border: 'none',
                            color: '#60A5FA', fontSize: '13px',
                            fontWeight: 700, cursor: 'pointer',
                            fontFamily: "'Tajawal', sans-serif",
                            transition: 'color 0.2s',
                        }}
                        onMouseOver={(e) => (e.target.style.color = '#93C5FD')}
                        onMouseOut={(e) => (e.target.style.color = '#60A5FA')}
                        onClick={() => navigate('/register')}
                    >
                        إنشاء حساب
                    </button>
                </div>
            </div>
        </div>
    );
}