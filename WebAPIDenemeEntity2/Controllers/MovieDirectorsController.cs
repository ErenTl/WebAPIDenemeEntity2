#nullable disable
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPIDenemeEntity2.Models;

namespace WebAPIDenemeEntity2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MovieDirectorsController : ControllerBase
    {
        private readonly MovieDBContext _context;

        public MovieDirectorsController(MovieDBContext context)
        {
            _context = context;
        }

        // GET: api/MovieDirectors
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MovieDirector>>> GetMovieDirectors()
        {
            return await _context.MovieDirectors.ToListAsync();
        }

        // GET: api/MovieDirectors/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MovieDirector>> GetMovieDirector(long id)
        {
            var movieDirector = await _context.MovieDirectors.FindAsync(id);

            if (movieDirector == null)
            {
                return NotFound();
            }

            return movieDirector;
        }

        // PUT: api/MovieDirectors/5
        [Authorize]
        [HttpPut("{id}")]
        public IEnumerable<MovieDirector> Put(long id, MovieDirector client)
        {

           
                //gelen sql dosyasıyla MovieDirectors'un id sini bulup /{id} ile directorId değerini değiştiriyor
                MovieDirector md = _context.MovieDirectors.Where(md => md.MovieId==client.MovieId&& md.DirectorId==client.DirectorId).FirstOrDefault();
                md.DirectorId = id;
                var x = md.Id;

                _context.SaveChanges();

                //get all movies
                return _context.MovieDirectors.Where(md => md.Id == x).ToList();


            
        }

        // POST: api/MovieDirectors
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<MovieDirector>> PostMovieDirector(MovieDirector movieDirector)
        {
            _context.MovieDirectors.Add(movieDirector);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMovieDirector", new { id = movieDirector.Id }, movieDirector);
        }

        // DELETE: api/MovieDirectors/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMovieDirector(long id)
        {
            var movieDirector = await _context.MovieDirectors.FindAsync(id);
            if (movieDirector == null)
            {
                return NotFound();
            }

            _context.MovieDirectors.Remove(movieDirector);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MovieDirectorExists(long id)
        {
            return _context.MovieDirectors.Any(e => e.Id == id);
        }
    }
}
