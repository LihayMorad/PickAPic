using Newtonsoft.Json.Linq;
using System;
using System.IO;

namespace WebApplication1
{
    public sealed class FileIOUtilities
    {
        private static FileIOUtilities instance = null;
        private static readonly object padlock = new object();

        FileIOUtilities() { }

        public static FileIOUtilities Instance
        {
            get
            {
                lock (padlock)
                {
                    if (instance == null)
                    {
                        instance = new FileIOUtilities();
                    }

                    return instance;
                }
            }
        }

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