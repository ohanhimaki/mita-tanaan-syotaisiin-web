using System.Text.Json.Serialization;
using Newtonsoft.Json;

namespace MTS.Application.LunchList;


// Root myDeserializedClass = JsonSerializer.Deserialize<List<Root>>(myJsonResponse);
    public class Collection
    {
        [JsonPropertyName("@ref")]
        public Ref @ref { get; set; }
    }

    public class Data
    {
        [JsonPropertyName("date")]
        public string date { get; set; }

        [JsonPropertyName("restaurantData")]
        public RestaurantData restaurantData { get; set; }

        [JsonPropertyName("dayData")]
        public string dayData { get; set; }
    }

    public class Ref
    {
        [JsonPropertyName("@ref")]
        public Ref2 @ref { get; set; }
    }

    public class Ref2
    {
        [JsonPropertyName("id")]
        public string id { get; set; }

        [JsonPropertyName("collection")]
        public Collection collection { get; set; }
    }

    public class RestaurantData
    {
        [JsonPropertyName("ravintolaid")]
        public int ravintolaid { get; set; }

        [JsonPropertyName("apiid")]
        public int apiid { get; set; }

        [JsonPropertyName("nimi")]
        public string nimi { get; set; }

        [JsonPropertyName("tassalista")]
        public int tassalista { get; set; }

        [JsonPropertyName("linkki")]
        public string linkki { get; set; }
    }

    public class LunchListResponse
    {
        [JsonPropertyName("ref")]
        public Ref @ref { get; set; }

        [JsonPropertyName("ts")]
        public object ts { get; set; }

        [JsonPropertyName("data")]
        public Data data { get; set; }
    }

