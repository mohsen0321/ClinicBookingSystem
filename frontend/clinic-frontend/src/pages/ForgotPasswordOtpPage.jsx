import { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';
import "./ForgotPasswordOtpPage.css";

function OtpStep({ onVerified, email }) {
    const [digits, setDigits] = useState(Array(6).fill(''));
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const inputsRef = useRef([]);

    const handleChange = (value, index) => {
        if (!/^\d?$/.test(value)) return;
        const updated = [...digits];
        updated[index] = value;
        setDigits(updated);
        if (value && index < 5) inputsRef.current[index + 1]?.focus();
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !digits[index] && index > 0)
            inputsRef.current[index - 1]?.focus();
    };

    const handleResend = async () => {
        setResending(true);
        try {
            await api.post('/Password/forgot-password', `"${email}"`,
                { headers: { 'Content-Type': 'application/json' } });
            toast.success('تم إعادة إرسال الرمز إلى بريدك');
            setDigits(Array(6).fill(''));
            inputsRef.current[0]?.focus();
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.title ||
                (typeof err.response?.data === 'string' ? err.response.data : null) ||
                'حدث خطأ أثناء إعادة الإرسال';
            toast.error(msg);
        } finally { setResending(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otp = digits.join('');
        if (otp.length < 6) return toast.error('الرجاء إدخال رمز OTP كاملاً');
        setLoading(true);
        try {
            await api.post('/Password/verify-otp', { otp },
                { headers: { 'Content-Type': 'application/json' } });
            onVerified(otp);
        } catch (err) {
            if (err.response?.status === 404) { onVerified(otp); return; }
            const msg = err.response?.data?.message || err.response?.data?.title ||
                (typeof err.response?.data === 'string' ? err.response.data : null) ||
                'رمز التحقق غير صحيح';
            toast.error(msg);
        } finally { setLoading(false); }
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <div className="f3" style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '10px', direction: 'ltr' }}>
                {digits.map((d, i) => (
                    <input
                        key={i}
                        ref={(el) => (inputsRef.current[i] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={d}
                        onChange={(e) => handleChange(e.target.value, i)}
                        onKeyDown={(e) => handleKeyDown(e, i)}
                        className={`rose-otp-input ${d ? 'filled' : ''}`}
                    />
                ))}
            </div>

            <div className="f4" style={{ textAlign: 'center', marginBottom: '18px' }}>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
                    لم يصلك الرمز؟{' '}
                </span>
                <button
                    type="button"
                    disabled={resending}
                    style={{
                        background: 'none', border: 'none',
                        color: '#F4C0D1', fontSize: '12px', fontWeight: 700,
                        cursor: 'pointer', fontFamily: "'Tajawal', sans-serif",
                        opacity: resending ? 0.4 : 1,
                    }}
                    onClick={handleResend}
                >
                    {resending ? 'جاري الإرسال...' : 'إعادة الإرسال'}
                </button>
            </div>

            <div className="f5">
                <button type="submit" disabled={loading} className="rose-btn">
                    {loading ? <span className="loading-dots">جاري التحقق</span> : 'تحقق من الرمز'}
                </button>
            </div>
        </form>
    );
}

function ResetStep({ otp }) {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newPassword) return toast.error('الرجاء إدخال كلمة المرور الجديدة');
        if (newPassword !== confirmPassword) return toast.error('كلمتا المرور غير متطابقتين');
        if (newPassword.length < 6) return toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        setLoading(true);
        try {
            await api.post('/Password/reset-password', { otp, newPassword },
                { headers: { 'Content-Type': 'application/json' } });
            setSuccess(true);
            setTimeout(() => {
                toast.success('تم إعادة تعيين كلمة المرور بنجاح');
                navigate('/login');
            }, 1200);
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.title ||
                (typeof err.response?.data === 'string' ? err.response.data : null) ||
                'رمز التحقق غير صحيح أو منتهي الصلاحية';
            toast.error(msg);
        } finally { setLoading(false); }
    };

    if (success) return (
        <div style={{ textAlign: 'center', padding: '20px 0', animation: 'successScale .5s cubic-bezier(.16,1,.3,1) both' }}>
            <svg width="64" height="64" viewBox="0 0 64 64" style={{ margin: '0 auto 14px' }}>
                <circle cx="32" cy="32" r="30" fill="rgba(153,53,86,0.2)" stroke="#F4C0D1" strokeWidth="2" />
                <path d="M20 32 l9 9 l15-16" fill="none" stroke="#F4C0D1" strokeWidth="3"
                    strokeLinecap="round" strokeLinejoin="round"
                    strokeDasharray="40" strokeDashoffset="0"
                    style={{ animation: 'checkDraw .4s ease .2s both' }} />
            </svg>
            <p style={{ color: 'white', fontWeight: 700, fontSize: '16px' }}>تم بنجاح!</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginTop: '4px' }}>جاري التحويل...</p>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} noValidate>
            <div className="f3" style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: '7px', letterSpacing: '0.05em' }}>
                    كلمة المرور الجديدة
                </label>
                <input type="password" placeholder="••••••••" className="rose-input"
                    value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <div className="f4" style={{ marginBottom: '22px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: '7px', letterSpacing: '0.05em' }}>
                    تأكيد كلمة المرور
                </label>
                <input type="password" placeholder="••••••••" className="rose-input"
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <div className="f5">
                <button type="submit" disabled={loading} className="rose-btn">
                    {loading ? <span className="loading-dots">جاري الحفظ</span> : 'حفظ كلمة المرور'}
                </button>
            </div>
        </form>
    );
}

