using Microsoft.EntityFrameworkCore;
using ShopAoBackend.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. ĐÃ SỬA: Chuyển cấu hình kết nối sang MySQL (Pomelo) thay vì SQL Server
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// 2. BẬT CẤU HÌNH CORS (Bắt buộc để Next.js gọi được API)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJS", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // URL dự án Next.js của bạn
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// 3. Kích hoạt CORS (Đặt TRƯỚC UseAuthorization)
app.UseCors("AllowNextJS");

app.UseAuthorization();
app.MapControllers();

app.Run();
