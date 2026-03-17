using System.ComponentModel.DataAnnotations;

namespace ClinicBooking.Api.DTOs.Appointment
{
    public class AppointmentUpdateDto
    {
        [Required] 
        public int ClinicId { get; set; }

        [Required, MaxLength(200)] 
        public string PatientFullName { get; set; } = null!;
        [Required, Phone] 
        public string PhoneNumber { get; set; } = null!;

        [Required] 
        public DateOnly AppointmentDate { get; set; }
        [Required] 
        public TimeOnly AppointmentTime { get; set; }
    }
}
