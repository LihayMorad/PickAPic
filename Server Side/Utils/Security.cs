using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace WebApplication1
{
    public class Security
    {

        public static string ConnectionDetails()
        {
            try
            {
                string path = Environment.CurrentDirectory + "\\config.json";

                return FileIOUtilities.ReadLocalFile(path, "Connection"); // connection is the selected token
            }
            catch
            {
                return "error";
            }
        }

        public static string GetKey()
        {
            return FileIOUtilities.ReadLocalFile(Environment.CurrentDirectory + "\\key.json", "Key");
        }

        public static string ComputeSha256Hash(string rawData)
        {
            // Create a SHA256   
            using (SHA256 sha256Hash = SHA256.Create())
            {
                // ComputeHash - returns byte array  
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(rawData));

                // Convert byte array to a string   
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }
    }
}