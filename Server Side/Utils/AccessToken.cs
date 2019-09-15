using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using WebApplication1.Models;

namespace WebApplication1
{
    public class AccessToken
    {

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
            
            // else
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