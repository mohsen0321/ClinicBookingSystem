import { useNavigate } from 'react-router-dom';
import AppointmentTable from '../components/Appointment/AppointmentTable';

export default function MyAppointments() {
    const navigate = useNavigate();

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-xl font-extrabold text-gray-800">حجوزاتي</h1>
                <p className="text-sm text-gray-400 mt-1">جميع مواعيدك المسجلة</p>
            </div>

            <AppointmentTable
                onAddClick={() => navigate('/patient/new')}
            />
        </div>
    );
}