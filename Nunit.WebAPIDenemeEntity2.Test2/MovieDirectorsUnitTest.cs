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
    public class MovieDirectorsUnitTest
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
        public async Task MovieDirectors_Controller_GetMovieDirectors_Test()
        {
            var mdController = new MovieDirectorsController(_context);
            var data = await mdController.GetMovieDirectors();
            var md = data.Value.OrderBy(md => md.Id).FirstOrDefault();
            bool exist = false;
            if(_context.Movies.Any(m => m.Id == md.MovieId) && _context.Directors.Any(d => d.Id == md.DirectorId)){
                exist = true;
                Console.WriteLine("movieDirector id: " + md.Id);
            }
            Assert.IsTrue(exist);
        }

        [Test]
        public void MovieDirectors_Controller_GetMovieDirector_Test()
        {
            var mdController = new MovieDirectorsController(_context);
            var original = _context.MovieDirectors.FirstOrDefault();
            var data = mdController.GetMovieDirector(original.Id).Result.Value;

            Console.WriteLine("MovieDirector id: " + original.Id + " get");
            Assert.AreEqual(data.MovieId, original.MovieId);
        }
    }
}
