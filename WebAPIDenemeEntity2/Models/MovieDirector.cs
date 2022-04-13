using System;
using System.Collections.Generic;

namespace WebAPIDenemeEntity2.Models
{
    public partial class MovieDirector
    {
        public long Id { get; set; }
        public long MovieId { get; set; }
        public long DirectorId { get; set; }

        public virtual Director? Director { get; set; } = null!;
        public virtual Movie? Movie { get; set; } = null!;
    }
}
