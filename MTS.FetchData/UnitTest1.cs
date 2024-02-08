using HtmlAgilityPack;
using Newtonsoft.Json;
using Xunit.Abstractions;

namespace MTS.FetchData;

public class UnitTest1
{
  private readonly ITestOutputHelper _testOutputHelper;

  public UnitTest1(ITestOutputHelper testOutputHelper)
  {
    _testOutputHelper = testOutputHelper;
  }

  [Fact]
  public void Test1()
  {

    var url = GetUrl(1525495);

    // make get request
    var client = new HttpClient();
    var response = client.GetAsync(url).Result;
    var content = response.Content.ReadAsStringAsync().Result;
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
        // _testOutputHelper.WriteLine(dayNumber);
        if (nodes[i + 1].Attributes["class"].Value.Contains("lunchDesc"))
        {
          _testOutputHelper.WriteLine(nodes[i].InnerText);
          _testOutputHelper.WriteLine(nodes[i + 1].InnerHtml);
        }


      }
    }

    // _testOutputHelper.WriteLine(parsed.ads[0].ad.body);



    // log response
    // _testOutputHelper.WriteLine(content);


  }

  public string GetUrl(int id)
  {
    return "https://tassa.fi/resources/shop/" +
    id.ToString() +
    "/allads?l=fi&im=true&page=0&limit=18&city=Sein%C3%A4joki&u=jlfktwr6&uit=mobi-web-prod";

  }

}

public class Root
{
    public Ads[] ads { get; set; }
}

public class Ads
{
    public Ad ad { get; set; }
}

public class Ad
{
    public string header { get; set; }
    public string body { get; set; }
    public object imgurl { get; set; }
    public object wwwurl { get; set; }
    public string shopid { get; set; }
    public string poiId { get; set; }
    public string id { get; set; }
    public string type { get; set; }
    public int contentType { get; set; }
    public string timestamp { get; set; }
    public string weeklyLunch { get; set; }
}


