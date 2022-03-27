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
            using(var context = new MovieDBContext())
            {
                
                
                //add a movie
                /*
                Movie movie = new Movie();
                movie.MovieTitle = "Dogum Gunu";
                movie.ReleaseDate = DateTime.SpecifyKind(new DateTime(2001,3,28), DateTimeKind.Utc);
                movie.ImdbRank = (decimal?)2.1;

                context.Movies.Add(movie);

                context.SaveChanges();
                
                */


                //update a row
                
                


                //remove movie
                /*
                Movie movie = context.Movies.Where(mov => mov.Id == 8).FirstOrDefault();
                context.Movies.Remove(movie);

                context.SaveChanges();
                */

                //get all movies
                return context.Movies.OrderBy(x=>x.Id).ToList();

                //get movie by id
                //return context.Movies.Where(mov => mov.MovieTitle == "Kalem Kutusu").ToList();

            }
        }

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
            
            /*var director = await _context.Directors.SingleAsync(d => d.Id == id);

            _context.Entry(director)
                    .Reference(dir => dir.FirstName)
                    .Load();*/



            if (movie == null)
            {
                return NotFound();
            }

            return movie;
        }

        //update a row

        //Movie movie = context.Movies.Where(mov => mov.Id == id).FirstOrDefault();
        /*var fullEntries = context.Movies.
            Join(
                context.MovieDirectors,
                MovieDirectors => MovieDirector.MovieId,
                Movies => Movies.Id,
                (MovieDirector, Movie) => new { MovieDirector, Movie }
            ).Where(fullEntries => fullEntries.Movie.Id == id)
            .Take(10);*/

        /*IQueryable<TableJoinResult> query = (from Movie in context.Set<Movie>()
                                             join MovieDirector in context.Set<MovieDirector>()
                                                 on Movie.Id equals MovieDirector.MovieId
                                             select new TableJoinResult { MovieDirector = MovieDirector, Movie = Movie });*/

        //context.SaveChanges();
        //var x = query.Where(query => query.Movie.Id == id);

        //get all movies
        //return context.Movies.Where(mov => mov.Id == id).ToList();
        /*IQueryable<TableJoinResult> dds = (from Movie in context.Movies
                join MovieDirector in context.MovieDirectors on Movie.Id equals MovieDirector.MovieId
                where Movie.Id.Equals(id)
                select new TableJoinResult { Movie = Movie, MovieDirector = MovieDirector });
        Console.WriteLine("salam ekmek " + dds);*/



        /*var dds = from mov in context.Movies
                                 from movdir in context.MovieDirectors
                                 from dir in context.Directors
                                 where mov.Id == movdir.MovieId && movdir.DirectorId == dir.Id
                                 select new TableJoinResult { Movie = mov, MovieDirector = movdir };
                                 

                foreach (var item in dds)
                {
                    Console.WriteLine(item.Movie.MovieTitle +" salamdýr " + item.MovieDirector.DirectorId + " -- ");
                }*/

        //var sd= JsonConvert.DeserializeObject<List<TestClass>>(TestObject).AsQueryable();

        /*
        [HttpPut("{id}")]
        public IEnumerable<Movie> Put_Movie(long id, Movie client)
        {
            using (var context = new MovieDBContext())
            {


                




                //update a row
                
                Movie movie = context.Movies.Where(mov => mov.Id == id).FirstOrDefault();
                movie.MovieTitle = client.MovieTitle;

                context.SaveChanges();
                


                

                //get all movies
                return context.Movies.ToList();


            }
        }*/

    }
}