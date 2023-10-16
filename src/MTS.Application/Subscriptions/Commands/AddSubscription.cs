using System.Text;
using MediatR;
using Newtonsoft.Json;

namespace MTS.Application.Subscriptions.Commands;

public class AddSubscription : IRequest<int>
{
    public SubscriptionInformation subscriptionInformation { get; set; }

}

public class AddSubscriptionHandler : IRequestHandler<AddSubscription, int>
{
  private readonly HttpClient _http;
  private readonly string? _apiUrl;

  public AddSubscriptionHandler(HttpClient http, IApiUrlService apiUrlService)
  {
    _http = http;
    _apiUrl = apiUrlService.ApiUrl;
  }

  public Task<int> Handle(AddSubscription request, CancellationToken cancellationToken)
  {
    var query = _apiUrl + "/.netlify/functions/subscriptions";
    // send subscriptioninformation in body
    var json = JsonConvert.SerializeObject(request.subscriptionInformation);
    var data = new StringContent(json, Encoding.UTF8, "application/json");
    var response = _http.PostAsync(query, data, cancellationToken);
    return Task.FromResult(1);
  }
}

public class SubscriptionInformation
{
    public string endpoint { get; set; }
    public Keys keys { get; set; }
}

public class Keys
{
    public string p256dh { get; set; }
    public string auth { get; set; }
}


