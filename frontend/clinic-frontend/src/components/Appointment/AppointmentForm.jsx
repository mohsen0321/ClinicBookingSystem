import { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { toast } from 'react-toastify';

export default function AppointmentForm({ onSuccess, onCancel, initialData = null }) {
    const [clinics, setClinics] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        clinicId: '',
        patientFullName: '',
        phoneNumber: '',
        appointmentDate: '',
        appointmentTime: '',
    });

    const isEdit = !!initialData;
    const headerColor = isEdit ? '#854F0B' : '#185FA5';
    const subColor = isEdit ? '#FAC775' : '#B5D4F4';

    useEffect(() => {
        api.get('/clinics')
            .then((r) => setClinics(r.data))
            .catch(() => toast.error('حدث خطأ أثناء جلب العيادات'));

        if (initialData) {
            setForm({
                ...initialData,
                appointmentTime: initialData.appointmentTime.slice(0, 5),
            });
        }
    }, [initialData]);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const [hours, minutes] = form.appointmentTime.split(':');
            const payload = {
                clinicId: Number(form.clinicId),
                patientFullName: form.patientFullName,
                phoneNumber: form.phoneNumber,
                appointmentDate: form.appointmentDate,
                appointmentTime: `${hours}:${minutes}:00`,
            };

            if (isEdit) {
                await api.put(`/appointments/${initialData.id}`, payload);
                toast.success('تم تعديل الموعد');
            } else {
                await api.post('/appointments', payload);
                toast.success('تم حجز الموعد');
            }
            onSuccess();
        } catch (err) {
            toast.error(err.response?.data || 'حدث خطأ');
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        'w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:bg-white transition';

    return (
        <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg max-w-lg mx-auto" dir="rtl">
            <div className="px-7 pt-7 pb-6 flex items-center gap-4" style={{ background: headerColor }}>
                <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    {isEdit ? (
                        <svg className="w-5 h-5 text-white" fill="white" viewBox="0 0 24 24">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm17.71-10.21a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 text-white" fill="white" viewBox="0 0 24 24">
                            <path d="M17 12h-5v5h-2v-5H5v-2h5V5h2v5h5z" />
                        </svg>
                    )}
                </div>
                <div>
                    <h2 className="text-lg font-extrabold text-white">
                        {isEdit ? 'تعديل الموعد' : 'حجز موعد جديد'}
                    </h2>
                    <p className="text-sm mt-0.5" style={{ color: subColor }}>
                        {isEdit ? 'قم بتعديل بيانات الموعد' : 'أدخل بيانات الموعد بالكامل'}
                    </p>
                </div>
            </div>

            <div className="bg-white px-7 py-6">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1.5">العيادة</label>
                        <select
                            name="clinicId"
                            className={inputClass}
                            value={form.clinicId}
                            onChange={handleChange}
                            style={{ '--tw-ring-color': headerColor }}
                            onFocus={(e) => (e.target.style.borderColor = headerColor)}
                            onBlur={(e) => (e.target.style.borderColor = '')}
                            required
                        >
                            <option value="">اختر العيادة</option>
                            {clinics.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1.5">الاسم الكامل للمريض</label>
                        <input
                            name="patientFullName"
                            placeholder="محمد أحمد السيد"
                            className={inputClass}
                            value={form.patientFullName}
                            onChange={handleChange}
                            onFocus={(e) => (e.target.style.borderColor = headerColor)}
                            onBlur={(e) => (e.target.style.borderColor = '')}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1.5">رقم الهاتف</label>
                        <input
                            name="phoneNumber"
                            placeholder="05xxxxxxxx"
                            className={inputClass}
                            dir="ltr"
                            value={form.phoneNumber}
                            onChange={handleChange}
                            onFocus={(e) => (e.target.style.borderColor = headerColor)}
                            onBlur={(e) => (e.target.style.borderColor = '')}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1.5">التاريخ</label>
                            <input
                                name="appointmentDate"
                                type="date"
                                className={inputClass}
                                value={form.appointmentDate}
                                onChange={handleChange}
                                onFocus={(e) => (e.target.style.borderColor = headerColor)}
                                onBlur={(e) => (e.target.style.borderColor = '')}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1.5">الوقت</label>
                            <input
                                name="appointmentTime"
                                type="time"
                                className={inputClass}
                                value={form.appointmentTime}
                                onChange={handleChange}
                                onFocus={(e) => (e.target.style.borderColor = headerColor)}
                                onBlur={(e) => (e.target.style.borderColor = '')}
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl text-white font-bold text-base transition disabled:opacity-60 mt-1"
                        style={{ background: headerColor }}
                    >
                        {loading ? 'جاري الحفظ...' : isEdit ? 'حفظ التعديلات' : 'حجز الموعد'}
                    </button>

                    {onCancel && (
                        <p className="text-center text-sm text-gray-400">
                            أو{' '}
                            <button
                                type="button"
                                className="font-bold hover:underline"
                                style={{ color: headerColor }}
                                onClick={onCancel}
                            >
                                إلغاء
                            </button>
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}