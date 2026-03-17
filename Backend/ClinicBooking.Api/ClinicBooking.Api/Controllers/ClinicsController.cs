using ClinicBooking.Api.Data;
using ClinicBooking.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClinicBooking.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClinicsController(ClinicContext db) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Clinic>>> GetAll()
            => Ok(await db.Clinics.ToListAsync());

        [HttpPost]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> Create([FromBody] Clinic clinic)
        {
            db.Clinics.Add(clinic);
            await db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAll), new { id = clinic.Id }, clinic);
        }
    }


 }

