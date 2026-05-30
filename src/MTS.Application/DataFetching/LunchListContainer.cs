namespace MTS.Application.DataFetching;

public class LunchListContainer
{
  private string? _descriptionHtml;

  public RestaurantManagement RestaurantManagement { get; set; } = null!;

  public LunchListContainer() { }

  public LunchListContainer(RestaurantManagement restaurantManagement, int dayNumber, string dayTitle,
    string descriptionHtml)
  {
    RestaurantManagement = restaurantManagement;
    DayNumber = dayNumber;
    DayTitle = dayTitle;
    DescriptionHtml = descriptionHtml;
  }

  public LunchListContainer(RestaurantManagement restaurantManagement)
  {
    RestaurantManagement = restaurantManagement;
    DayNumber = 999;
    HasNoData = true; // Merkitään että dataa ei ole saatavilla
  }

  public LunchListContainer(RestaurantManagement restaurantManagement, int dayNumber)
  {
    RestaurantManagement = restaurantManagement;
    DayNumber = dayNumber;
  }
  
  public bool HasNoData { get; set; } = false;

  public void HighlightBestFoods(Dictionary<string, List<string>> bestFoods)
  {
    var bestFoodTitles = new List<string>();
    foreach (var bestFood in bestFoods)
    {
      foreach (var keyword in bestFood.Value)
      {
        if (DescriptionHtml.ToLower().Contains(keyword.ToLower()))
        {
          Console.WriteLine("tuulee tänne" + keyword);
          bestFoodTitles.Add(bestFood.Key);
        }
      }
    }
    if (bestFoodTitles.Count > 0)
    {
      BestFoodTitles = bestFoodTitles;
    }
  }

  public List<string> BestFoodTitles { get; set; } = new();

  public int DayNumber { get; set; }

  public string DescriptionHtml
  {
    get
    {
      if (_descriptionHtml is not null)
      {
        return _descriptionHtml;
      }
      else if (RestaurantManagement.list is not null)
      {
        return RestaurantManagement.list;
      }
      else if (RestaurantManagement.lists is not null)
      {
        switch(DayNumber){
          case 1:
              return RestaurantManagement.lists?.monday ?? string.Empty;
          case 2:
              return RestaurantManagement.lists?.tuesday ?? string.Empty;
          case 3:
              return RestaurantManagement.lists?.wednesday ?? string.Empty;
          case 4:
              return RestaurantManagement.lists?.thursday ?? string.Empty;
          case 5:
              return RestaurantManagement.lists?.friday ?? string.Empty;
          default:
            return string.Empty;
        }
      }
      else
      {
        return string.Empty;
      }
    }
    set => _descriptionHtml = value;
  }

  public string? DayTitle { get; set; }
}
