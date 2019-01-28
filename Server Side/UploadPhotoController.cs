using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApplication1.Models;
using MySql.Data.MySqlClient;
using System.IO;
using ExifLib;
using System.Net.Http.Headers;
using System.Drawing;
using System.Drawing.Imaging;
using System.Web.Hosting;
using Newtonsoft.Json;

namespace GISApplication
{
    public class UploadPhoto
    {
        public int ID { get; set; }
        public string path { get; set; }
        public double lat { get; set; }
        public double lng { get; set; }
        public double popularity { get; set; }
        public int manualGPS { get; set; }
        public string username { get; set; }
        public string description { get; set; }
        public double relevance { get; set; }
        public string filters { get; set; }
        public string uploadDate { get; set; }

    }

    public class SavePhotoController : ApiController, System.Web.SessionState.IRequiresSessionState
    {
        public MySqlConnection m_Conn;
        public MySqlCommand m_Cmd;
        public String m_QueryStr;
        public MySqlDataReader Reader;

        //// Gets client's uploaded photo and saves it in folder and updates database
        [HttpPost]
        [Route("Upload")]
        public async System.Threading.Tasks.Task<HttpResponseMessage> PostFileAsync()
        {
            var response = new HttpResponseMessage();

            var result = await Request.Content.ReadAsMultipartAsync();

            var isExif = await result.Contents[1].ReadAsStringAsync();
            var xCord = await result.Contents[2].ReadAsStringAsync();
            var yCord = await result.Contents[3].ReadAsStringAsync();
            var filter = await result.Contents[4].ReadAsStringAsync();
            var description = await result.Contents[5].ReadAsStringAsync();

            //if (checkIfLoggedIn())
            //{
            var httpRequest = HttpContext.Current.Request;
            //var response = new HttpResponseMessage();

            foreach (string file in httpRequest.Files)
            {
                //// get file extension
                var postedFile = httpRequest.Files[file]; // Get http request for POST
                string fileString = postedFile.FileName.ToString(); // get photo name to extract extension
                string fileExts = Path.GetExtension(fileString); // extract file extension (png, jpg, ect...)

                string ID = generateID(); // generate random ID for each photo

                response.StatusCode = HttpStatusCode.OK;

                //// save file with new ID
                string localfilepath = HttpContext.Current.Server.MapPath("~//photos//" + ID + fileExts);
                postedFile.SaveAs(localfilepath);

                //// save thumbnail with new ID
                string thumbnailFilepath = HttpContext.Current.Server.MapPath("~//photos//" + "thumbnail_" + ID + fileExts);
                ImageResizer.ImageJob i = new ImageResizer.ImageJob(postedFile, thumbnailFilepath, new ImageResizer.Instructions("width=100;height=100;format=jpg;mode=max;autorotate=true"));
                i.Build();

                savePhotoInServer(ID, fileExts, "1", xCord, yCord, filter, description);
            }

            return response;
            //}
            //response.StatusCode = HttpStatusCode.BadRequest;
            //response.Content = new StringContent("Please login to upload photos");

            //return response;
        }

        //// Saves photo details in server : lat, lng, path, popularity, gps, filters
        private void savePhotoInServer(string ID, string extension, string manualGps, string xCord, string yCord, string selectedFilter, string imgDesc)
        {
            m_Conn = new MySqlConnection("server=localhost; user id=root;database=gis;password=PASS;sslMode=none;");

            m_Conn.Open(); // open connection 

            m_QueryStr = "INSERT INTO gis.quickloadphotos (ID, ThumbnailPath, Popularity, Filters, Lat, Lng, ManualGPS) VALUES (@ID, @ThumbnailPath, @Popularity, @Filters, @Lat, @Lng, @ManualGPS)";
            m_Cmd = new MySql.Data.MySqlClient.MySqlCommand(m_QueryStr, m_Conn);

            m_Cmd.Parameters.AddWithValue("@Popularity", "0");
            m_Cmd.Parameters.AddWithValue("@Filters", selectedFilter);
            m_Cmd.Parameters.AddWithValue("@ID", ID);
            m_Cmd.Parameters.AddWithValue("@ThumbnailPath", "photos\\thumbnail_" + ID + extension);
            m_Cmd.Parameters.AddWithValue("@Lat", xCord);
            m_Cmd.Parameters.AddWithValue("@Lng", yCord);
            m_Cmd.Parameters.AddWithValue("@ManualGPS", manualGps);

            m_Cmd.ExecuteNonQuery();

            m_Conn.Close();

            m_Conn.Open(); // open connection 

            m_QueryStr = "INSERT INTO gis.photodetails(ID, Description, Relevance, UploadDate, Path) VALUES (@ID, @Description, @Relevance, @UploadDate, @Path)";
            MySqlCommand m_Cmd2;
            m_Cmd2 = new MySqlCommand(m_QueryStr, m_Conn);

            //ImgId auto increments, no need to give it values
            m_Cmd2.Parameters.AddWithValue("@ID", ID);
            //      m_Cmd2.Parameters.AddWithValue("@Username", vals["username"]);
            m_Cmd2.Parameters.AddWithValue("@Description", imgDesc);
            m_Cmd2.Parameters.AddWithValue("@Relevance", "0");
            m_Cmd2.Parameters.AddWithValue("@UploadDate", DateTime.Now.ToString("dd-MM-yyyy HH:mm:ss zzz"));
            m_Cmd2.Parameters.AddWithValue("@Path", "photos\\" + ID + extension);

            m_Cmd2.ExecuteNonQuery();

            m_Conn.Close();
        }

