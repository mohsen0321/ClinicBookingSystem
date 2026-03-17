import { useState } from 'react';
import api from '../api/axiosInstance';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import "./ForgotPasswordEmailPage.css";
export default function ForgotPasswordEmailPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return toast.error('الرجاء إدخال البريد الإلكتروني');
        setLoading(true);
        try {
            await api.post(
                '/Password/forgot-password',
                `"${email}"`,
                { headers: { 'Content-Type': 'application/json' } }
            );
            toast.success('تم إرسال OTP إلى بريدك الإلكتروني');
            navigate('/forgot-password/otp', { state: { email } });
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                err.response?.data?.title ||
                (typeof err.response?.data === 'string' ? err.response.data : null) ||
                'حدث خطأ أثناء إرسال البريد';
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
                background: 'linear-gradient(135deg, #1a1000 0%, #2a1a00 50%, #1a1000 100%)',
                fontFamily: "'Tajawal', sans-serif",
                overflow: 'hidden',
                position: 'relative',
                padding: '24px 16px',
            }}
        >

            {[
                { w: 300, x: '-80px', y: '-80px', dur: '9s', del: '0s' },
                { w: 200, x: '72%', y: '60%', dur: '11s', del: '2s' },
                { w: 130, x: '80%', y: '-20px', dur: '7s', del: '1s' },
                { w: 85, x: '15%', y: '80%', dur: '8s', del: '3s' },
            ].map((o, i) => (
                <div key={i} style={{
                    position: 'absolute',
                    width: o.w, height: o.w,
                    left: o.x, top: o.y,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(186,117,23,0.28) 0%, rgba(186,117,23,0) 70%)',
                    animation: `floatOrb ${o.dur} ease-in-out ${o.del} infinite`,
                    pointerEvents: 'none',
                }} />
            ))}

            {[
                { x: '20%', y: '12%', s: 4, del: '0s' },
                { x: '75%', y: '8%', s: 3, del: '0.6s' },
                { x: '88%', y: '35%', s: 5, del: '1.2s' },
                { x: '10%', y: '55%', s: 3, del: '0.9s' },
                { x: '60%', y: '88%', s: 4, del: '1.8s' },
                { x: '35%', y: '92%', s: 3, del: '0.3s' },
                { x: '92%', y: '70%', s: 4, del: '2.1s' },
                { x: '5%', y: '30%', s: 3, del: '1.5s' },
            ].map((s, i) => (
                <div key={i} style={{
                    position: 'absolute',
                    left: s.x, top: s.y,
                    width: s.s, height: s.s,
                    borderRadius: '50%',
                    background: '#FAC775',
                    animation: `twinkle 3s ease-in-out ${s.del} infinite`,
                    pointerEvents: 'none',
                }} />
            ))}

            {[
                { x: '7%', y: '10%', s: 16, op: 0.10, dur: '22s', rev: false },
                { x: '91%', y: '20%', s: 11, op: 0.07, dur: '18s', rev: true },
                { x: '13%', y: '78%', s: 13, op: 0.08, dur: '20s', rev: false },
                { x: '87%', y: '80%', s: 17, op: 0.06, dur: '25s', rev: true },
            ].map((c, i) => (
                <div key={i} style={{
                    position: 'absolute', left: c.x, top: c.y,
                    opacity: c.op, pointerEvents: 'none',
                    animation: `spin ${c.dur} linear infinite ${c.rev ? 'reverse' : ''}`,
                }}>
                    <svg width={c.s} height={c.s} viewBox="0 0 20 20">
                        <path d="M9 0h2v20H9zM0 9h20v2H0z" fill="#FAC775" />
                    </svg>
                </div>
            ))}

            <div style={{
                position: 'absolute', right: '8%', top: '20%',
                opacity: 0.06, pointerEvents: 'none',
                animation: 'floatEnvelope 6s ease-in-out infinite',
            }}>
                <svg width="60" height="60" fill="none" stroke="#FAC775" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
            </div>
            <div style={{
                position: 'absolute', left: '5%', bottom: '25%',
                opacity: 0.04, pointerEvents: 'none',
                animation: 'floatEnvelope 8s ease-in-out 1s infinite',
            }}>
                <svg width="45" height="45" fill="none" stroke="#FAC775" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
            </div>

            <div className="f1" style={{
                width: '100%',
                maxWidth: '390px',
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(40px)',
                WebkitBackdropFilter: 'blur(40px)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: '28px',
                padding: '38px 32px 32px',
                boxShadow: '0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,200,80,0.08)',
                position: 'relative',
                zIndex: 10,
            }}>

                <div className="f2" style={{ textAlign: 'center', marginBottom: '22px' }}>
                    <div style={{
                        width: '64px', height: '64px',
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, rgba(196,122,18,0.8), rgba(74,44,6,0.9))',
                        border: '1px solid rgba(250,199,117,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 14px',
                        animation: 'pulseAmber 3s ease infinite',
                        boxShadow: '0 8px 32px rgba(133,79,11,0.4)',
                    }}>
                        <svg width="30" height="30" fill="none" stroke="white" strokeWidth="1.8"
                            strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"
                            style={{ animation: 'floatEnvelope 4s ease-in-out infinite' }}>
                            <rect x="3" y="11" width="18" height="11" rx="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            <circle cx="12" cy="16" r="1" fill="white" />
                        </svg>
                    </div>
                    <h1 style={{
                        fontSize: '24px', fontWeight: 900,
                        color: 'white', margin: '0 0 6px',
                        letterSpacing: '-0.5px',
                    }}>نسيت كلمة المرور؟</h1>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                        سنرسل رمز التحقق على بريدك
                    </p>
                </div>

                <div className="f3" style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '22px' }}>
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="step-dot" style={{
                            width: s === 1 ? '22px' : '8px',
                            background: s === 1 ? '#EF9F27' : 'rgba(255,255,255,0.15)',
                        }} />
                    ))}
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="f4" style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block', fontSize: '11px', fontWeight: 700,
                            color: 'rgba(255,255,255,0.4)', marginBottom: '8px',
                            letterSpacing: '0.05em',
                        }}>البريد الإلكتروني</label>
                        <input
                            type="email"
                            placeholder="example@email.com"
                            className="amber-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                        />
                    </div>

                    <div className="f5">
                        <button type="submit" disabled={loading} className="amber-btn" style={{ marginBottom: '16px' }}>
                            {loading
                                ? <span className="loading-dots">جاري الإرسال</span>
                                : 'إرسال رمز التحقق'}
                        </button>
                    </div>
                </form>

                <div className="f5" style={{ textAlign: 'center' }}>
                    <button
                        type="button"
                        style={{
                            background: 'none', border: 'none',
                            color: '#EF9F27', fontSize: '13px',
                            fontWeight: 700, cursor: 'pointer',
                            fontFamily: "'Tajawal', sans-serif",
                            transition: 'color 0.2s',
                        }}
                        onMouseOver={(e) => (e.target.style.color = '#FAC775')}
                        onMouseOut={(e) => (e.target.style.color = '#EF9F27')}
                        onClick={() => navigate('/login')}
                    >
                        العودة لتسجيل الدخول
                    </button>
                </div>
            </div>
        </div>
    );
}