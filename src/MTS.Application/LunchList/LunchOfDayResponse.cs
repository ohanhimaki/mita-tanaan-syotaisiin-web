using Newtonsoft.Json;

namespace MTS.Application.LunchList;


// Root myDeserializedClass = JsonConvert.DeserializeObject<List<Root>>(myJsonResponse);
    public class LunchOfDayData
    {
        public string date { get; set; }
        public RestaurantData restaurantData { get; set; }
        public string dayData { get; set; }
    }

    // public class Ref
    // {
    //     [JsonProperty("@ref")]
    //     public Ref @ref { get; set; }
    // }

    // public class Ref2
    // {
    //     public string id { get; set; }
    //     public Collection collection { get; set; }
    // }

    // public class RestaurantData
    // {
    //     public int ravintolaid { get; set; }
    //     public int apiid { get; set; }
    //     public string nimi { get; set; }
    //     public int tassalista { get; set; }
    //     public string linkki { get; set; }
    // }

    public class LunchOfDayResponse
    {
        public Ref @ref { get; set; }
        public object ts { get; set; }
        public LunchOfDayData data { get; set; }
    }

