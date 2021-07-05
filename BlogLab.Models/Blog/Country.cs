using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace BlogLab.Models.Blog
{

    public class Country
    {
        public string Name { get; set; }


        public Country[] GetCountries()
        {
            string urlAddress = "https://restcountries.eu/rest/v2/all";

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(urlAddress);
            HttpWebResponse response = (HttpWebResponse)request.GetResponse();

            if (response.StatusCode == HttpStatusCode.OK)
            {
                Stream receiveStream = response.GetResponseStream();
                StreamReader readStream = null;

                if (response.CharacterSet == null)
                {
                    readStream = new StreamReader(receiveStream);
                }
                else
                {
                    readStream = new StreamReader(receiveStream, Encoding.GetEncoding(response.CharacterSet));
                }

                string data = readStream.ReadToEnd();

                var yourObject = JsonConvert.DeserializeObject<Country[]>(data);

                response.Close();
                readStream.Close();
                return yourObject;
            }
            return null;
        }

        public Country()
        {

        }

    }


}
