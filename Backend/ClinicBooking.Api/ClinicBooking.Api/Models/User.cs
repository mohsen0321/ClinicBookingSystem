using System.ComponentModel.DataAnnotations;
using System.Data;

namespace ClinicBooking.Api.Models
{
    public enum Role { Patient, Doctor }
    public class User
    {
        [Key]
        public int Id { get; set; }
        [Required, MaxLength(50)]
        public string FirstName { get; set; } = null!;
        [Required, MaxLength(50)]
        public string LastName { get; set; } = null!;
        [Required, EmailAddress]
        public string Email { get; set; } = null!;
        [Required, Phone]
        public string PhoneNumber { get; set; } = null!;
        [Required]
        public string PasswordHash { get; set; } = null!;
        [Required]
        public Role Role { get; set; }

        //OTP 
        public string? OtpCode { get; set; }
        public DateTime? OtpExpiry { get; set; }


        public int OtpAttempts { get; set; } = 0;
        public DateTime? LastOtpRequest { get; set; }
    }
}
