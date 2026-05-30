namespace MTS.Cli.Models;

public class CliOptions
{
    public int SelectedDay { get; init; }
    public bool PromptMode { get; init; }

    public static CliOptions Parse(string[] args)
    {
        var dayMap = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase)
        {
            ["--ma"] = 1, ["-ma"] = 1,
            ["--ti"] = 2, ["-ti"] = 2,
            ["--ke"] = 3, ["-ke"] = 3,
            ["--to"] = 4, ["-to"] = 4,
            ["--pe"] = 5, ["-pe"] = 5,
        };

        var promptMode = args.Contains("--prompt");
        foreach (var arg in args)
        {
            if (dayMap.TryGetValue(arg, out var day))
                return new CliOptions { SelectedDay = day, PromptMode = promptMode };
        }

        // Oletuksena tänään (viikonlopulla näytetään perjantai)
        var today = (int)DateTime.Now.DayOfWeek;
        return new CliOptions { SelectedDay = today is 0 or 6 ? 5 : today, PromptMode = promptMode };
    }

    public string DayNameFi => SelectedDay switch
    {
        1 => "Maanantai", 2 => "Tiistai", 3 => "Keskiviikko",
        4 => "Torstai", 5 => "Perjantai", _ => "?"
    };
}
