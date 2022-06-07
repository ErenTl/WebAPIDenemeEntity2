using NUnit.Framework;
using WebAPIDenemeEntity2.Controllers;
using WebAPIDenemeEntity2.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using System.Linq;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System;
using System.Threading.Tasks;
using System.Threading;
using Microsoft.AspNetCore.Mvc;

namespace Nunit.WebAPIDenemeEntity2.Test
{
    public class Tests
    {

        private MovieDBContext _context;
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

            //signing the token
            //create token handler
            var tokenHandler = new JwtSecurityTokenHandler();
            //get the key from appsettings via JWTSettings
            var key = Encoding.ASCII.GetBytes(_jwtsettings.SecretKey);
            //writing token's info
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, "Deneme"),
                    new Claim(ClaimTypes.Role, "1"),
                }),
                Expires = DateTime.UtcNow.AddMonths(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            AccessToken = tokenHandler.WriteToken(token);

        }

        [Test]
        public void Directors_Controller_GetDirectors_Test()
        {
            var directorsController = new DirectorsController(_context);
            var directors = directorsController.GetDirectors();

            Console.WriteLine(directors.Result.Value.FirstOrDefault().FirstName);
            Assert.IsNotEmpty(directors.Result.Value.FirstOrDefault().FirstName);
        }



        [Test]
        public void Directors_Controller_GetDirector_Test()
        {
            var directorsController = new DirectorsController(_context);
            var directorFirst = directorsController.GetDirectors().Result.Value.FirstOrDefault();
            var firstName = directorsController.GetDirector((long)directorFirst.Id).Result.Value.FirstName;
            Console.WriteLine(firstName);
            Assert.AreEqual(directorFirst.FirstName, firstName);
        }


        //do single
        [Test]
        public async Task Directors_Controller_PostDirector_Test()
        {
            var directorsController = new DirectorsController(_context);
            var director = new Director();
            director.FirstName = "isims";
            director.LastName = "soyisin";
            director.Sex = 1;
            director.DateOfBirth = DateTime.UtcNow;

            var res = await directorsController.PostDirector(director);


            Console.WriteLine(directorsController.GetDirectors().Result.Value.Where(dir => director.DateOfBirth == dir.DateOfBirth).FirstOrDefault().Id);
            //dateofbirth post metodunun yapýldýðý tarih olduðu için bu þekilde veriyi geri çekiyoruz.
            Assert.AreEqual(director.Id,
                directorsController.GetDirectors().Result.Value.Where(dir => director.DateOfBirth == dir.DateOfBirth).FirstOrDefault().Id);
        }

        [Test]
        public async Task Directors_Controller_PutDirector_Test()
        {
            var directorsController = new DirectorsController(_context);
            var director = directorsController.GetDirectors().Result.Value.FirstOrDefault();

            var tempTime = DateTime.UtcNow;
            director.DateOfBirth =tempTime;

            Console.WriteLine(director.Id + " " + tempTime);
            directorsController.PutDirector((long)director.Id, director);
            Assert.AreEqual(tempTime, director.DateOfBirth);
        }

        [Test]
        public void Directors_Controller_PutDirectorName_Test()
        {
            var directorsController = new DirectorsController(_context);
            var director = directorsController.GetDirectors().Result.Value.FirstOrDefault();

            String tempTimeString = DateTime.UtcNow.ToString();
            director.FirstName = tempTimeString;

            Console.WriteLine(director.Id + " " + tempTimeString);
            directorsController.PutDirectorName((long)director.Id, director);

            var directorCheck = directorsController.GetDirector((long)director.Id).Result.Value;
            Console.WriteLine(directorCheck.FirstName);
            Assert.AreEqual(tempTimeString, directorCheck.FirstName);
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

    }
}