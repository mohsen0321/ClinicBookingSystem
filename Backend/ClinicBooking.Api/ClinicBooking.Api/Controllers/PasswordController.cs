using ClinicBooking.Api.Data;
using ClinicBooking.Api.Helpers;
using ClinicBooking.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace ClinicBooking.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PasswordController : ControllerBase
    {
        private readonly ClinicContext _db;
        private readonly EmailService _emailService;

        public PasswordController(ClinicContext db, EmailService emailService)
        {
            _db = db;
            _emailService = emailService;
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] string email)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null) return NotFound("الإيميل غير موجود");

            if (user.LastOtpRequest != null &&
                DateTime.UtcNow < user.LastOtpRequest.Value.AddMinutes(1))
            {
                return BadRequest("يجب الانتظار دقيقة قبل طلب كود جديد");
            }

            var otp = RandomNumberGenerator.GetInt32(100000, 999999).ToString();

            user.OtpCode = otp;
            user.OtpExpiry = DateTime.UtcNow.AddMinutes(5);
            user.OtpAttempts = 0;
            user.LastOtpRequest = DateTime.UtcNow;

            await _db.SaveChangesAsync();

            var message = $@"
            مرحباً {user.FirstName}

            رمز التحقق الخاص بك هو:

            {otp}

            هذا الرمز صالح لمدة 5 دقائق فقط.

            powered by Eng/ Mohsen Khaled
            ";

            _emailService.SendEmail(user.Email, "رمز إعادة تعيين كلمة المرور", message);

            return Ok("تم إرسال رمز التحقق إلى بريدك الإلكتروني");
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.OtpCode == dto.Otp);

            if (user == null)
                return BadRequest("OTP غير صحيح");

            if (user.OtpExpiry < DateTime.UtcNow)
                return BadRequest("انتهت صلاحية OTP");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);

            user.OtpCode = null;
            user.OtpExpiry = null;
            user.OtpAttempts = 0;

            await _db.SaveChangesAsync();

            return Ok("تم تغيير كلمة المرور بنجاح");
        }
    }

    // DTO
    public class ResetPasswordDto
    {
        public string Otp { get; set; } = null!;
        public string NewPassword { get; set; } = null!;
    }
}