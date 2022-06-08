using NUnit.Framework;
using WebAPIDenemeEntity2.Controllers;
using WebAPIDenemeEntity2.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Nunit.WebAPIDenemeEntity2.Test
{
    public class UsersUnitTest
    {
        private MovieDBContext _context;
        private UsersController _usersController;
        private IOptions<JWTSettings> _jwtsettingsIO;
        private JWTSettings _jwtsettings;
        private string AccessToken;

        [SetUp]
        public void Setup()
        {
            var builder = WebApplication.CreateBuilder();
            var connectionString = builder.Configuration.GetConnectionString("MovieSiteDBTest");
            var dbContextOptions = new DbContextOptionsBuilder<MovieDBContext>().UseNpgsql(connectionString);
            _context = new MovieDBContext(dbContextOptions.Options);
            _context.Database.EnsureCreated();


            var jwtSection = builder.Configuration.GetSection("JWTSettings");
            builder.Services.Configure<JWTSettings>(jwtSection);
            _jwtsettings = jwtSection.Get<JWTSettings>();
            _jwtsettingsIO = Options.Create(_jwtsettings);

            _usersController = new UsersController(_context, _jwtsettingsIO);
        }
    }
}
