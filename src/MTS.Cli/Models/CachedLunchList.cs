namespace MTS.Cli.Models;

public class CachedLunchList
{
    public string RestaurantName { get; set; } = "";
    public string? Emoji { get; set; }
    public int DayNumber { get; set; }
    public string? DayTitle { get; set; }
    public string DescriptionHtml { get; set; } = "";
    public bool HasNoData { get; set; }
}
