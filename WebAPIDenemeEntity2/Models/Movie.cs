using System;
using System.Collections.Generic;

namespace WebAPIDenemeEntity2.Models
{
    public partial class Movie
    {
        public Movie()
        {
            MovieDirectors = new HashSet<MovieDirector>();
            MovieGenres = new HashSet<MovieGenre>();
        }

        public long Id { get; set; }
        public string MovieTitle { get; set; } = null!;
        public DateTime? ReleaseDate { get; set; }
        public decimal? ImdbRank { get; set; }

        public virtual ICollection<MovieDirector> MovieDirectors { get; set; }
        public virtual ICollection<MovieGenre> MovieGenres { get; set; }
    }
}
