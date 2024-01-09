using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Data;

namespace WebService.Models
{
    public class DatabaseConnection
    {
        public static MySqlConnection con = new MySqlConnection(ConfigurationManager.ConnectionStrings["conString"].ConnectionString);

        public static DbConnection BuildConnection()
        {
            return con;

        }
    }
}