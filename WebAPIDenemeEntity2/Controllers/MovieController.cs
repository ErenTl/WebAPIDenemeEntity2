using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using WebAPIDenemeEntity2.Models;

namespace WebAPIDenemeEntity2.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MovieController : ControllerBase
    {

        private readonly MovieDBContext _context;

        [JsonConstructor]
        public MovieController(MovieDBContext context)
        {
            _context = context;
        }

        
        
        

        [HttpGet]
        public IEnumerable<Movie> Get()
        {
            return _context.Movies.OrderBy(x=>x.Id).ToList();
        }
        
        [Authorize]
        [HttpPut("{id}")]
        public IEnumerable<Movie> Put(long id, Movie client)
        {
            using (var context = new MovieDBContext())
            {
                //update a row

                Movie movie = context.Movies.Where(mov => mov.Id == id).FirstOrDefault();
                movie.MovieTitle = client.MovieTitle;
                movie.ReleaseDate = client.ReleaseDate;
                movie.ImdbRank= client.ImdbRank;

                context.SaveChanges();

                //get all movies
                return context.Movies.Where(mov=>mov.Id == id).ToList();


            }
        }
        [Authorize]
        [HttpDelete("{id}")]
        public IEnumerable<Movie> Delete(long id)
        {
            using (var context = new MovieDBContext())
            {
                Movie movie = context.Movies.Where(mov => mov.Id == id).FirstOrDefault();
                context.Movies.Remove(movie);

                context.SaveChanges();

                return context.Movies.OrderBy(x => x.Id).ToList();
            }   
        }

        [Authorize]
        [HttpPost]
        public IEnumerable<Movie> Post(Movie client)
        {
            using (var context = new MovieDBContext())
            {
                Movie movie = new Movie();
                movie.MovieTitle = client.MovieTitle;
                //movie.ReleaseDate = DateTime.SpecifyKind(new DateTime(2001, 3, 28), DateTimeKind.Utc);
                movie.ReleaseDate= client.ReleaseDate;
                movie.ImdbRank = (decimal?)client.ImdbRank;
                context.Movies.Add(movie);

                context.SaveChanges();

                return context.Movies.Where(mov => mov.Id == movie.Id).ToList();
            }
        }



        

        [HttpGet("GetMovieDetails/{id}")]
        public async Task<ActionResult<Movie>> GetMovieDetails(long id)
        {

            //Eager Loading
            /*var movie =  _context.Movies
                                        .Include(mov => mov.MovieDirectors)
                                            .ThenInclude(dir => dir.Director)
                                        .Where(mov => mov.Id == id)
                                        .FirstOrDefault();*/

            //Explicit Loading

            var movie = await _context.Movies.SingleAsync(mov => mov.Id == id);

            _context.Entry(movie)
                    .Collection(mov => mov.MovieDirectors)
                    .Query()
                    .Include(md => md.Director)
                    .Load();
            


            if (movie == null)
            {
                return NotFound();
            }

            return movie;
        }

    }
}