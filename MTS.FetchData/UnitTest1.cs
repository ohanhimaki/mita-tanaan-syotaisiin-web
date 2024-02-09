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
  public async void Test1()
  {
    // var lunchList = await LunchListFetcher.GetLunchListAsync(new List<int> { 1525495 });
    //
    // // check if lunchList is not empty
    // Assert.NotEmpty(lunchList);
  }

}

public class LunchListContainer
{
  public RestaurantManagement RestaurantManagement { get; set; }
  public LunchListContainer(RestaurantManagement restaurantManagement, int dayNumber, string dayTitle,
    string descriptionHtml)
  {
    RestaurantManagement = restaurantManagement;
    DayNumber = dayNumber;
    DayTitle = dayTitle;
    DescriptionHtml = descriptionHtml;
  }

  public int DayNumber { get; set; }

  public string DescriptionHtml { get; set; }

  public string DayTitle { get; set; }
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
