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
        public void Directors_Controller_GetDirector_1_Test()
        {
            var directorsController = new DirectorsController(_context);
            var firstName = directorsController.GetDirector(1).Result.Value.FirstName;
            Console.WriteLine(firstName);
            Assert.AreEqual("Eren", firstName);
        }



    }
}