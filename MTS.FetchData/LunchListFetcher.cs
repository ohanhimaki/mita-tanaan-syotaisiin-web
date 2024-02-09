using HtmlAgilityPack;
using Newtonsoft.Json;

namespace MTS.FetchData;

public class RestaurantManagement
{
  public int ravintolaid { get; set; }
  public int? apiid { get; set; }
  public string nimi { get; set; }
  public int tassalista { get; set; }
  public string linkki { get; set; }
  public string? list { get; set; }
  public string? emoji { get; set; }
}

public static class LunchListFetcher
{
  public static async Task<List<LunchListContainer>> GetLunchListAsync(List<RestaurantManagement> restaurants)
  {
    // get url
    var lunchLists = new List<LunchListContainer>();
    foreach (var restaurant in restaurants)
    {
      try
      {
        if (restaurant.apiid == 0 || restaurant.apiid is null)
        {
            var lunchList = new LunchListContainer(restaurant);
            lunchLists.Add(lunchList);
        }
        var url = GetUrl((int)restaurant.apiid);

        // make get request
        var client = new HttpClient();
        var response = await client.GetAsync(url);
        // get response not async
        var content = await response.Content.ReadAsStringAsync();
        var parsed = JsonConvert.DeserializeObject<Root>(content);

        // get divs from response with class "lunchHeader"
        var doc = new HtmlDocument();
        doc.LoadHtml(parsed.ads[0].ad.body);
        // var nodes = doc.DocumentNode.SelectNodes("//div[@class='lunchHeader']");
        var nodes = doc.DocumentNode.ChildNodes;
        for (int i = 0; i < nodes.Count; i++)
        {
          var node = nodes[i];
          // _testOutputHelper.WriteLine(node.InnerText);
          // check if node class is "lunchHeader"
          if (node.Attributes["class"].Value.Contains("lunchHeader"))
          {
            // check if class attribute contains dayX, where x is any number, save that number into variable
            var day = node.Attributes["class"].Value;
            var dayNumber = day.Substring(day.Length - 1);

            Int32.TryParse(dayNumber, out var result);

            // _testOutputHelper.WriteLine(dayNumber);
            if (nodes[i + 1].Attributes["class"].Value.Contains("lunchDesc"))
            {
              var lunchList = new LunchListContainer(restaurant, result, nodes[i].InnerText, nodes[i + 1].InnerHtml);
              lunchLists.Add(lunchList);
            }
          }
        }

        // _testOutputHelper.WriteLine(parsed.ads[0].ad.body);


        // log response
        // _testOutputHelper.WriteLine(content);
      }
      catch (Exception e)
      {
        Console.WriteLine(e);
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
