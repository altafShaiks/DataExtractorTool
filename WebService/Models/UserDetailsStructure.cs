using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebService.Models
{
    public class UserDetailsStructure
    {
        public string user_id { get; set; }
        public string first_name { get; set; }
        public string last_name { get; set; }
        public string DOB { get; set; }
        public string gender { get; set; }
        public string country { get; set; }
    }
}