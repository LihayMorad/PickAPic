using Newtonsoft.Json.Linq;
using System;
using System.IO;

namespace WebApplication1
{
    public class FileIOUtilities
    {

        public static string ReadLocalFile(string path, string selectedToken)
        {
            Directory.SetCurrentDirectory(AppDomain.CurrentDomain.BaseDirectory);

            var jsonPath = File.ReadAllText(path);

            JObject jObject = JObject.Parse(jsonPath);

            return (string)jObject.SelectToken(selectedToken);
        }

        public static void SaveErrorToLog(string error)
        {
            string path = "Log.txt";

            if (!File.Exists(path))
            {
                // Create a file to write to.
                using (StreamWriter sw = File.CreateText(path)) { }
            }

            // This text is always added, making the file longer over time
            // if it is not deleted.
            using (StreamWriter sw = File.AppendText(path))
            {
                sw.WriteLine(string.Format(@"{0} - ERROR: {1}", DateTime.Now.ToString(), error));
            }
        }
    }
}