using HtmlAgilityPack;
using Newtonsoft.Json;

namespace MTS.Application.DataFetching;

public static class LunchListFetcher
{
  public static async Task<List<LunchListContainer>> GetLunchListAsync(List<RestaurantManagement> restaurants)
  {
    var lunchLists = new List<LunchListContainer>();
    foreach (var restaurant in restaurants)
    {
      try
      {
        if (restaurant.apiid == 0 || restaurant.apiid is null)
        {
            if(restaurant.list is not null)
            {
              var lunchList = new LunchListContainer(restaurant);
              lunchLists.Add(lunchList);
              continue;
            }
            if(restaurant.lists is not null)
            {
              var lists = restaurant.lists;
              if(lists.monday is not null)
              {
                var lunchList = new LunchListContainer(restaurant, 1);
                lunchLists.Add(lunchList);
              }
              if(lists.tuesday is not null)
              {
                var lunchList = new LunchListContainer(restaurant, 2);
                lunchLists.Add(lunchList);
              }
              if(lists.wednesday is not null)
              {
                var lunchList = new LunchListContainer(restaurant, 3);
                lunchLists.Add(lunchList);
              }
              if(lists.thursday is not null)
              {
                var lunchList = new LunchListContainer(restaurant, 4);
                lunchLists.Add(lunchList);
              }
              if(lists.friday is not null)
              {
                var lunchList = new LunchListContainer(restaurant, 5);
                lunchLists.Add(lunchList);
              }
              continue;
            }
        }
        Console.WriteLine($"Fetching data for: {restaurant.nimi} (API ID: {restaurant.apiid})");
        var url = GetUrl((int)restaurant.apiid);

        var client = new HttpClient();
        var response = await client.GetAsync(url);
        
        if (!response.IsSuccessStatusCode)
        {
          Console.WriteLine($"❌ API error for {restaurant.nimi}: HTTP {response.StatusCode}");
          // Lisää ravintola ilman listaa jos halutaan näyttää se silti
          var emptyList = new LunchListContainer(restaurant);
          lunchLists.Add(emptyList);
          continue;
        }
        
        var content = await response.Content.ReadAsStringAsync();
        
        // Tarkista onko vastaus JSON
        if (string.IsNullOrWhiteSpace(content) || content.TrimStart().StartsWith("<"))
        {
          Console.WriteLine($"❌ Invalid response for {restaurant.nimi}: Response is not JSON (possibly HTML error page)");
          // Lisää ravintola ilman listaa
          var emptyList = new LunchListContainer(restaurant);
          lunchLists.Add(emptyList);
          continue;
        }
        
        Root? parsed;
        try
        {
          parsed = JsonConvert.DeserializeObject<Root>(content);
        }
        catch (JsonException jsonEx)
        {
          Console.WriteLine($"❌ JSON parse error for {restaurant.nimi}: {jsonEx.Message}");
          // Lisää ravintola ilman listaa
          var emptyList = new LunchListContainer(restaurant);
          lunchLists.Add(emptyList);
          continue;
        }
        
        if (parsed?.ads == null || parsed.ads.Length == 0)
        {
          Console.WriteLine($"⚠️ No ads found for {restaurant.nimi}");
          // Lisää ravintola ilman listaa
          var emptyList = new LunchListContainer(restaurant);
          lunchLists.Add(emptyList);
          continue;
        }

        var doc = new HtmlDocument();
        var body = parsed.ads[parsed.ads.Length-1].ad.body;
        doc.LoadHtml(body);
        var nodes = doc.DocumentNode.ChildNodes;
        for (int i = 0; i < nodes.Count; i++)
        {
          var node = nodes[i];
          if (node.Attributes["class"].Value.Contains("lunchHeader"))
          {
            var day = node.Attributes["class"].Value;
            var dayNumber = day.Substring(day.Length - 1);

            Int32.TryParse(dayNumber, out var result);

            if (nodes[i + 1].Attributes["class"].Value.Contains("lunchDesc"))
            {
              var lunchList = new LunchListContainer(restaurant, result, nodes[i].InnerText, nodes[i + 1].InnerHtml);
              lunchLists.Add(lunchList);
            }
          }
        }
      }
      catch (Exception e)
      {
        Console.WriteLine($"❌ Unexpected error for {restaurant.nimi}: {e.Message}");
        Console.WriteLine(e.StackTrace);
        // Lisää ravintola ilman listaa myös odottamattomien virheiden tapauksessa
        var emptyList = new LunchListContainer(restaurant);
        lunchLists.Add(emptyList);
        continue;
      }
    }

    return lunchLists;
  }

  public static string GetUrl(int id)
  {
    return "https://tassa.fi/resources/shop/" +
           id.ToString() +
           "/allads?l=fi&im=true&page=0&limit=18&city=Sein%C3%A4joki&u=jlfktwr6&uit=mobi-web-prod";
  }
}