        //// Generate unique ID for photos
        public string generateID()
        {
            return Guid.NewGuid().ToString("N");
        }

        // check if logged in
        public bool checkIfLoggedIn()
        {
            var userCookie = Request.Headers.GetCookies("session").FirstOrDefault();

            if (userCookie != null)
            {
                return true;
            }

            return false;
        }

        private void changeOrientaion()
        {
            var userCookie = Request.Headers.GetCookies("session").FirstOrDefault();
            // change to appliction
            CookieState vals = userCookie["session"];
            string ID = HttpContext.Current.Application[vals["username"]].ToString();

            m_Conn = new MySql.Data.MySqlClient.MySqlConnection("server=localhost; user id=root;database=gis;password=PASS;sslMode=none;");

            m_Conn.Open(); // open connection 

            m_QueryStr = "SELECT Path FROM gis.photodetails WHERE ID = '" + ID + "'";
            m_Cmd = new MySql.Data.MySqlClient.MySqlCommand(m_QueryStr, m_Conn);

            Reader = m_Cmd.ExecuteReader();
            List<String> path = new List<String>();
            while (Reader.Read())
            {
                path.Add(Reader[0].ToString());
            }

            //string localfilepath = path[0];
            string localfilepath = HttpContext.Current.Server.MapPath(path[0]);
            m_Conn.Close();
            ImageResizer.ImageJob i = new ImageResizer.ImageJob(localfilepath, localfilepath, new ImageResizer.Instructions("width=3000;height=3000;format=jpg;mode=max;autorotate=true"));
            i.Build();
        }

        private void imageYellowBorder(string ID)
        {
            string path = HttpContext.Current.Server.MapPath("~//photos//thumbnail_" + ID + ".jpg");

            File.Copy(HttpContext.Current.Server.MapPath("~//photos//thumbnail_" + ID + ".jpg"), HttpContext.Current.Server.MapPath("~//photos//thumbnail_" + ID + "NEW.jpg"));

            if (File.Exists(path))
            {
                try
                {
                    File.Delete(path);
                }
                catch (Exception ex)
                {
                    //Do something
                }
            }

            Bitmap bitmap = new Bitmap(HttpContext.Current.Server.MapPath("~//photos//thumbnail_" + ID + "NEW.jpg"));
            using (Graphics g = Graphics.FromImage(bitmap))
            {
                g.DrawRectangle(new Pen(Brushes.Yellow, 5), new Rectangle(0, 0, bitmap.Width, bitmap.Height));
            }

            bitmap.Save(HttpContext.Current.Server.MapPath("~//photos//thumbnail_" + ID + ".jpg"));

            path = HttpContext.Current.Server.MapPath("~//photos//thumbnail_" + ID + "NEW.jpg");

            if (File.Exists(path))
            {
                try
                {
                    File.Delete(path);
                }
                catch (Exception ex)
                {
                    //Do something
                }
            }
        }

        private void saveImage(Bitmap file, string filename)
        {
            try
            {
                if (Directory.Exists(HttpContext.Current.Server.MapPath("~//photos//thumbnail_") + filename))
                {
                    file.Dispose();
                }
                else
                {
                    Directory.CreateDirectory("filepath" + filename);
                    file.Save("filepath" + filename, ImageFormat.Jpeg);
                }
            }
            finally
            {
                file.Dispose();
            }
        }

        // manualLocation upload method 
        //[HttpPost]
        //[Route("location")]
        //public IHttpActionResult manualLocation([FromBody] Location loc)
        //{
        //    var userCookie = Request.Headers.GetCookies("session").FirstOrDefault();
        //    // change to appliction
        //    CookieState vals = userCookie["session"];
        //    string Id = HttpContext.Current.Application[vals["username"]].ToString();

        //    double lat = loc.lat;
        //    double lng = loc.lng;
        //    try
        //    {
        //        updateGPS(Id,lat,lng,1);
        //        return Ok();
        //    }
        //    catch
        //    {
        //        return Content(HttpStatusCode.BadRequest, "Unable to save manual location in database");
        //    }
        //}
    }
}
