namespace MTS.Application.DataFetching;

public class RestaurantManagement
{
  public int ravintolaid { get; set; }
  public int? apiid { get; set; } = null;
  public string nimi { get; set; }
  public int tassalista { get; set; }
  public string linkki { get; set; }
  public string? list { get; set; }
  public string? emoji { get; set; }
  public WeekdayLists? lists { get; set; }
}

public class WeekdayLists
{
    public string? monday { get; set; }
    public string? tuesday { get; set; }
    public string? wednesday { get; set; }
    public string? thursday { get; set; }
    public string? friday { get; set; }
}
