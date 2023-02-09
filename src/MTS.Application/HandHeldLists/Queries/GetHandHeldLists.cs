using System.Net.Http.Json;
using MediatR;
using mtshome.web.Datas;
using mtshome.web.Datas.Models;
using mtshome.web.Extensions;

namespace MTS.Application.HandHeldLists.Queries;
public record GetHandHeldListsQuery : IRequest<IEnumerable<Data<HandHeldList>>>
{
}

public class GetHandHeldListsQueryHandler : IRequestHandler<GetHandHeldListsQuery, IEnumerable<Data<HandHeldList>>>
{

  private readonly HttpClient _http;
  private readonly string? _apiUrl;
  private readonly GenericCrudService<HandHeldList> _service;

  public GetHandHeldListsQueryHandler(HttpClient http, IApiUrlService apiUrlService)
  {
    _service = new GenericCrudService<HandHeldList>( apiUrlService);
    _apiUrl = apiUrlService.ApiUrl;
    _http = http;
  }

  public async Task<IEnumerable<Data<HandHeldList>>> Handle(GetHandHeldListsQuery request, CancellationToken cancellationToken)
  {
    try
    {

      var result = await _service.GetAll2();
      return result.SelectMany(x => x.data);
    }
    catch (Exception e)
    {
      Console.WriteLine(e);
      throw;
    }
  }
}
public class HandHeldList
{


  public string teksti { get; set; }

  public string rivi { get; set; }

  public string ravintolaid { get; set; }
}
