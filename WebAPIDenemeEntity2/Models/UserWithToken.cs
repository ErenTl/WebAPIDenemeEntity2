using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPIDenemeEntity2.Models
{
    public class UserWithToken : User
    {
        public string AccessToken { get; set; }

        public UserWithToken(User user)
        {
            this.Id = user.Id;
            this.UserName = user.UserName;
            this.PswSha = user.PswSha;
            this.Permission = user.Permission;
        }
    }
}
