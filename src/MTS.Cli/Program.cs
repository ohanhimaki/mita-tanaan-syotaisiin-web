using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using MTS.Cli.Components;
using MTS.Cli.Models;
using MTS.Cli.Services;
using RazorConsole.Core;

var options = CliOptions.Parse(args);

// --help tulostaa ohjeet ja poistuu
if (args.Contains("--help") || args.Contains("-h"))
{
    Console.WriteLine("🍽  mts – Mitä tänään syötäisiin?");
    Console.WriteLine();
    Console.WriteLine("KÄYTTÖ:");
    Console.WriteLine("  mts [päivä] [--prompt] [--refresh] [--help]");
    Console.WriteLine();
    Console.WriteLine("PÄIVÄ:");
    Console.WriteLine("  --ma / -ma    Maanantai");
    Console.WriteLine("  --ti / -ti    Tiistai");
    Console.WriteLine("  --ke / -ke    Keskiviikko");
    Console.WriteLine("  --to / -to    Torstai");
    Console.WriteLine("  --pe / -pe    Perjantai");
    Console.WriteLine("  (oletus: tänään, viikonlopulla perjantai)");
    Console.WriteLine();
    Console.WriteLine("VALITSIMET:");
    Console.WriteLine("  --prompt      Tulostaa lounaslistat plain textinä ja poistuu (ei TUI)");
    Console.WriteLine("  --refresh     Tyhjentää välimuistin ja hakee tuoreet tiedot");
    Console.WriteLine("  --help / -h   Tämä ohje");
    Console.WriteLine();
    Console.WriteLine("ESIMERKIT:");
    Console.WriteLine("  mts                  Avaa interaktiivisen näkymän tälle päivälle");
    Console.WriteLine("  mts --ti             Tiistain listat interaktiivisesti");
    Console.WriteLine("  mts --prompt         Tämän päivän listat tekstinä");
    Console.WriteLine("  mts --prompt --ke    Keskiviikon listat tekstinä");
    Console.WriteLine("  mts --refresh        Päivittää välimuistin ja avaa TUI:n");
    return;
}

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

// --prompt tulostaa lounaslistat plain textinä ja poistuu
if (options.PromptMode)
{
    var items = lunchData.Lists
        .Where(x => x.DayNumber == options.SelectedDay || x.DayNumber == 999)
        .OrderBy(x => x.RestaurantName)
        .ToList();

    Console.WriteLine($"# {options.DayNameFi}n lounaslistat");
    Console.WriteLine();

    foreach (var item in items)
    {
        var emoji = item.Emoji ?? "🍴";
        Console.WriteLine($"## {emoji} {item.RestaurantName}");
        if (item.HasNoData || string.IsNullOrWhiteSpace(item.DescriptionHtml))
        {
            Console.WriteLine("(ei lounaslistaa tänään)");
        }
        else
        {
            foreach (var line in item.DescriptionHtml.Split('\n', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries))
                Console.WriteLine(line);
        }
        Console.WriteLine();
    }

    return;
}

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
