using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using MTS.Application;
using MTS.Web;
using MudBlazor.Services;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });
builder.Services.AddScoped<UserVoteService>();
builder.Services.AddApplicationServices();
builder.Services.AddMudServices();


if (builder.HostEnvironment.IsDevelopment())
{
  Console.WriteLine("Dev dependencies");
  builder.Services.AddScoped<IApiUrlService, DevelopmentApiUrl>();
}
else
{
  builder.Services.AddScoped<IApiUrlService, ApiUrlService>();
}

await builder.Build().RunAsync();
