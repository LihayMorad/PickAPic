using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApplication1.Models;
using System.Web.UI;
using System.Web.UI.WebControls;
using MySql.Data;
using MySql.Data.MySqlClient;
using System.IO;
using System.Threading.Tasks;
using System.Diagnostics;
using System.Text;
using ExifLib;
using Newtonsoft.Json;
using System.Data;

namespace WebApplication1.Controllers
{

    public class SearchController : ApiController
    {

        MySqlConnection Conn;
        MySqlCommand Cmd;
        String QueryStr;
        MySqlDataAdapter picsAdapt;
        DataTable picsDt;
        MySqlCommandBuilder cmdBuilder;

        //// Search for photos in approximate area
        [HttpPost]
        [Route("Search")]
        public IHttpActionResult SearchCoordinatesWithinRadius([FromBody] SearchData picData)
        {
            double lat, lng, rad;
            
            try
            {               
                picData.ParseToDouble(out lat, out lng, out rad); 
                isCoordinatesInRange(lat, lng);
            }
            catch
            {
                // else a bad request will be returned
                return Content(HttpStatusCode.BadRequest, "Invalid Coordinates!!");
            }

            searchResults(lat, lng, rad);

            return Ok(JsonConvert.SerializeObject(picsDt, Formatting.Indented));
        }

        private bool isCoordinatesInRange(double lat, double lng)
        {
            if (lat > 85 || lat < 0 || lng < -180 || lng > 180)
            {
                throw new Exception("Values out of bound!");
            }

            return true;
        }

        //// Builds table with photos in surrounding area
        private void searchResults(double lat, double lng, double rad)
        {
            double tblLat, tblLng, dist;
            Conn = new MySqlConnection("server=localhost; user id=root;database=gis;password=PASS;sslMode=none;");
            Conn.Open();

            QueryStr = "SELECT ID, ThumbnailPath, Lat, Lng FROM gis.quickloadphotos";
            picsAdapt = new MySqlDataAdapter(QueryStr, Conn);
            cmdBuilder = new MySqlCommandBuilder(picsAdapt);
            picsDt = new DataTable();

            picsAdapt.Fill(picsDt);

            //disposing of adapters, builders and closing the connection
            cmdBuilder.Dispose();
            picsAdapt.Dispose();
            Conn.Close();

            foreach (DataRow row in picsDt.Rows)
            {
                tblLat = double.Parse(row["Lat"].ToString());
                tblLng = double.Parse(row["Lng"].ToString());

                dist = getDistance(lat, lng, tblLat, tblLng);

                if (dist > rad)
                {
                    row.Delete();
                }
            }

            picsDt.AcceptChanges();
        }

        //// Helper function, gets distance between two locations
        private double getDistance(double lat1, double lon1, double lat2, double lon2)
        {
            var R = 6371; // Radius of the earth in km
            var dLat = toRadians(lat2 - lat1);  // deg2rad below
            var dLon = toRadians(lon2 - lon1);
            var a =
                Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(toRadians(lat1)) * Math.Cos(toRadians(lat2)) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            var d = R * c; // Distance in km
            return d;
        }

        private double toRadians(double deg)
        {
            return deg * (Math.PI / 180);
        }
    }
}
