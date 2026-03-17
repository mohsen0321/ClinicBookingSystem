using System.ComponentModel.DataAnnotations;

namespace ClinicBooking.Api.Models
{
    public class Clinic
    {
        [Key]
        public int Id { get; set; }
        [Required, MaxLength(100)]
        public string Name { get; set; } = null!;
    }
}
