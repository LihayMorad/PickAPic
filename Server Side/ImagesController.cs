using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;
using WebApplication1.Models;
using ExifLib;
using System.Drawing.Imaging;
using System.Drawing;
using System.Web.Hosting;
using MySql.Data;
using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using System.Web;

namespace WebApplication1.Controllers
{

    public class ImagesController : ApiController
    {
        
        //// Get image by ID
        [Route("api/image/{id}")]
        public HttpResponseMessage GetImages(string id)
        {
            // need to be type uni
            var result = new HttpResponseMessage(HttpStatusCode.OK);
            string localPhotoPath = HttpContext.Current.Server.MapPath("~//photos//" + id + ".jpg");
            FileStream fileStream = new FileStream(localPhotoPath, FileMode.Open);
            Image image = Image.FromStream(fileStream);
            MemoryStream memoryStream = new MemoryStream();
            image.Save(memoryStream, ImageFormat.Jpeg);
            image.Dispose();
            fileStream.Close();
            result.Content = new ByteArrayContent(memoryStream.ToArray());
            result.Content.Headers.ContentType = new MediaTypeHeaderValue("image/jpeg");

            return result;
        }

        //// Get all photos from server
        //// Builds table info to return to client
        [Route("api/numOfPhotos")]
        public IEnumerable<QuickPhoto> GetnoOfphotos(double neX, double neY, double swX, double swY, double rad, double centerX, double centerY)
        {
            MySqlConnection m_Conn;
            string m_QueryStr;
            MySqlCommand m_Cmd;
            MySqlDataReader dataReader;

            m_Conn = new MySqlConnection("server=localhost; user id=root;database=gis;password=PASS;sslMode=none;");
            m_Conn.Open();

            if (rad == 0)
            {
                if (neY < swY)
                {
                    m_QueryStr = "SELECT * FROM gis.quickloadphotos WHERE Lat<='" + neX + "' AND Lat >= '" + swX + "' AND (Lng<='" + neY + "' OR Lng >= '" + swY + "');";
                }
                else
                {
                    m_QueryStr = "SELECT * FROM gis.quickloadphotos WHERE Lat<='" + neX + "' AND Lat >= '" + swX + "' AND Lng<='" + neY + "' AND Lng >= '" + swY + "';";
                }
            }
            else
            {
                if (neY < swY)
                {
                    m_QueryStr = "SELECT * FROM gis.quickloadphotos WHERE Lat<='" + neX + "' AND Lat >= '" + swX + "' AND (Lng<='" + neY + "' OR Lng >= '" + swY + "') " +
                        "AND (('" + centerX + "' - Lat)*('" + centerX + "' - Lat) + ('" + centerY + "' - Lng)*('" + centerY + "' - Lng))<= '" + rad * rad + "';";
                }
                else
                {
                    m_QueryStr = "SELECT * FROM gis.quickloadphotos WHERE Lat<='" + neX + "' AND Lat >= '" + swX + "' AND Lng<='" + neY + "' AND Lng >= '" + swY + "' " +
                        "AND (('" + centerX + "' - Lat)*('" + centerX + "' - Lat) + ('" + centerY + "' - Lng)*('" + centerY + "' - Lng))<= '" + rad * rad + "';";
                }
            }

            m_Cmd = new MySqlCommand(m_QueryStr, m_Conn);

            dataReader = m_Cmd.ExecuteReader();
            
            List<QuickPhoto> lst = new List<QuickPhoto>();

            while ( dataReader.Read() )
            {
                if (!dataReader.IsDBNull(2) )
                {
                    QuickPhoto temp = new QuickPhoto(dataReader.GetString(0), dataReader.GetString(1), dataReader.GetDouble(2), dataReader.GetDouble(3), dataReader.GetDouble(4), dataReader.GetInt32(5), dataReader.GetString(6));
                    lst.Add(temp);
                }
                else
                {
                    deletePhoto(dataReader.GetString(0));
                }
            }

            dataReader.Close();
            m_Conn.Close();

            QuickPhoto[] arr = new QuickPhoto[lst.Count];
            lst.CopyTo(arr);

            return  arr;
        }

