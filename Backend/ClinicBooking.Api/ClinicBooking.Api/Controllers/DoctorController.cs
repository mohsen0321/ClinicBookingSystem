using ClinicBooking.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClinicBooking.Api.Controllers
{
    [ApiController]
    [Route("api/doctor")]
    [Authorize(Roles = "Doctor")]
    public class DoctorController(ClinicContext db) : ControllerBase
    {
        // مثال: إحصائية عدد المواعيد لكل عيادة
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var stats = await db.Appointments
                .GroupBy(a => a.Clinic.Name)
                .Select(g => new { Clinic = g.Key, Count = g.Count() })
                .ToListAsync();

            return Ok(stats);
        }
    }
}
