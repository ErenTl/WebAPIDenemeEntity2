using System;
using System.Collections.Generic;

namespace WebAPIDenemeEntity2.Models
{
    public partial class Director
    {
        public Director()
        {
            MovieDirectors = new HashSet<MovieDirector>();
        }

        public long? Id { get; set; }
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public DateTime? DateOfBirth { get; set; }
        public DateTime? DateOfDeath { get; set; }
        public short? Sex { get; set; }
        public string? Spouse { get; set; }

        public virtual ICollection<MovieDirector> MovieDirectors { get; set; }
    }
}
