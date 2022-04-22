using System;
using System.Collections.Generic;

namespace WebAPIDenemeEntity2.Models
{
    public partial class User
    {
        public long Id { get; set; }
        public string UserName { get; set; } = null!;
        public string PswSha { get; set; } = null!;
        public short Permission { get; set; }
    }
}
