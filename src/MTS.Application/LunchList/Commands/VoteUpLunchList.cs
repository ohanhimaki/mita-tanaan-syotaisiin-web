using System.Net.Http.Json;
using MediatR;
using Microsoft.Extensions.Configuration;

namespace MTS.Application.LunchList.Commands;

public class VoteUpLunchListCommand : IRequest<int>
{
  //http://localhost:8888/.netlify/functions/lunchlists?lunchlistref=349380262336922187&vote=1

  public string LunchListRef { get; set; }

}

public class VoteUpLunchListCommandHandler : IRequestHandler<VoteUpLunchListCommand, int>
{
  private readonly HttpClient _http;
  private readonly string? _apiUrl;

  public VoteUpLunchListCommandHandler(HttpClient http, IApiUrlService apiUrlService)
  {
    _apiUrl = apiUrlService.ApiUrl;
    _http = http;
  }

  public async Task<int> Handle(VoteUpLunchListCommand request, CancellationToken cancellationToken)
  {
    try
    {
      Console.WriteLine("Votetaan lounaslistaa " + request.LunchListRef);

      var queryString = System.Web.HttpUtility.ParseQueryString(string.Empty);
      queryString.Add("lunchlistref", request.LunchListRef);
      queryString.Add("vote", "1");

      var query = _apiUrl + "/.netlify/functions/lunchlists?";
      query += queryString.ToString();

      //no cors
      var response = await _http.PutAsync(query, null, cancellationToken);
      return 1;
    }
    catch (Exception e)
    {
      Console.WriteLine(e);
      throw;
    }
  }
}
