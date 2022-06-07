using NUnit.Framework;
using WebAPIDenemeEntity2.Controllers;
using WebAPIDenemeEntity2.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using System.Linq;
using System;
using System.Threading.Tasks;

namespace Nunit.WebAPIDenemeEntity2.Test
{
    public class MovieUnitTest
    {

        private MovieDBContext _context;
        private MovieController _movieController;

        [SetUp]
        public void Setup()
        {
            var builder = WebApplication.CreateBuilder();
            var connectionString = builder.Configuration.GetConnectionString("MovieSiteDBTest");
            var dbContextOptions = new DbContextOptionsBuilder<MovieDBContext>().UseNpgsql(connectionString);
            _context = new MovieDBContext(dbContextOptions.Options);
            _context.Database.EnsureCreated();

            _movieController = new MovieController(_context);

        }

        [Test]
        public async Task Movie_Controller_Get_Test()
        {
            var movie = _movieController.Get().FirstOrDefault();
            Console.WriteLine("id: " + movie.Id + "  |title: " + movie.MovieTitle);
            Assert.IsNotNull(movie);
        }

        [Test]
        public void Movie_Controller_Put_Test()
        {
            var movie = _movieController.Get().FirstOrDefault();
            movie.ReleaseDate = DateTime.UtcNow;

            var movieChanged = _movieController.Put(movie.Id, movie);

            Assert.AreEqual(movie.ReleaseDate, movieChanged.FirstOrDefault().ReleaseDate);
        }

        [Test]
        public void Movie_Controller_Delete_Test()
        {
            var movie = _movieController.Get().LastOrDefault();
            _movieController.Delete(movie.Id);
            bool exist = _context.Movies.Any(e => e.Id == movie.Id);

            Console.WriteLine("deleted movie where id: " + movie.Id);
            Assert.IsFalse(exist);
        }

    }
}