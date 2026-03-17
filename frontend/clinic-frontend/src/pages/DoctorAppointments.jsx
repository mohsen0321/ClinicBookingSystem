import { useNavigate } from 'react-router-dom';
import AppointmentTable from '../components/Appointment/AppointmentTable';

export default function DoctorAppointments() {
    const navigate = useNavigate();

    return (
        <div>
            <div style={{ marginBottom: '20px' }}>
                <h1 style={{
                    fontSize: 'clamp(16px, 4vw, 20px)',
                    fontWeight: 900,
                    color: '#1e3a5f',
                    margin: 0,
                    fontFamily: "'Tajawal', sans-serif",
                }}>
                    جميع الحجوزات
                </h1>
                <p style={{
                    fontSize: '13px',
                    color: '#94a3b8',
                    marginTop: '4px',
                    margin: '4px 0 0',
                    fontFamily: "'Tajawal', sans-serif",
                }}>
                    إدارة ومتابعة جميع مواعيد المرضى
                </p>
            </div>

            <AppointmentTable
                onAddClick={() => navigate('/doctor/new')}
            />
        </div>
    );
}