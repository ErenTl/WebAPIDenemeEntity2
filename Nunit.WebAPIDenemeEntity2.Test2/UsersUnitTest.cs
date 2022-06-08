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

        [Test]
        public void Users_Controller_Login_Access_Token_Test()
        {
            var usersController = new UsersController(_context, _jwtsettingsIO);
            var user1 = _context.Users.FirstOrDefault();

            var userKey = usersController.Login(user1);
            Console.WriteLine(userKey.Result.Value.AccessToken);
            Assert.IsNotEmpty(userKey.Result.Value.AccessToken);
        }

        [Test]
        public async Task Users_Controller_PostUser_Test()
        {
            var usersController = new UsersController (_context, _jwtsettingsIO);
            
            var user = new User();
            user.UserName = DateTime.UtcNow.ToString();
            user.Permission = 1;
            user.PswSha = "f9c1aa3fc037608ec954aceb21c1f7d307cb1f0bfc35ec92efda44576391536b"; // decrypted: "eren"

            await usersController.PostUser(user);

            var exist = _context.Users.Any(e => e.UserName == user.UserName);
            Assert.IsTrue(exist);
        }
    }
}
