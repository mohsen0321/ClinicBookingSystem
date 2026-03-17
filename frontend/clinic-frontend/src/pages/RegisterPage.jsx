import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import "./RegisterPage.css";


export default function RegisterPage() {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword)
            return toast.error('كلمتا المرور غير متطابقتين');
        if (form.password.length < 6)
            return toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');

        setLoading(true);
        try {
            const { data } = await api.post('/auth/register', form);
            login(data.token, 'Patient');
            toast.success('تم إنشاء الحساب بنجاح');
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                err.response?.data?.title ||
                (typeof err.response?.data === 'string' ? err.response.data : null) ||
                'خطأ في التسجيل';
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
                background: 'linear-gradient(135deg, #071a0f 0%, #0a2818 50%, #071a0f 100%)',
                fontFamily: "'Tajawal', sans-serif",
                overflow: 'hidden',
                position: 'relative',
                padding: '24px 16px',
            }}
        >

            {[
                { w: 300, l: '-70px', t: '-70px', dur: '9s', del: '0s' },
                { w: 200, r: '-50px', b: '15%', dur: '11s', del: '2s' },
                { w: 140, r: '15%', t: '-20px', dur: '7s', del: '1s' },
                { w: 90, l: '20%', b: '10%', dur: '8s', del: '3s' },
            ].map((o, i) => (
                <div key={i} style={{
                    position: 'absolute',
                    width: o.w, height: o.w,
                    left: o.l, right: o.r,
                    top: o.t, bottom: o.b,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(15,110,86,0.3) 0%, rgba(15,110,86,0) 70%)',
                    animation: `floatOrb ${o.dur} ease-in-out infinite`,
                    animationDelay: o.del,
                    pointerEvents: 'none',
                }} />
            ))}

            {[
                { x: '7%', y: '10%', s: 16, op: 0.12, del: '0s', rev: false },
                { x: '91%', y: '18%', s: 11, op: 0.08, del: '0.8s', rev: true },
                { x: '13%', y: '78%', s: 13, op: 0.10, del: '1.5s', rev: false },
                { x: '87%', y: '82%', s: 18, op: 0.07, del: '2.2s', rev: true },
                { x: '52%', y: '4%', s: 9, op: 0.09, del: '0.4s', rev: false },
            ].map((c, i) => (
                <div key={i} style={{
                    position: 'absolute',
                    left: c.x, top: c.y,
                    opacity: c.op,
                    pointerEvents: 'none',
                    animation: `spin ${c.rev ? '18s' : '22s'} linear ${c.del} infinite ${c.rev ? 'reverse' : ''}`,
                }}>
                    <svg width={c.s} height={c.s} viewBox="0 0 20 20">
                        <path d="M9 0h2v20H9zM0 9h20v2H0z" fill="white" />
                    </svg>
                </div>
            ))}

            {[
                { x: '3%', y: '45%', s: 40, op: 0.05 },
                { x: '94%', y: '50%', s: 30, op: 0.04 },
            ].map((h, i) => (
                <div key={i} style={{
                    position: 'absolute', left: h.x, top: h.y,
                    opacity: h.op, pointerEvents: 'none',
                    animation: `floatOrb 12s ease-in-out ${i}s infinite`,
                }}>
                    <svg width={h.s} height={h.s} viewBox="0 0 100 100">
                        <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
                            fill="none" stroke="white" strokeWidth="4" />
                    </svg>
                </div>
            ))}

            <div className="f1" style={{
                width: '100%',
                maxWidth: '440px',
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(40px)',
                WebkitBackdropFilter: 'blur(40px)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: '28px',
                padding: '36px 32px 32px',
                boxShadow: '0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
                position: 'relative',
                zIndex: 10,
            }}>
                <div className="f2" style={{ textAlign: 'center', marginBottom: '22px' }}>
                    <div style={{
                        width: '60px', height: '60px',
                        borderRadius: '18px',
                        background: 'linear-gradient(135deg, rgba(26,138,106,0.8), rgba(8,64,50,0.8))',
                        border: '1px solid rgba(29,158,117,0.4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 14px',
                        animation: 'pulseGreen 3s ease infinite',
                        boxShadow: '0 8px 32px rgba(15,110,86,0.35)',
                    }}>
                        <svg width="28" height="28" fill="white" viewBox="0 0 24 24">
                            <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                    </div>
                    <h1 style={{
                        fontSize: '24px', fontWeight: 900,
                        color: 'white', margin: '0 0 5px',
                        letterSpacing: '-0.5px',
                    }}>إنشاء حساب مريض</h1>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                        أدخل بياناتك للبدء
                    </p>
                </div>

                <form onSubmit={handleSubmit} noValidate>

                    <div className="f3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.38)', marginBottom: '6px', letterSpacing: '0.05em' }}>
                                الاسم الأول
                            </label>
                            <input
                                name="firstName"
                                placeholder="محمد"
                                className="reg-input"
                                value={form.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.38)', marginBottom: '6px', letterSpacing: '0.05em' }}>
                                اسم العائلة
                            </label>
                            <input
                                name="lastName"
                                placeholder="أحمد"
                                className="reg-input"
                                value={form.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="f4" style={{ marginBottom: '12px' }}>
                        <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.38)', marginBottom: '6px', letterSpacing: '0.05em' }}>
                            البريد الإلكتروني
                        </label>
                        <input
                            name="email"
                            type="email"
                            placeholder="example@email.com"
                            className="reg-input"
                            style={{ direction: 'ltr' }}
                            value={form.email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="f5" style={{ marginBottom: '12px' }}>
                        <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.38)', marginBottom: '6px', letterSpacing: '0.05em' }}>
                            رقم الهاتف
                        </label>
                        <input
                            name="phoneNumber"
                            placeholder="05xxxxxxxx"
                            className="reg-input"
                            style={{ direction: 'ltr' }}
                            value={form.phoneNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="f6" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '22px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.38)', marginBottom: '6px', letterSpacing: '0.05em' }}>
                                كلمة المرور
                            </label>
                            <input
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                className="reg-input"
                                style={{ direction: 'ltr' }}
                                value={form.password}
                                onChange={handleChange}
                                autoComplete="new-password"
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.38)', marginBottom: '6px', letterSpacing: '0.05em' }}>
                                تأكيد كلمة المرور
                            </label>
                            <input
                                name="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                className="reg-input"
                                style={{ direction: 'ltr' }}
                                value={form.confirmPassword}
                                onChange={handleChange}
                                autoComplete="new-password"
                                required
                            />
                        </div>
                    </div>

                    <div className="f7">
                        <button type="submit" disabled={loading} className="reg-btn" style={{ marginBottom: '18px' }}>
                            {loading ? <span className="loading-dots">جاري الإنشاء</span> : 'إنشاء الحساب'}
                        </button>
                    </div>
                </form>

                <div className="f8" style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>لديك حساب؟ </span>
                    <button
                        type="button"
                        style={{
                            background: 'none', border: 'none',
                            color: '#4ade80', fontSize: '13px',
                            fontWeight: 700, cursor: 'pointer',
                            fontFamily: "'Tajawal', sans-serif",
                            transition: 'color 0.2s',
                        }}
                        onMouseOver={(e) => (e.target.style.color = '#86efac')}
                        onMouseOut={(e) => (e.target.style.color = '#4ade80')}
                        onClick={() => navigate('/login')}
                    >
                        سجّل الدخول
                    </button>
                </div>
            </div>
        </div>
    );
}