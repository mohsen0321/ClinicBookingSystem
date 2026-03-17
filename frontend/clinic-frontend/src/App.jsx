import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordEmailPage from './pages/ForgotPasswordEmailPage';
import ForgotPasswordOtpPage from './pages/ForgotPasswordOtpPage';
import ForgotPasswordResetPage from './pages/ForgotPasswordResetPage';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import MyAppointments from './pages/MyAppointments';
import CreateAppointment from './pages/CreateAppointment';
import DoctorAppointments from './pages/DoctorAppointments';
import ProtectedRoute from './routes/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/forgot-password" element={<ForgotPasswordEmailPage />} />
        <Route path="/forgot-password/otp" element={<ForgotPasswordOtpPage />} />
        <Route path="/forgot-password/reset" element={<ForgotPasswordResetPage />} />

        <Route element={<ProtectedRoute allowedRoles={['Patient']} />}>
          <Route path="/patient/*" element={<PatientDashboard />}>
            <Route index element={<Navigate to="appointments" replace />} />
            <Route path="appointments" element={<MyAppointments />} />
            <Route path="new" element={<CreateAppointment />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['Doctor']} />}>
          <Route path="/doctor/*" element={<DoctorDashboard />}>
            <Route index element={<Navigate to="appointments" replace />} />
            <Route path="appointments" element={<DoctorAppointments />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;