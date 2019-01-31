using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using MySql.Data.MySqlClient;
using WebApplication1.Models;
using System.Web.SessionState;
using System.Web;
using System.Net.Http.Headers;
using System.Collections.Specialized;

namespace WebApplication1.Controllers
{
    public class UserRegisterLoginController : ApiController, System.Web.SessionState.IRequiresSessionState
    {
        public MySqlConnection Conn;
        public MySqlCommand Cmd;
        public MySqlDataReader Reader;
        public String QueryStr;

        // login method
        [Route("Login")]
        [HttpPost]
        public HttpResponseMessage LoginUser([FromBody] User user)
        {
            HttpResponseMessage response = new HttpResponseMessage();

            if (loginUser(user.Username, user.Password))
            {
                String guid = Guid.NewGuid().ToString();
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
        //public HttpResponseMessage CheckAccessToken([FromBody]User accessToken)
        public HttpResponseMessage CheckAccessToken([FromBody] MySession accessToken)
        {
            HttpResponseMessage response = new HttpResponseMessage();

            if (accessToken.AccessToken != string.Empty)
            {
                string userName = searchUserByAccessToken(accessToken.AccessToken);
                if (userName != null)
                {
                    response.Content = new StringContent(userName);
                    return response;
                }
            }
            // else a bad request will be returned
            response.StatusCode = HttpStatusCode.BadRequest;
            response.Content = new StringContent("Incorrect username/password !");

            return response;
        }

        private string searchUserByAccessToken(string accessToken)
        {
            for (int i = 0; i < HttpContext.Current.Application.Count; i++)
                if ((string)HttpContext.Current.Application[i] == accessToken)
                    return (string)HttpContext.Current.Application.GetKey(i);
            return null;
        }

        //// Check if username and password are correct for login
        private bool loginUser(string username, string password)
        {
            bool userFound = false;

            Conn = new MySqlConnection("server=localhost; user id=root;database=gis;password=PASS;sslMode=none;");
            Conn.Open();

            ////old query
            //QueryStr = "SELECT * FROM userlogin WHERE Username='" + username + "' AND Password ='" + password + "'";

            //Cmd = new MySqlCommand(QueryStr, Conn);

            ////stored procedure
            Cmd = new MySqlCommand("login", Conn);

            Cmd.CommandType = System.Data.CommandType.StoredProcedure;

            Cmd.Parameters.AddWithValue("username", username);
            Cmd.Parameters.AddWithValue("pass", password);
            ////

            Reader = Cmd.ExecuteReader();

            if (Reader.HasRows)
                userFound = true;

            Conn.Close();

            return userFound;
        }

        //// Update mysql database with new user if successful
        private bool registerUser(string username, string password)
        {
            if (checkUsernameAvailablity(username))
                return false;

            Conn.Open();

            ////old query
            //QueryStr = "INSERT INTO gis.userlogin (Username, Password)" + "VALUE ('" + username + "','" + password + "')";

            //Cmd = new MySqlCommand(QueryStr, Conn);

            ////stored procedure
            Cmd = new MySqlCommand("registerUser", Conn);

            Cmd.CommandType = System.Data.CommandType.StoredProcedure;

            Cmd.Parameters.AddWithValue("username", username);
            Cmd.Parameters.AddWithValue("pass", password);
            Cmd.Parameters.AddWithValue("permission", "user"); /////////////////////////////
            Cmd.Parameters.AddWithValue("rating", "5.0"); //////////////////////////////////
            ////

            Cmd.ExecuteReader();

            Conn.Close();

            ////old query
            //Conn.Open();

            //QueryStr = "INSERT INTO gis.userdetails (Username, Permission, Rating)" +
            //        "VALUE ('" + username + "','User','5')";

            //Cmd = new MySqlCommand(QueryStr, Conn);

            //Cmd.ExecuteReader();

            //Conn.Close();
            ////
            
            return true;
        }

        // check if username is already in the database
        private bool checkUsernameAvailablity(string username)
        {
            bool userExists = false;

            Conn = new MySqlConnection("server=localhost; user id=root;database=gis;password=PASS;sslMode=none;");

            Conn.Open();

            ////old query
            //QueryStr = "SELECT * FROM gis.userlogin WHERE Username='" + username + "'";

            //Cmd = new MySqlCommand(QueryStr, Conn);

            ////stored procedure
            Cmd = new MySqlCommand("checkUsernameAvailablity", Conn);

            Cmd.CommandType = System.Data.CommandType.StoredProcedure;

            Cmd.Parameters.AddWithValue("username", username);
            ////

            Reader = Cmd.ExecuteReader();

            // if rows exist in table then user also exists, change value to true
            if (Reader.HasRows)
                userExists = true;

            Conn.Close();

            return userExists;
        }
    }
}