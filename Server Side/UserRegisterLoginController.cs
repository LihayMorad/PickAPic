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
        [HttpPost]
        [Route("Login")]
        public HttpResponseMessage LoginUser([FromBody] User user)
        {
            var response = new HttpResponseMessage();

            if (loginUser(user.Username, user.Password))
            {
                response.Headers.AddCookies(new CookieHeaderValue[] { createCookie(user) });
                response.StatusCode = HttpStatusCode.OK;
                return response;
            }
            // else a bad request will be returned
            response.StatusCode = HttpStatusCode.BadRequest;
            response.Content = new StringContent("Incorrect username/password !");

            return response;
        }

        //// Check if username and password are correct for login
        private bool loginUser(string username, string password)
        {
            bool userFound = false;

            Conn = new MySqlConnection("server=localhost; user id=root;database=gis;password=PASS;sslMode=none;");
            Conn.Open();

            QueryStr = "SELECT * FROM userlogin WHERE Username='" + username + "' AND Password ='" + password + "'";

            Cmd = new MySqlCommand(QueryStr, Conn);
            Reader = Cmd.ExecuteReader();

            if (Reader.HasRows)
                userFound = true;

            Conn.Close();

            return userFound;
        }

        private CookieHeaderValue createCookie(User user)
        {
            var vals = new NameValueCollection();

            vals["sessionid"] = Guid.NewGuid().ToString();//maybe encrypt with password
            vals["username"] = user.Username;

            var cookie = new CookieHeaderValue("session", vals);

            cookie.Path = "/";
            cookie.Expires = DateTimeOffset.Now.AddHours(5);
            cookie.Domain = Request.RequestUri.Host;

            Conn = new MySqlConnection("server=localhost; user id=root;database=gis;password=PASS;sslMode=none;");
            Conn.Open();

            QueryStr = "UPDATE userlogin SET SessionID = '" + vals["sessionid"] + "' WHERE (Username = '" + user.Username + "')";

            Cmd = new MySqlCommand(QueryStr, Conn);
            Reader = Cmd.ExecuteReader();

            Conn.Close();
            return cookie;
        }

        // register method
        [HttpPost]
        [Route("Registration")]
        public HttpResponseMessage RegisterUser([FromBody] User user)
        {
            var response = new HttpResponseMessage();
            if (registerUser(user.Username, user.Password))
            {
                response.Headers.AddCookies(new CookieHeaderValue[] { createCookie(user) });
                response.StatusCode = HttpStatusCode.OK;
                return response;
            }
            // else  a bad request will be returned

            response.StatusCode = HttpStatusCode.BadRequest;
            response.Content = new StringContent("Can't register");

            return response;
        }

        // Checks if user has cookie or not
        [HttpGet]
        [Route("hasCookie")]
        public IHttpActionResult hasCookie()
        {
            var userCookie = Request.Headers.GetCookies("session").FirstOrDefault();

            if (userCookie != null)
            {
                CookieState vals = userCookie["session"];

                string[] userSessionArray = new string[3];
                var userSessionID = vals["sessionid"];
                var userSessionUsername = vals["username"];
                userSessionArray[0] = userSessionID;
                userSessionArray[1] = userSessionUsername;
                userSessionArray[2] = "User has cookie c#";

                //////
                //var resp = new HttpResponseMessage();

                //var nv = new NameValueCollection();
                //nv["sid"] = "12345";
                //nv["token"] = "abcdef";
                //nv["theme"] = "dark blue";
                //var cookie = new CookieHeaderValue("session", nv);

                //resp.Headers.AddCookies(new CookieHeaderValue[] { cookie }); //////

                return Ok(userSessionArray);
            }
            return NotFound();
        }

        //// Update mysql database with new user if successful
        private bool registerUser(string username, string password)
        {

            if (checkUsernameAvailablity(username))
                return false;

            Conn.Open();

            QueryStr = "INSERT INTO gis.userlogin (Username, Password)" + "VALUE ('" + username + "','" + password + "')";

            Cmd = new MySqlCommand(QueryStr, Conn);

            Cmd.ExecuteReader();

            Conn.Close();

            Conn.Open();

            QueryStr = "INSERT INTO gis.userdetails (Username, Permission, Rating)" +
                    "VALUE ('" + username + "','User','5')";

            Cmd = new MySqlCommand(QueryStr, Conn);

            Cmd.ExecuteReader();

            Conn.Close();

            return true;
        }

        // check if username is already in the database
        private bool checkUsernameAvailablity(string username)
        {
            bool userExists = false;

            Conn = new MySqlConnection("server=localhost; user id=root;database=gis;password=PASS;sslMode=none;");

            Conn.Open();

            QueryStr = "SELECT * FROM gis.userlogin WHERE Username='" + username + "'";

            Cmd = new MySqlCommand(QueryStr, Conn);

            Reader = Cmd.ExecuteReader();

            // if rows exist in table then user also exists, change value to true
            if (Reader.HasRows)
                userExists = true;

            Conn.Close();

            return userExists;
        }

    }
}
