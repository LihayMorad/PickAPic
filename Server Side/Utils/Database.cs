using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace WebApplication1
{
    public sealed class Database
    {
        private static Database instance = null;
        private static readonly object padlock = new object();

        Database() { }

        public static Database Instance
        {
            get
            {
                lock (padlock)
                {
                    if (instance == null)
                    {
                        instance = new Database();
                    }

                    return instance;
                }
            }
        }

        public static string Connect()
        {
            try
            {
                Directory.SetCurrentDirectory(AppDomain.CurrentDomain.BaseDirectory);
                string path = Environment.CurrentDirectory + "\\config.json";

                var jsonPath = System.IO.File.ReadAllText(path);

                JObject jObject = JObject.Parse(jsonPath);

                string connection = (string)jObject.SelectToken("Connection");

                return connection;
            }
            catch
            {
                return "error";
                // unable to connect to server
            }
        }
    }
}