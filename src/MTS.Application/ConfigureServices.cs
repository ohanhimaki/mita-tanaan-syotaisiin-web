using MediatR;
using Microsoft.Extensions.DependencyInjection;

namespace MTS.Application;

public static class ConfigureServices
{
  public static IServiceCollection AddApplicationServices(this IServiceCollection services)
  {
    services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(ConfigureServices).Assembly));
    services.AddScoped<IApiUrlService, ApiUrlService>();
    return services;
  }
}
