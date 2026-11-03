using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopAoBackend.Data;
using ShopAoBackend.Models;

namespace ShopAoBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        // 1. API ĐĂNG KÝ: api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            // Kiểm tra email trùng lặp trong DB (Query DB)
            var userExists = await _context.Users.AnyAsync(u => u.Email == model.Email);
            if (userExists)
            {
                return BadRequest(new { message = "Email này đã được đăng ký!" });
            }

            // Tạo User mới (Trong thực tế nên băm mật khẩu bằng BCrypt)
            var newUser = new User
            {
                Username = model.Username,
                Email = model.Email,
                PasswordHash = model.Password // Tạm thời để nguyên để test, sau này nên dùng thư viện BCrypt.Net để hash
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync(); // Lưu thông tin xuống Database thật

            return Ok(new { message = "Đăng ký tài khoản thành công!" });
        }

        // 2. API ĐĂNG NHẬP: api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            // Tìm kiếm User trong DB theo Email (Query DB)
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);

            // Kiểm tra user có tồn tại và mật khẩu có khớp không
            if (user == null || user.PasswordHash != model.Password)
            {
                return Unauthorized(new { message = "Email hoặc mật khẩu không chính xác!" });
            }

            // Đăng nhập thành công, trả về thông tin user an toàn cho Client
            return Ok(new
            {
                message = "Đăng nhập thành công!",
                user = new { id = user.Id, email = user.Email, username = user.Username }
            });
        }
    }

    // Các Object nhận dữ liệu (DTO) gửi lên từ Next.js
    public class RegisterDto
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class LoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