export default function ForgotPasswordOtpPage() {
    const [step, setStep] = useState('otp');
    const [verifiedOtp, setVerifiedOtp] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    if (!email) { navigate('/forgot-password'); return null; }

    const isOtpStep = step === 'otp';

    return (
        <div
            dir="rtl"
            style={{
                minHeight: '100vh',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, #1a0812 0%, #2a0f1e 50%, #1a0812 100%)',
                fontFamily: "'Tajawal', sans-serif",
                overflow: 'hidden', position: 'relative',
                padding: '24px 16px',
            }}
        >

            {[
                { w: 290, x: '-70px', y: '-70px', dur: '9s', del: '0s' },
                { w: 190, x: '68%', y: '62%', dur: '11s', del: '2s' },
                { w: 130, x: '82%', y: '-20px', dur: '7s', del: '1s' },
                { w: 80, x: '12%', y: '78%', dur: '8s', del: '3s' },
            ].map((o, i) => (
                <div key={i} style={{
                    position: 'absolute', width: o.w, height: o.w,
                    left: o.x, top: o.y, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(153,53,86,0.3) 0%, transparent 70%)',
                    animation: `floatOrb ${o.dur} ease-in-out ${o.del} infinite`,
                    pointerEvents: 'none',
                }} />
            ))}

            {[
                { x: '18%', y: '9%', s: 4, del: '0s' },
                { x: '78%', y: '6%', s: 3, del: '0.7s' },
                { x: '90%', y: '30%', s: 5, del: '1.3s' },
                { x: '8%', y: '52%', s: 3, del: '1s' },
                { x: '65%', y: '88%', s: 4, del: '1.9s' },
                { x: '32%', y: '94%', s: 3, del: '0.4s' },
                { x: '93%', y: '68%', s: 4, del: '2.2s' },
                { x: '4%', y: '28%', s: 3, del: '1.6s' },
                { x: '50%', y: '4%', s: 3, del: '0.9s' },
            ].map((s, i) => (
                <div key={i} style={{
                    position: 'absolute', left: s.x, top: s.y,
                    width: s.s, height: s.s, borderRadius: '50%',
                    background: '#F4C0D1',
                    animation: `twinkle 3s ease-in-out ${s.del} infinite`,
                    pointerEvents: 'none',
                }} />
            ))}

            {[
                { x: '7%', y: '10%', s: 15, op: 0.10, dur: '22s', rev: false },
                { x: '90%', y: '18%', s: 11, op: 0.07, dur: '17s', rev: true },
                { x: '14%', y: '80%', s: 13, op: 0.08, dur: '20s', rev: false },
                { x: '88%', y: '82%', s: 16, op: 0.06, dur: '26s', rev: true },
            ].map((c, i) => (
                <div key={i} style={{
                    position: 'absolute', left: c.x, top: c.y,
                    opacity: c.op, pointerEvents: 'none',
                    animation: `spin ${c.dur} linear infinite ${c.rev ? 'reverse' : ''}`,
                }}>
                    <svg width={c.s} height={c.s} viewBox="0 0 20 20">
                        <path d="M9 0h2v20H9zM0 9h20v2H0z" fill="#ED93B1" />
                    </svg>
                </div>
            ))}

            {[
                { x: '3%', y: '42%', s: 28, op: 0.05 },
                { x: '93%', y: '48%', s: 20, op: 0.04 },
            ].map((d, i) => (
                <div key={i} style={{
                    position: 'absolute', left: d.x, top: d.y,
                    opacity: d.op, pointerEvents: 'none',
                    animation: `floatOrb ${10 + i * 2}s ease-in-out ${i}s infinite`,
                }}>
                    <svg width={d.s} height={d.s} viewBox="0 0 40 40">
                        <polygon points="20,2 38,20 20,38 2,20"
                            fill="none" stroke="#ED93B1" strokeWidth="2" />
                    </svg>
                </div>
            ))}

            <div className="f1" style={{
                width: '100%', maxWidth: '400px',
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(40px)',
                WebkitBackdropFilter: 'blur(40px)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: '28px',
                padding: '38px 32px 32px',
                boxShadow: '0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,180,210,0.08)',
                position: 'relative', zIndex: 10,
            }}>

                <div className="f2" style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <div style={{
                        width: '62px', height: '62px', borderRadius: '18px',
                        background: 'linear-gradient(135deg, rgba(196,69,110,0.8), rgba(90,30,51,0.9))',
                        border: '1px solid rgba(244,192,209,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 13px',
                        animation: 'pulseRose 3s ease infinite',
                        boxShadow: '0 8px 32px rgba(153,53,86,0.4)',
                    }}>
                        {isOtpStep ? (
                            <svg width="28" height="28" fill="white" viewBox="0 0 24 24">
                                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                            </svg>
                        ) : (
                            <svg width="28" height="28" fill="none" stroke="white" strokeWidth="1.8"
                                strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                <rect x="3" y="11" width="18" height="11" rx="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                <circle cx="12" cy="16" r="1" fill="white" />
                            </svg>
                        )}
                    </div>
                    <h1 style={{
                        fontSize: '23px', fontWeight: 900, color: 'white',
                        margin: '0 0 5px', letterSpacing: '-0.5px',
                    }}>
                        {isOtpStep ? 'أدخل رمز التحقق' : 'كلمة مرور جديدة'}
                    </h1>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                        {isOtpStep ? 'تم الإرسال إلى بريدك الإلكتروني' : 'اختر كلمة مرور قوية وآمنة'}
                    </p>
                </div>

                <div className="f2" style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '22px' }}>
                    {[1, 2, 3].map((s) => (
                        <div key={s} style={{
                            height: '6px', borderRadius: '3px',
                            transition: 'all 0.4s cubic-bezier(.16,1,.3,1)',
                            width: s === (isOtpStep ? 2 : 3) ? '22px' : '8px',
                            background: s === (isOtpStep ? 2 : 3)
                                ? '#D4537E'
                                : s < (isOtpStep ? 2 : 3)
                                    ? 'rgba(212,83,126,0.4)'
                                    : 'rgba(255,255,255,0.12)',
                        }} />
                    ))}
                </div>

                {isOtpStep ? (
                    <OtpStep onVerified={(otp) => { setVerifiedOtp(otp); setStep('reset'); }} email={email} />
                ) : (
                    <ResetStep otp={verifiedOtp} />
                )}

                <div className="f6" style={{ textAlign: 'center', marginTop: '14px' }}>
                    <button
                        type="button"
                        style={{
                            background: 'none', border: 'none',
                            color: '#ED93B1', fontSize: '13px',
                            fontWeight: 700, cursor: 'pointer',
                            fontFamily: "'Tajawal', sans-serif",
                            transition: 'color 0.2s',
                        }}
                        onMouseOver={(e) => (e.target.style.color = '#F4C0D1')}
                        onMouseOut={(e) => (e.target.style.color = '#ED93B1')}
                        onClick={() => isOtpStep ? navigate('/forgot-password') : setStep('otp')}
                    >
                        {isOtpStep ? 'العودة لإدخال البريد' : 'تغيير رمز OTP'}
                    </button>
                </div>
            </div>
        </div>
    );
}