        private void deletePhoto(string ID)
        {
            MySqlConnection m_Conn;
            string m_QueryStr;
            MySqlCommand m_Cmd;
            MySqlCommand m_Cmd2;
            MySqlDataReader dataReader;

            //// delete photo from mysql
            m_Conn = new MySqlConnection("server=localhost; user id=root;database=gis;password=PASS;sslMode=none;");
            m_Conn.Open();

            m_QueryStr = "DELETE FROM quickloadphotos WHERE ID ='" + ID + "'";

            m_Cmd = new MySqlCommand(m_QueryStr, m_Conn);

            dataReader = m_Cmd.ExecuteReader();

            m_Conn.Close();

            m_Conn.Open();

            m_QueryStr = "DELETE FROM photodetails WHERE ID ='" + ID + "'";

            m_Cmd2 = new MySqlCommand(m_QueryStr, m_Conn);

            dataReader = m_Cmd2.ExecuteReader();

            m_Conn.Close();

            //// delete photo from folder
            string filepath = HttpContext.Current.Server.MapPath("~//photos//" + ID + ".jpg");
            string thumbnailpath = HttpContext.Current.Server.MapPath("~//photos//thumbnail_" + ID + ".jpg");

            if (File.Exists(filepath))
            {
                try
                {
                    File.Delete(filepath);
                }
                catch (Exception ex)
                {
                    //Do something
                }
            }

            if (File.Exists(thumbnailpath))
            {
                try
                {
                    File.Delete(thumbnailpath);
                }
                catch (Exception ex)
                {
                    //Do something
                }
            }
        }

        //// Get a row with the requested fields
        //// Builds table info and return it to client
        [Route("api/photodetails/{id}")]
        public IEnumerable<PhotoDetails> GetPhotoDetails(String id)
        {
            MySqlConnection m_Conn;
            string m_QueryStr;
            MySqlCommand m_Cmd;
            MySqlDataReader dataReader;

            m_Conn = new MySqlConnection("server=localhost; user id=root;database=gis;password=PASS;sslMode=none;");
            m_Conn.Open();

            // SELECT Username, Description, UploadDate FROM gis.photodetails WHERE ID = "7340f8c3b24a40a0bdc5d657e41e8784";
            m_QueryStr = "SELECT Username, Description, UploadDate FROM gis.photodetails WHERE ID ='" + id + "'";

            m_Cmd = new MySqlCommand(m_QueryStr, m_Conn);

            dataReader = m_Cmd.ExecuteReader();

            List<PhotoDetails> lst = new List<PhotoDetails>();

            while (dataReader.Read())
            {
                PhotoDetails temp = new PhotoDetails(dataReader.GetString(0), dataReader.GetString(1), dataReader.GetString(2));
                lst.Add(temp);
            }

            dataReader.Close();
            m_Conn.Close();

            PhotoDetails[] arr = new PhotoDetails[lst.Count];
            lst.CopyTo(arr);

            return arr;
        }

        //// Get all photos from server of the same marker
        //// Builds table info to return to client
        [Route("api/allMarkersPhotos")]
        public IEnumerable<QuickPhoto> GetallMarkersPhotos(double lat, double lng)
        {
            MySqlConnection m_Conn;
            string m_QueryStr;
            MySqlCommand m_Cmd;
            MySqlDataReader dataReader;

            m_Conn = new MySqlConnection("server=localhost; user id=root;database=gis;password=PASS;sslMode=none;");
            m_Conn.Open();

            m_QueryStr = "SELECT ID, Username, Description, UploadDate FROM photodetails JOIN quickloadphotos USING (ID) WHERE Lat = '" + lat + "' and Lng = '" + lng + "';";

            m_Cmd = new MySqlCommand(m_QueryStr, m_Conn);

            dataReader = m_Cmd.ExecuteReader();

            List<QuickPhoto> lst = new List<QuickPhoto>();

            while (dataReader.Read())
            {
                QuickPhoto temp = new QuickPhoto(dataReader.GetString(0), dataReader.GetString(1), dataReader.GetString(2), dataReader.GetString(3));
                lst.Add(temp);
            }

            dataReader.Close();
            m_Conn.Close();

            QuickPhoto[] arr = new QuickPhoto[lst.Count];
            lst.CopyTo(arr);

            return arr;
        }

    }
}
