using ClinicBooking.Api.Data;
using ClinicBooking.Api.DTOs.Appointment;
using ClinicBooking.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
//using ClinicBooking.Api.Models;
//using System.Security.Claims;               
using System.IdentityModel.Tokens.Jwt;
namespace ClinicBooking.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]   

    public class AppointmentsController: ControllerBase
    {
        private readonly ClinicContext _db;

        public AppointmentsController(ClinicContext db)
        {
            _db = db;
        }
        private int UserId
        {
            get
            {
                var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
                return claim != null ? int.Parse(claim.Value) : 0;
            }
        }
        private bool IsDoctor => User.IsInRole("Doctor");

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppointmentReadDto>>> Get()
        {
            var query = _db.Appointments.Include(a => a.Clinic).AsQueryable();

            if (!IsDoctor) 
                query = query.Where(a => a.PatientId == UserId);


            var list = await query.Select(a => new AppointmentReadDto
            {
                Id = a.Id,
                PatientFullName = a.PatientFullName,
                PhoneNumber = a.PhoneNumber,
                ClinicId = a.ClinicId,
                ClinicName = a.Clinic.Name,
                AppointmentDate = a.AppointmentDate,
                AppointmentTime = a.AppointmentTime,
                CreatedAt = a.CreatedAt
            }).ToListAsync();

            return Ok(list);

        }

        [HttpPost]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> Create([FromBody] AppointmentCreateDto dto)
        {
            bool exists = await _db.Appointments.AnyAsync(a =>
                a.ClinicId == dto.ClinicId &&
                a.AppointmentDate == dto.AppointmentDate &&
                a.AppointmentTime == dto.AppointmentTime);


            if (exists)
                return Conflict("هذا الموعد محجوز بالفعل.");

            var appointment = new Appointment
            {
                PatientId = UserId,
                ClinicId = dto.ClinicId,
                PatientFullName = dto.PatientFullName,
                PhoneNumber = dto.PhoneNumber,
                AppointmentDate = dto.AppointmentDate,
                AppointmentTime = dto.AppointmentTime
            };
            _db.Appointments.Add(appointment);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = appointment.Id }, appointment);

        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] AppointmentUpdateDto dto)
        {
            var appointment = await _db.Appointments.FindAsync(id);
            if (appointment == null) return NotFound();
            if (!IsDoctor && appointment.PatientId != UserId)
                return Forbid();
            
            bool conflict = await _db.Appointments.AnyAsync(a =>
                a.Id != id &&
                a.ClinicId == dto.ClinicId &&
                a.AppointmentDate == dto.AppointmentDate &&
                a.AppointmentTime == dto.AppointmentTime);
            if (conflict)
                return Conflict("هذا الموعد محجوز بالفعل.");
            appointment.ClinicId = dto.ClinicId;
            appointment.PatientFullName = dto.PatientFullName;
            appointment.PhoneNumber = dto.PhoneNumber;
            appointment.AppointmentDate = dto.AppointmentDate;
            appointment.AppointmentTime = dto.AppointmentTime;
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var appointment = await _db.Appointments.FindAsync(id);
            if (appointment == null) return NotFound();
            
            if (!IsDoctor && appointment.PatientId != UserId)
                return Forbid();
            _db.Appointments.Remove(appointment);
            await _db.SaveChangesAsync();
            return NoContent();
        }

    }
}
