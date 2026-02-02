namespace MTS.Application.DataFetching;

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
  public string? weeklyLunch { get; set; }
}
