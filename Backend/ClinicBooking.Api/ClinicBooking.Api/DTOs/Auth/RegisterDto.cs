using System.ComponentModel.DataAnnotations;

namespace ClinicBooking.Api.DTOs.Auth
{
    public class RegisterDto
    {
        [Required, MaxLength(50)] 
        public string FirstName { get; set; } = null!;
        [Required, MaxLength(50)] 
        public string LastName { get; set; } = null!;
        [Required, EmailAddress] 
        public string Email { get; set; } = null!;
        [Required, Phone] 
        public string PhoneNumber { get; set; } = null!;
        [Required, MinLength(6)] 
        public string Password { get; set; } = null!;
        [Required, Compare("Password")] 
        public string ConfirmPassword { get; set; } = null!;
    }
}
