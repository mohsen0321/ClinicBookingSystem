using ClinicBooking.Api.Data;
using ClinicBooking.Api.DTOs.Auth;
using ClinicBooking.Api.Helpers;
using ClinicBooking.Api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClinicBooking.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(ClinicContext db, IConfiguration config) : ControllerBase
    {

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if(await db.Users.AnyAsync(u=> u.Email == dto.Email || u.PhoneNumber == dto.PhoneNumber))
            {
                return BadRequest(".الايميل  أو رقم الهاتف مستخدم بالفعل");
            }

            var user = new User
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = Role.Patient
            };

            await db.Users.AddAsync(user);
            await db.SaveChangesAsync();
            var token = JwtHelper.GenerateToken(user, config);

            return Ok(new { token });

        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await db.Users.FirstOrDefaultAsync(u =>
               (dto.Email != null && u.Email == dto.Email) ||
               (dto.PhoneNumber != null && u.PhoneNumber == dto.PhoneNumber));

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized("بيانات الدخول غير صحيحة.");

            var token = JwtHelper.GenerateToken(user, config);
            return Ok(new { token, role = user.Role.ToString() });
        }



    }
}
