using System;
using System.Collections.Generic;

namespace WebAPIDenemeEntity2.Models
{
    public partial class Genre
    {
        public Genre()
        {
            MovieGenres = new HashSet<MovieGenre>();
        }

        public long Id { get; set; }
        public string GenreName { get; set; } = null!;

        public virtual ICollection<MovieGenre> MovieGenres { get; set; }
    }
}
