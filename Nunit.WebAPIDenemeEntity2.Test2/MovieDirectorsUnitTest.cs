﻿using NUnit.Framework;
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

        [Test]
        public async Task MovieDirectors_Controller_Put_Test()
        {
            var mdController = new MovieDirectorsController(_context);
            var original = _context.MovieDirectors.FirstOrDefault();
            var director = _context.Directors.OrderBy(d => d.Id).LastOrDefault();
            var res = mdController.Put((long)director.Id, original).FirstOrDefault();

            Console.WriteLine("MovieDirector id: " + original.Id + " | director Id was changed " + original.DirectorId + " to " + res.DirectorId);
            Assert.AreEqual(director.Id, res.DirectorId);
        }

        [Test]
        public void MovieDirectors_Controller_PostMovieDirector_Test()
        {
            var mdController = new MovieDirectorsController(_context);
            var md = new MovieDirector();
            md.MovieId      = _context.Movies.FirstOrDefault().Id;
            md.DirectorId   = (long)_context.Directors.FirstOrDefault().Id;
            var res = mdController.PostMovieDirector(md).FirstOrDefault();

            Console.WriteLine("movieDirector id: " + res.Id + " was created");
            Assert.AreEqual(md.MovieId, res.MovieId);
        }

        [Test]
        public async Task MovieDirectors_Controller_DeleteMovieDirector_Test()
        {
            var mdController = new MovieDirectorsController(_context);
            var original = _context.MovieDirectors.OrderBy(md => md.Id).LastOrDefault();
            await mdController.DeleteMovieDirector((long)original.Id);

            Console.WriteLine("MovieDirector id: " + original.Id + " was deleted");
            Assert.IsFalse(_context.MovieDirectors.Any(md => md.Id == original.Id));
        }
    }
}
