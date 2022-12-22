using System.Collections.Specialized;
using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using MediatR;
using Microsoft.Extensions.Configuration;

namespace MTS.Application.LunchList.Queries;

public record GetLunchListQuery : IRequest<IEnumerable<LunchListVm>>
{
  public int? StartDate { get; set; }
  public int? EndDate { get; set; }
  public int? RestaurantId { get; set; }
  public int? HandHeld { get; set; } = 0;
}

public class GetLunchListQueryHandler : IRequestHandler<GetLunchListQuery, IEnumerable<LunchListVm>>
{

  private readonly HttpClient _http;
  private readonly string? _apiUrl;

  public GetLunchListQueryHandler(HttpClient http, IApiUrlService apiUrlService)
  {
    _apiUrl = apiUrlService.ApiUrl;
    _http = http;
  }

  public async Task<IEnumerable<LunchListVm>> Handle(GetLunchListQuery request, CancellationToken cancellationToken)
  {
    try
    {
      Console.WriteLine("Haetaan ruokalistaa");
      var queryString = System.Web.HttpUtility.ParseQueryString(string.Empty);
      if (request.RestaurantId is not null)
        queryString.Add("ravintolaid", request.RestaurantId.ToString());
      if (request.StartDate is not null)
        queryString.Add("startdate", request.StartDate.ToString());
      if (request.EndDate is not null)
        queryString.Add("enddate", request.EndDate.ToString());
      // if (request.HandHeld is not null)
      //   queryString.Add("kasinyp",request.EndDate.ToString());

      var query = _apiUrl + "/.netlify/functions/lunchlists?";
      query += queryString.ToString();
      var lunchListRows = await _http.GetFromJsonAsync<LunchListResponse[]>(query);
      var query2 = _apiUrl + "/.netlify/functions/lunchofday?";
      query2 += queryString.ToString();
      var lunchOfDays = await _http.GetFromJsonAsync<LunchOfDayResponse[]>(query2);

      Console.WriteLine(JsonSerializer.Serialize(lunchOfDays));

      var lunchList = lunchListRows.Select(x => new LunchListVm(x,
        lunchOfDays.Any(y =>
          y.data.date == x.data.date && y.data.restaurantData.ravintolaid == x.data.restaurantData.ravintolaid)));

      return lunchList;
    }
    catch (Exception e)
    {
      Console.WriteLine(e);
      throw;
    }
  }
}

public class LunchListVm
{
  public LunchListVm(LunchListResponse lunchListResponse, bool lunchOfDay)
  {
    RefString = lunchListResponse.@ref.@ref.id;
    Restaurant = lunchListResponse.data.restaurantData;
    DateString = lunchListResponse.data.date;
    Lunch = lunchListResponse.data.dayData;
    LunchOfDay = lunchOfDay;
    Votes = lunchListResponse.data.votes;
  }

  public string RefString { get; set; }


  public bool LunchOfDay { get; set; }
  public int Votes { get; set; }

  public string Lunch { get; set; }

  public string DateString { get; set; }

  public RestaurantData Restaurant { get; set; }
}
