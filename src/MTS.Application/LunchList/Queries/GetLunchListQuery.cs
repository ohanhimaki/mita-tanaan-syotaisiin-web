using System.Collections.Specialized;
using System.Net;
using System.Net.Http.Json;
using MediatR;

namespace MTS.Application.LunchList.Queries;

public record GetLunchListQuery : IRequest<IEnumerable<LunchListRow>>
{
  public int? StartDate { get; set; }
  public int? EndDate { get; set; }
  public int? RestaurantId { get; set; }
  public int? HandHeld { get; set; } = 0;
}

public class GetLunchListQueryHandler : IRequestHandler<GetLunchListQuery, IEnumerable<LunchListRow>>
{
  private readonly HttpClient _http;

  public GetLunchListQueryHandler(HttpClient http)
  {
    _http = http;
  }
  public async Task<IEnumerable<LunchListRow>> Handle(GetLunchListQuery request, CancellationToken cancellationToken)
  {
    var queryString = System.Web.HttpUtility.ParseQueryString(string.Empty);
    if (request.RestaurantId is not null)
      queryString.Add("ravintolaid",request.RestaurantId.ToString());
    if (request.StartDate is not null)
      queryString.Add("paiva",request.StartDate.ToString());
    if (request.EndDate is not null)
      queryString.Add("endDate",request.EndDate.ToString());
    if (request.HandHeld is not null)
      queryString.Add("kasinyp",request.EndDate.ToString());

    var query = "http://localhost:3002/api/listat?";
    query += queryString.ToString();
    var lunchListRows = await _http.GetFromJsonAsync<LunchListRow[]>(query);
    return lunchListRows;
  }
}
