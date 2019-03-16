using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using MySql.Data.MySqlClient;
using WebApplication1.Models;
using System.Web;

namespace WebApplication1.Controllers
{
    public class UserRegisterLoginController : ApiController, System.Web.SessionState.IRequiresSessionState
    {
        public MySqlConnection Conn;
        public MySqlCommand Cmd;
        public MySqlDataReader Reader;
        public string QueryStr;
        private string key = Security.GetKey();

        // login method
        [Route("Login")]
        [HttpPost]
        public HttpResponseMessage LoginUser([FromBody] User user)
        {
            HttpResponseMessage response = new HttpResponseMessage();

            if (loginUser(user.Username, user.Password))
            {
                string guid = Guid.NewGuid().ToString();
                response.Content = new StringContent(guid);
                HttpContext.Current.Application[user.Username] = guid;
                response.StatusCode = HttpStatusCode.OK;
                return response;
            }

            // else a bad request will be returned
            response.StatusCode = HttpStatusCode.BadRequest;
            response.Content = new StringContent("Incorrect username/password !");

            return response;
        }

        // register method
        [Route("Registration")]
        [HttpPost]
        public HttpResponseMessage RegisterUser([FromBody] User user)
        {
            HttpResponseMessage response = new HttpResponseMessage();

            if (registerUser(user.Username, user.Password))
            {
                String guid = Guid.NewGuid().ToString();
                response.Content = new StringContent(guid);
                HttpContext.Current.Application[user.Username] = guid;
                response.StatusCode = HttpStatusCode.OK;
                return response;
            }

            // else  a bad request will be returned
            response.StatusCode = HttpStatusCode.BadRequest;
            response.Content = new StringContent("There was a problem with your registration");

            return response;
        }

        [Route("CheckAccessToken")]
        [HttpPost]
        public HttpResponseMessage CheckAccessToken([FromBody] MySession accessToken)
        {
            return AccessToken.CheckAccessToken(accessToken);
        }

        //// Check if username and password are correct for login
        private bool loginUser(string username, string recievedPassword)
        {
            bool correctUser = false;
            string encryptedPassword = Security.ComputeSha256Hash(recievedPassword);
            Conn = new MySqlConnection(Security.ConnectionDetails());
            Conn.Open();

            ////stored procedure
            Cmd = new MySqlCommand("login", Conn);

            Cmd.CommandType = System.Data.CommandType.StoredProcedure;

            Cmd.Parameters.AddWithValue("username", username);
            Cmd.Parameters.AddWithValue("pass", encryptedPassword);
            Reader = Cmd.ExecuteReader();

            if (Reader.HasRows)
            {
                correctUser = true;
            }

            Reader.Close();
            Conn.Close();

            return correctUser;
        }

        //// Update mysql database with new user if successful
        private bool registerUser(string username, string password)
        {
            string encryptedPassword = Security.ComputeSha256Hash(password);

            if (checkUsernameAvailablity(username))
            {
                return false;
            }

            Conn.Open();

            ////stored procedure
            Cmd = new MySqlCommand("registerUser", Conn);

            Cmd.CommandType = System.Data.CommandType.StoredProcedure;

            Cmd.Parameters.AddWithValue("username", username);
            Cmd.Parameters.AddWithValue("pass", encryptedPassword);
            Cmd.Parameters.AddWithValue("permission", "User");
            Cmd.Parameters.AddWithValue("rating", 5);

            Cmd.ExecuteReader();
            Conn.Close();

            return true;
        }

        // check if username is already in the database
        private bool checkUsernameAvailablity(string username)
        {
            bool userExists = false;

            Conn = new MySqlConnection(Security.ConnectionDetails());

            Conn.Open();

            ////stored procedure
            Cmd = new MySqlCommand("checkUsernameAvailablity", Conn);

            Cmd.CommandType = System.Data.CommandType.StoredProcedure;

            Cmd.Parameters.AddWithValue("username", username);

            Reader = Cmd.ExecuteReader();

            // if rows exist in table then user also exists, change value to true
            if (Reader.HasRows)
            {
                userExists = true;
            }

            Conn.Close();

            return userExists;
        }
    }
}