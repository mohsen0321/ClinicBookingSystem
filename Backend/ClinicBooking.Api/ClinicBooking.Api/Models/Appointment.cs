using System.ComponentModel.DataAnnotations;

namespace ClinicBooking.Api.Models
{
    public class Appointment
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(200)]
        public string PatientFullName { get; set; } = null!;
        [Required, Phone]
        public string PhoneNumber { get; set; } = null!;
        [Required] public DateOnly AppointmentDate { get; set; }
        [Required] public TimeOnly AppointmentTime { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;


        public int ClinicId { get; set; }
        public Clinic Clinic { get; set; } = null!;

        public int PatientId { get; set; }
        public User Patient { get; set; } = null!;

    }
}
