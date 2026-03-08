using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using MTS.Cli.Components;
using MTS.Cli.Models;
using MTS.Cli.Services;
using RazorConsole.Core;

var options = CliOptions.Parse(args);

// --refresh poistaa välimuistin ja hakee uudelleen
if (args.Contains("--refresh"))
{
    var cacheDir = Path.Combine(
        Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".mts");
    if (Directory.Exists(cacheDir))
    {
        foreach (var file in Directory.GetFiles(cacheDir, "cache_*.json"))
            File.Delete(file);
    }
    Console.WriteLine("🗑  Välimuisti tyhjennetty.");
}

// Ladataan data ennen hostin käynnistystä jotta komponentti saa sen heti
var lunchData = new LunchDataService();
await lunchData.LoadAsync();

var builder = Host.CreateDefaultBuilder(args)
    .UseRazorConsole<LunchView>()
    .ConfigureServices(services =>
    {
        services.AddSingleton(lunchData);
        services.AddSingleton(options);
    })
    .ConfigureLogging(logging =>
    {
        logging.ClearProviders();
    });

await builder.Build().RunAsync();
