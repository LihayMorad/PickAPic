using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace WebApplication1.Models
{
    public sealed class AccessToken
    {
        private static AccessToken instance = null;
        private static readonly object padlock = new object();

        AccessToken() { }

        public static AccessToken Instance
        {
            get
            {
                lock (padlock)
                {
                    if (instance == null)
                    {
                        instance = new AccessToken();
                    }

                    return instance;
                }
            }
        }

        public static HttpResponseMessage CheckAccessToken([FromBody] MySession accessToken)
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

        public static string searchUserByAccessToken(string accessToken)
        {
            for (int i = 0; i < HttpContext.Current.Application.Count; i++)
                if ((string)HttpContext.Current.Application[i] == accessToken)
                {
                    return (string)HttpContext.Current.Application.GetKey(i);
                }

            return null;
        }
    }
}