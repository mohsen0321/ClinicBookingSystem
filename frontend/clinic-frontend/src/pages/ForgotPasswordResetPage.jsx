import { useState } from 'react';
import api from '../api/axiosInstance';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const StepIndicator = ({ current, color }) => (
    <div className="flex items-center justify-center gap-1.5 mb-5">
        {[1, 2, 3].map((s) => (
            <div
                key={s}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                    width: s === current ? '22px' : '8px',
                    background: s === current ? color : '#E5E7EB',
                }}
            />
        ))}
    </div>
);

export default function ForgotPasswordEmailPage() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return toast.error('الرجاء إدخال البريد الإلكتروني');
        try {
            await api.post(
                '/Password/forgot-password',
                `"${email}"`,
                { headers: { 'Content-Type': 'application/json' } }
            );
            toast.success('تم إرسال OTP إلى بريدك الإلكتروني');
            navigate('/forgot-password/otp', { state: { email } });
        } catch (err) {
            toast.error(err.response?.data || 'حدث خطأ أثناء إرسال البريد');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#FAEEDA] px-4">
            <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-xl" dir="rtl">

                <div className="bg-[#854F0B] px-8 pt-10 pb-8 text-center">
                    <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-7 h-7" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <rect x="3" y="11" width="18" height="11" rx="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            <circle cx="12" cy="16" r="1" fill="white" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-extrabold text-white mb-1">نسيت كلمة المرور؟</h1>
                    <p className="text-sm text-[#FAC775]">سنرسل رمز التحقق على بريدك</p>
                </div>

                <div className="bg-white px-8 py-7 rounded-t-2xl -mt-3">
                    <StepIndicator current={1} color="#854F0B" />

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block text-xs font-bold text-gray-400 mb-1.5">البريد الإلكتروني</label>
                            <input
                                type="email"
                                placeholder="example@email.com"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-[#854F0B] focus:bg-white transition"
                                dir="ltr"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 rounded-xl bg-[#854F0B] text-white font-bold text-base hover:bg-[#633806] transition"
                        >
                            إرسال رمز التحقق
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-400 mt-4">
                        <button
                            type="button"
                            className="text-[#854F0B] font-bold hover:underline"
                            onClick={() => navigate('/login')}
                        >
                            العودة لتسجيل الدخول
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}