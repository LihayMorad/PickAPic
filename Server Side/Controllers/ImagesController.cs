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
        public IEnumerable<Photo> GetnoOfphotos(double neX, double neY, double swX, double swY, int rad, double centerX, double centerY)
        {
            MySqlConnection m_Conn;
            MySqlCommand m_Cmd;
            MySqlDataReader dataReader;

            m_Conn = new MySqlConnection(Security.ConnectionDetails());
            m_Conn.Open();

            if (rad == 0)
            {
                m_Cmd = new MySqlCommand("mapBounds", m_Conn);
                m_Cmd.CommandType = System.Data.CommandType.StoredProcedure;

                m_Cmd.Parameters.AddWithValue("neX", neX);
                m_Cmd.Parameters.AddWithValue("swX", swX);
                m_Cmd.Parameters.AddWithValue("neY", neY);
                m_Cmd.Parameters.AddWithValue("swY", swY);

                if (neY < swY)
                {
                    m_Cmd.Parameters.AddWithValue("choice", 1);
                }
                else
                {
                    m_Cmd.Parameters.AddWithValue("choice", 0);
                }
            }
            else
            {
                m_Cmd = new MySqlCommand("mapBoundsRadius", m_Conn);
                m_Cmd.CommandType = System.Data.CommandType.StoredProcedure;

                m_Cmd.Parameters.AddWithValue("neX", neX);
                m_Cmd.Parameters.AddWithValue("swX", swX);
                m_Cmd.Parameters.AddWithValue("neY", neY);
                m_Cmd.Parameters.AddWithValue("swY", swY);
                m_Cmd.Parameters.AddWithValue("centerX", centerX);
                m_Cmd.Parameters.AddWithValue("centerY", centerY);
                m_Cmd.Parameters.AddWithValue("rad", rad);

                if (neY < swY)
                {
                    m_Cmd.Parameters.AddWithValue("choice", 1);
                }
                else
                {
                    m_Cmd.Parameters.AddWithValue("choice", 0);
                }
            }

            dataReader = m_Cmd.ExecuteReader();

            List<Photo> lst = new List<Photo>();

            while (dataReader.Read())
            {
                if (!dataReader.IsDBNull(2))
                {
                    Photo temp = new Photo(dataReader.GetString(0), dataReader.GetString(1), dataReader.GetString(2), dataReader.GetDouble(3), dataReader.GetDouble(4), dataReader.GetDouble(5), dataReader.GetInt32(6), dataReader.GetString(7));
                    lst.Add(temp);
                }
                else
                {
                    deletePhoto(dataReader.GetString(0));
                }
            }

            dataReader.Close();
            m_Conn.Close();

            return lst;
        }

        [Route("api/deletePhotoById")]
        public HttpResponseMessage GetDeletePhotoById(string accessToken, string imgID)
        {
            var result = new HttpResponseMessage();
            result.StatusCode = HttpStatusCode.BadRequest;

            string username = AccessToken.searchUserByAccessToken(accessToken);
            string photoOwnerUsername = getUserByPhotoID(imgID);

            if (username != null && photoOwnerUsername != null)
            {
                if (username.Equals(photoOwnerUsername))
                {
                    deletePhoto(imgID);
                    result.StatusCode = HttpStatusCode.OK;
                }
            }
            return result;
        }

        private string getUserByPhotoID(string imgID)
        {
            MySqlConnection m_Conn;
            MySqlCommand m_Cmd;
            MySqlDataReader dataReader;
            string username = null;

            m_Conn = new MySqlConnection(Security.ConnectionDetails());
            m_Conn.Open();

            ////stored procedure
            m_Cmd = new MySqlCommand("getUserByPhotoId", m_Conn);

            m_Cmd.CommandType = System.Data.CommandType.StoredProcedure;

            m_Cmd.Parameters.AddWithValue("id", imgID);

            dataReader = m_Cmd.ExecuteReader();

            while (dataReader.Read())
            {
                if (dataReader.HasRows)
                {
                    username = dataReader.GetString(0);
                }
            }
            dataReader.Close();
            m_Conn.Close();

            return username;
        }

    private void deletePhoto(string id)
        {
            MySqlConnection m_Conn;
            MySqlCommand m_Cmd;
            MySqlDataReader dataReader;

            //// delete photo from mysql
            m_Conn = new MySqlConnection(Security.ConnectionDetails());
            m_Conn.Open();

            ////stored procedure
            m_Cmd = new MySqlCommand("deletePhoto", m_Conn);

            m_Cmd.CommandType = System.Data.CommandType.StoredProcedure;

            m_Cmd.Parameters.AddWithValue("id", id);

            dataReader = m_Cmd.ExecuteReader();

            m_Conn.Close();

            //// delete photo from folder
            string filepath = HttpContext.Current.Server.MapPath("~//photos//" + id + ".jpg");
            string thumbnailpath = HttpContext.Current.Server.MapPath("~//photos//thumbnail_" + id + ".jpg");

            if (File.Exists(filepath))
            {
                try
                {
                    File.Delete(filepath);
                }
                catch (Exception ex)
                {
                    FileIOUtilities.SaveErrorToLog(ex.ToString()+" FilePath: "+filepath);
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
                    FileIOUtilities.SaveErrorToLog(ex.ToString() + " FilePath: " + filepath);
                }
            }
        }

        //// Get a row with the requested fields
        //// Builds table info and return it to client
        [Route("api/photodetails/{id}")]
        public IEnumerable<Photo> GetPhotoDetails(String id)
        {
            MySqlConnection m_Conn;
            MySqlCommand m_Cmd;
            MySqlDataReader dataReader;

            m_Conn = new MySqlConnection(Security.ConnectionDetails());
            m_Conn.Open();

            ////stored procedure
            m_Cmd = new MySqlCommand("getPhotoDetails", m_Conn);

            m_Cmd.CommandType = System.Data.CommandType.StoredProcedure;

            m_Cmd.Parameters.AddWithValue("id", id);

            dataReader = m_Cmd.ExecuteReader();

            List<Photo> lst = new List<Photo>();

            while (dataReader.Read())
            {
                Photo temp = new Photo(dataReader.GetString(0), dataReader.GetString(1), dataReader.GetString(2), dataReader.GetString(3), dataReader.GetInt32(4), dataReader.GetDouble(5), dataReader.GetDouble(6));
                lst.Add(temp);
            }

            dataReader.Close();
            m_Conn.Close();

            return lst;
        }
    }
}
