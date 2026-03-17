namespace ClinicBooking.Api.DTOs.Appointment
{
    public class AppointmentReadDto
    {
        public int Id { get; set; }
        public string PatientFullName { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;
        public int ClinicId { get; set; }
        public string ClinicName { get; set; } = null!;
        public DateOnly AppointmentDate { get; set; }
        public TimeOnly AppointmentTime { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
