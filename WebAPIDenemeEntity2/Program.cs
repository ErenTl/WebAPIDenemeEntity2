using Microsoft.EntityFrameworkCore;
using WebAPIDenemeEntity2.Models;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        builder =>
        {
            //builder.WithOrigins("http://localhost:3000");
            builder.AllowAnyHeader().AllowAnyMethod()
            .WithOrigins("http://localhost:3000", "https://localhost:3000");
        });
});
// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddMvc(option => option.EnableEndpointRouting = false)
                .SetCompatibilityVersion(Microsoft.AspNetCore.Mvc.CompatibilityVersion.Version_3_0)
                .AddNewtonsoftJson(opt => opt.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);

var connectionString = builder.Configuration.GetConnectionString("MovieSiteDB");
builder.Services.AddDbContext<MovieDBContext>(options => options.UseNpgsql(connectionString));

//builder.Services.AddControllers(
  //  options => options.SuppressImplicitRequiredAttributeForNonNullableReferenceTypes = true);

var app = builder.Build();

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);





// Configure the HTTP request pipeline.

app.UseHttpsRedirection();

app.UseCors();


app.UseAuthorization();

app.MapControllers();

app.Run();
