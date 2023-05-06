using Newtonsoft.Json;

namespace MTS.Application.LunchList;


// Root myDeserializedClass = JsonConvert.DeserializeObject<List<Root>>(myJsonResponse);
    public class LunchOfDayData
    {
        public string date { get; set; }
        public RestaurantData restaurantData { get; set; }
        public string dayData { get; set; }
        public decimal? predicted { get; set; }
    }


    public class LunchOfDayResponse
    {
        public Ref @ref { get; set; }
        public object ts { get; set; }
        public LunchOfDayData data { get; set; }
    }

