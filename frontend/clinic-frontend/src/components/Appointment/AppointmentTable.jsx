import { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';

import "./AppointmentTable.css";

function DeletePopup({ appointment, onConfirm, onCancel, loading }) {
    return (
        <div className="del-overlay" onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}>
            <div className="del-card">
                <div className="del-icon-wrap">
                    <svg width="28" height="28" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                </div>

                <h2 className="del-title">حذف الموعد</h2>
                <p className="del-subtitle">
                    هل أنت متأكد من حذف موعد{' '}
                    <span className="del-name">{appointment?.patientFullName}</span>
                    ؟<br />
                    لا يمكن التراجع عن هذا الإجراء.
                </p>

                <div className="del-actions">
                    <button className="del-cancel" onClick={onCancel} disabled={loading}>
                        إلغاء
                    </button>
                    <button className="del-confirm" onClick={onConfirm} disabled={loading}>
                        {loading ? 'جاري الحذف...' : 'نعم، احذف'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function AppointmentTable({ onAddClick }) {
    const [appointments, setAppointments] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const { user } = useAuth();

    const isDoctor = user?.role?.toLowerCase() === 'doctor';

    const load = async () => {
        try {
            const { data } = await api.get('/appointments');
            setAppointments(data);
        } catch {
            toast.error('خطأ في تحميل المواعيد');
        }
    };

    useEffect(() => { load(); }, []);

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await api.delete(`/appointments/${deleteTarget.id}`);
            toast.success('تم حذف الموعد بنجاح');
            setDeleteTarget(null);
            load();
        } catch {
            toast.error('خطأ في الحذف');
        } finally {
            setDeleting(false);
        }
    };

    const filtered = appointments
        .filter((a) => {
            const term = `${a.patientFullName} ${a.phoneNumber} ${a.clinicName}`.toLowerCase();
            return term.includes(search.toLowerCase());
        })
        .filter((a) => {
            if (filter === 'am') return a.appointmentTime < '12:00';
            if (filter === 'pm') return a.appointmentTime >= '12:00';
            return true;
        });

    const isAM = (time) => time < '12:00';

    return (
        <>


            {deleteTarget && (
                <DeletePopup
                    appointment={deleteTarget}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeleteTarget(null)}
                    loading={deleting}
                />
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }} dir="rtl">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
                        <input
                            type="text"
                            placeholder="بحث باسم المريض أو الهاتف أو العيادة..."
                            style={{
                                width: '100%',
                                paddingRight: '36px', paddingLeft: '14px',
                                paddingTop: '10px', paddingBottom: '10px',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                background: '#f8fafc',
                                fontSize: '13px', color: '#334155',
                                outline: 'none', fontFamily: 'inherit',
                                transition: 'border-color 0.2s, background 0.2s',
                            }}
                            onFocus={(e) => { e.target.style.borderColor = '#185FA5'; e.target.style.background = '#fff'; }}
                            onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <svg style={{ position: 'absolute', right: '11px', top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1', pointerEvents: 'none' }}
                            width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                        </svg>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                        {[['all', 'الكل'], ['am', 'AM'], ['pm', 'PM']].map(([val, label]) => (
                            <button
                                key={val}
                                onClick={() => setFilter(val)}
                                style={{
                                    padding: '8px 14px', borderRadius: '10px',
                                    border: `1px solid ${filter === val ? '#185FA5' : '#e2e8f0'}`,
                                    background: filter === val ? '#185FA5' : 'white',
                                    color: filter === val ? 'white' : '#94a3b8',
                                    fontSize: '13px', fontWeight: 700,
                                    cursor: 'pointer', fontFamily: 'inherit',
                                    transition: 'all 0.2s',
                                }}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                    <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                        <div style={{ minWidth: '500px' }}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '2fr 1fr 1.2fr 1fr 1fr 0.7fr',
                                background: '#185FA5',
                            }}>
                                {['المريض', 'الهاتف', 'العيادة', 'التاريخ', 'الوقت', 'إجراء'].map((h) => (
                                    <div key={h} style={{ padding: '11px 12px', fontSize: '12px', fontWeight: 700, color: 'white', textAlign: 'center' }}>
                                        {h}
                                    </div>
                                ))}
                            </div>
                            {filtered.length > 0 ? (
                                filtered.map((a, i) => (
                                    <div
                                        key={a.id}
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: '2fr 1fr 1.2fr 1fr 1fr 0.7fr',
                                            borderBottom: '1px solid #f1f5f9',
                                            background: i % 2 === 0 ? 'white' : '#f8fafc',
                                            transition: 'background 0.15s',
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.background = '#EFF6FF'}
                                        onMouseOut={(e) => e.currentTarget.style.background = i % 2 === 0 ? 'white' : '#f8fafc'}
                                    >
                                        <div style={{ padding: '11px 12px', fontSize: '13px', fontWeight: 600, color: '#1e3a5f', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {a.patientFullName}
                                        </div>
                                        <div style={{ padding: '11px 12px', fontSize: '12px', color: '#64748b', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', direction: 'ltr' }}>
                                            {a.phoneNumber}
                                        </div>
                                        <div style={{ padding: '11px 12px', fontSize: '12px', color: '#475569', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {a.clinicName}
                                        </div>
                                        <div style={{ padding: '11px 12px', fontSize: '12px', color: '#64748b', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', direction: 'ltr' }}>
                                            {a.appointmentDate}
                                        </div>
                                        <div style={{ padding: '11px 12px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{
                                                padding: '3px 10px', borderRadius: '20px',
                                                fontSize: '11px', fontWeight: 700,
                                                background: isAM(a.appointmentTime) ? '#E6F1FB' : '#FAEEDA',
                                                color: isAM(a.appointmentTime) ? '#0C447C' : '#633806',
                                            }}>
                                                {a.appointmentTime.slice(0, 5)}
                                            </span>
                                        </div>
                                        <div style={{ padding: '11px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <button
                                                onClick={() => setDeleteTarget(a)}
                                                style={{
                                                    padding: '5px 12px', borderRadius: '8px',
                                                    background: '#FCEBEB', color: '#A32D2D',
                                                    border: 'none', fontSize: '11px', fontWeight: 700,
                                                    cursor: 'pointer', fontFamily: 'inherit',
                                                    transition: 'all 0.15s',
                                                    display: 'flex', alignItems: 'center', gap: '4px',
                                                }}
                                                onMouseOver={(e) => { e.currentTarget.style.background = '#F7C1C1'; e.currentTarget.style.transform = 'scale(1.05)'; }}
                                                onMouseOut={(e) => { e.currentTarget.style.background = '#FCEBEB'; e.currentTarget.style.transform = 'scale(1)'; }}
                                            >
                                                <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                                    <polyline points="3 6 5 6 21 6" />
                                                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                                </svg>
                                                حذف
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8', background: 'white', fontSize: '14px', fontFamily: 'inherit' }}>
                                    <svg style={{ width: '40px', height: '40px', margin: '0 auto 12px', color: '#e2e8f0', display: 'block' }} fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17 12h-5v5h-2v-5H5v-2h5V5h2v5h5v2zm2-10H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                                    </svg>
                                    لا توجد مواعيد مطابقة
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {filtered.length > 0 && (
                    <p style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'left', margin: 0, fontFamily: 'inherit' }}>
                        إجمالي النتائج: <span style={{ fontWeight: 700, color: '#185FA5' }}>{filtered.length}</span>
                    </p>
                )}
            </div>
        </>
    );
}