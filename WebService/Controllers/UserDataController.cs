using MySql.Data.MySqlClient;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.UI.WebControls;
using WebService.Models;

namespace WebService.Controllers
{
    public class UserDataController : ApiController
    {

        // GET api/<controller>
 
            public HttpResponseMessage Get()
            {
                string Query = "SELECT * FROM users";
                MySqlConnection _connection = DatabaseConnection.BuildConnection() as MySqlConnection;
                UserDetailsReference Reference = new UserDetailsReference();

                try
                {
                    _connection.Open();
                    List<UserDetailsStructure> UserData = CrudOperations.ReadData(_connection, Query);
                    _connection.Close();

                    // Converting list to UserDetailsReference type
                    Reference.UserDetails = UserData;
                }
                catch (Exception)
                {
                    _connection.Close();
                }


                return Request.CreateResponse(HttpStatusCode.OK, Reference);
            }

        // GET api/<controller>/5
        public HttpResponseMessage Get(string id)
        {
            string Query = "SELECT * FROM users WHERE user_id = " + '"' + id + '"';

            MySqlConnection _connection = DatabaseConnection.BuildConnection() as MySqlConnection;
            UserDetailsReference Reference = new UserDetailsReference();

            try
            {
                _connection.Open();
                List<UserDetailsStructure> UserData = CrudOperations.ReadData(_connection, Query);
                _connection.Close();

                // Converting list to UserDetailsReference type
                Reference.UserDetails = UserData;
            }
            catch (Exception)
            {
                _connection.Close();
            }
            

            return Request.CreateResponse(HttpStatusCode.OK, Reference);
        }

        // POST api/<controller>
        public HttpResponseMessage Post([FromBody] List<UserDetailsStructure> UserDataToInsert)
        {
            MySqlConnection _connection = DatabaseConnection.BuildConnection() as MySqlConnection;
            try
            {
                _connection.Open();
                CrudOperations.InsertData(_connection, UserDataToInsert);
                _connection.Close();
            }
            catch(Exception)
            {
                _connection.Close();
            }

            return Request.CreateResponse(HttpStatusCode.Created, UserDataToInsert);
        }



        // PUT api/<controller>/5
        public HttpResponseMessage Put([FromBody] List<UserDetailsStructure> UserDataToUpdate)
        {
            MySqlConnection _connection = DatabaseConnection.BuildConnection() as MySqlConnection;
            try
            {
                _connection.Open();
                CrudOperations.UpdateData(_connection, UserDataToUpdate);
                _connection.Close();
            }
            catch (Exception)
            {
                _connection.Close();
            }
            

            return Request.CreateResponse(HttpStatusCode.OK);
        }

        // DELETE api/<controller>/5
        public HttpResponseMessage Delete([FromBody] List<UserDetailsStructure> UserDataToDelete)
        {
            MySqlConnection _connection = DatabaseConnection.BuildConnection() as MySqlConnection;
            try
            {
                _connection.Open();
                bool DataDeleted = CrudOperations.DeleteData(_connection, UserDataToDelete);
                _connection.Close();

                if (DataDeleted)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, UserDataToDelete);
                }
            }
            catch (Exception)
            {
                _connection.Close();
            }
            
            return Request.CreateResponse(HttpStatusCode.NotFound);
        }
    }
}