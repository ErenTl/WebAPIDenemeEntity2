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
    public class DirectorsUnitTest
    {

        private MovieDBContext _context;
        [SetUp]
        public void Setup()
        {
            var builder = WebApplication.CreateBuilder();
            var connectionString = builder.Configuration.GetConnectionString("MovieSiteDBTest");
            var dbContextOptions = new DbContextOptionsBuilder<MovieDBContext>().UseNpgsql(connectionString);
            _context = new MovieDBContext(dbContextOptions.Options);
            _context.Database.EnsureCreated();
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
        public async Task Directors_Controller_DeleteDirector_Test()
        {
            var directorsController = new DirectorsController(_context);
            var director = directorsController.GetDirectors().Result.Value.LastOrDefault();

            await directorsController.DeleteDirector((long)director.Id);

            bool exist = directorsController.DirectorExists((long)director.Id);

            Assert.IsFalse(exist);
        }

    }
}