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
    public class DirectorsController : ControllerBase
    {
        private readonly MovieDBContext _context;

        public DirectorsController(MovieDBContext context)
        {
            _context = context;
        }

        // GET: api/Directors
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Director>>> GetDirectors()
        {

            return await _context.Directors.OrderBy(dir => dir.Id).ToListAsync();
        }


        


        // GET: api/Directors/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Director>> GetDirector(long id)
        {
            var director = await _context.Directors.FindAsync(id);

            _context.Entry(director)
                    .Collection(dir => dir.MovieDirectors)
                    .Query()
                    .Include(md => md.Movie)
                    .OrderBy(md => md.Movie.Id)
                    .Load();

            if (director == null)
            {
                return NotFound();
            }

            return director;
        }

        

        // PUT: api/Directors/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDirector(long id, Director director)
        {
            if (id != director.Id)
            {
                return BadRequest();
            }

            _context.Entry(director).State = EntityState.Modified;

            try
            {

                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DirectorExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [Authorize]
        [HttpPut("name/{id}")]
        public IEnumerable<Director> PutDirectorName(long id, Director client)
        {
            using(var context = new MovieDBContext())
            {
                Director director = context.Directors.Where(d => d.Id == id).FirstOrDefault();

                director.FirstName = client.FirstName;
                director.LastName = client.LastName;

                context.SaveChanges();

                return context.Directors.Where(dir => dir.Id == id).ToList();

            }
        }

        // POST: api/Directors
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Director>> PostDirector(Director director)
        {
            _context.Directors.Add(director);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(PostDirector), new { id = director.Id }, director);
        }

        // DELETE: api/Directors/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDirector(long id)
        {
            var director = await _context.Directors.FindAsync(id);
            if (director == null)
            {
                return NotFound();
            }

            _context.Directors.Remove(director);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DirectorExists(long id)
        {
            return _context.Directors.Any(e => e.Id == id);
        }
    }
}
