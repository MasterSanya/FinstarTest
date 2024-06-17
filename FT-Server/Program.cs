using Microsoft.EntityFrameworkCore;
using FinstarTest.Data;

var builder = WebApplication.CreateBuilder(args);

// Настройка Kestrel для использования HTTPS и HTTP
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5047); // HTTP
    options.ListenAnyIP(7212, listenOptions => listenOptions.UseHttps()); // HTTPS
});

// Добавление сервисов в контейнер
builder.Services.AddControllers();

// Настройка контекста базы данных
builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Настройка CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins("http://localhost:3000")
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Настройка конвейера обработки HTTP-запросов
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

// Включение CORS
app.UseCors();

app.MapControllers();

// Автоматическое применение миграций
using (var serviceScope = app.Services.CreateScope())
{
    var context = serviceScope.ServiceProvider.GetRequiredService<DataContext>();
    context.Database.Migrate();
}

app.Run();
