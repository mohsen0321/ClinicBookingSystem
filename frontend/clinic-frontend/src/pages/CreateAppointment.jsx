import AppointmentForm from '../components/Appointment/AppointmentForm';
import { useNavigate } from 'react-router-dom';

export default function CreateAppointment() {
    const navigate = useNavigate();

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-xl font-extrabold text-gray-800">حجز موعد جديد</h1>
                <p className="text-sm text-gray-400 mt-1">أدخل بيانات الموعد بالكامل</p>
            </div>

            <AppointmentForm
                onSuccess={() => navigate('/patient/appointments')}
                onCancel={() => navigate('/patient/appointments')}
            />
        </div>
    );
}