using System.Net.Http.Json;
using MediatR;
using mtshome.web.Datas;
using mtshome.web.Datas.Models;
using mtshome.web.Extensions;

namespace MTS.Application.Restaurants.Queries;
public record GetRestaurantsQuery : IRequest<IEnumerable<Data<Restaurant>>>
{
}

public class GetRestaurantsQueryHandler : IRequestHandler<GetRestaurantsQuery, IEnumerable<Data<Restaurant>>>
{

  private readonly HttpClient _http;
  private readonly string? _apiUrl;
  private readonly GenericCrudService<Restaurant> _service;

  public GetRestaurantsQueryHandler(HttpClient http, IApiUrlService apiUrlService)
  {
    _service = new GenericCrudService<Restaurant>( apiUrlService);
    _apiUrl = apiUrlService.ApiUrl;
    _http = http;
  }

  public async Task<IEnumerable<Data<Restaurant>>> Handle(GetRestaurantsQuery request, CancellationToken cancellationToken)
  {
    try
    {
      var result = await _service.GetAll();
      return result;
    }
    catch (Exception e)
    {
      Console.WriteLine(e);
      throw;
    }
  }
}
public class Restaurant
{


  public int ravintolaid { get; set; }
  public int apiid { get; set; }

  public string nimi { get; set; }
  public int tassalista { get; set; }

  public string linkki { get; set; }
}
