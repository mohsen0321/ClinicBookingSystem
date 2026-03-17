using System.ComponentModel.DataAnnotations;

namespace ClinicBooking.Api.DTOs.Auth
{
    public class LoginDto
    {
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }

        [Required] public string Password { get; set; } = null!;
    }
}
