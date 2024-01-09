using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.IO;
using System.Linq;
using System.Web;

namespace WebService.Models
{
    public class CrudOperations
    {
        // Read
        public static List<UserDetailsStructure> ReadData(DbConnection MySqlDatabaseConnection, string Query)
        {
            List<UserDetailsStructure> UserDetailsList = new List<UserDetailsStructure>();

            try
            {
                string readQuery = Query;
                using (var cmd = new MySqlCommand(readQuery, MySqlDatabaseConnection as MySqlConnection))
                {
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            string user_id = reader.GetString(0);
                            string first_name = reader.GetString(1);
                            string last_name = reader.GetString(2);
                            string DOB = string.Empty;
                            if (reader.GetFieldType(3) == typeof(DateTime))
                            {
                                DateTime dobValue = reader.GetDateTime(3);
                                DOB = dobValue.ToLongDateString();
                            }
                            string gender = reader.GetString(4);
                            string country = reader.GetString(5);

                            
                            UserDetailsList.Add(new UserDetailsStructure
                            {
                                user_id = user_id,
                                first_name = first_name,
                                last_name = last_name,
                                DOB = DOB,
                                gender = gender,
                                country = country
                            });
                        }
                    }
                }
            }
            catch (FileNotFoundException ex)
            {
                Console.WriteLine(ex.Message, " Cross check path and name of Database given");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            return UserDetailsList;
        }

        // Insert
        public static void InsertData(DbConnection MySqlDatabaseConnection, List<UserDetailsStructure> UserDetailsToInsert)
        {
            if (UserDetailsToInsert.Any())
            {
                var values = string.Join(",", UserDetailsToInsert.Select(data => $"('{data.user_id}', '{data.first_name}', '{data.last_name}', '{data.DOB}', '{data.gender}', '{data.country}')"));

                var commandText = $"INSERT INTO users(user_id, first_name, last_name, DOB, gender, country) VALUES {values};";
                using (var cmd = new MySqlCommand(commandText, MySqlDatabaseConnection as MySqlConnection))
                {
                    cmd.ExecuteNonQuery();
                }
            }
        }

        // Update
        public static void UpdateData(DbConnection MySqlDatabaseConnection, List<UserDetailsStructure> UserDataToUpdate)
        {
            if (UserDataToUpdate.Any())
            {
                
                foreach (var user in UserDataToUpdate)
                {
                    var commandText = $"UPDATE users SET user_id = '{user.user_id}', first_name = '{user.first_name}',last_name = '{user.last_name}', DOB = '{user.DOB}', gender = '{user.gender}', country = '{user.country}' WHERE user_id = '{user.user_id}';";
                    using (var cmd = new MySqlCommand(commandText, MySqlDatabaseConnection as MySqlConnection))
                    {
                        cmd.ExecuteNonQuery();
                    }
                }
            }
        }

        // Delete
        public static bool DeleteData(DbConnection MySqlDatabaseConnection, List<UserDetailsStructure> UserDataToDelete)
        {
            if (UserDataToDelete.Any())
            {
                string deleteQuery = "DELETE FROM users WHERE user_id IN (" + string.Join(",", UserDataToDelete.Select(data => $"'{data.user_id}'")) + ")";
                using (var deleteCmd = new MySqlCommand(deleteQuery, MySqlDatabaseConnection as MySqlConnection))
                {
                    deleteCmd.ExecuteNonQuery();
                }
                return true;
            }
            return false;
        }
    }
}