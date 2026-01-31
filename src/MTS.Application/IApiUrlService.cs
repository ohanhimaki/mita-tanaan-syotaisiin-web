using Microsoft.Extensions.Configuration;

namespace MTS.Application;

public interface IApiUrlService
{
    public string ApiUrl { get; set; }
}

public class ApiUrlService : IApiUrlService
{
    private readonly IConfiguration _configuration;
    public ApiUrlService(IConfiguration configuration)
    {
        _configuration = configuration;
        ApiUrl = _configuration["ApiUrl"] ?? string.Empty;
    }
    public string ApiUrl { get; set; }
}

public class DevelopmentApiUrl : IApiUrlService
{
    public string ApiUrl { get; set; } = "http://localhost:8888";
}
