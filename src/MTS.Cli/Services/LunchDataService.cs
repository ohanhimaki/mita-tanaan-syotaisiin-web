using System.Globalization;
using System.Reflection;
using System.Text.Json;
using HtmlAgilityPack;
using MTS.Application.DataFetching;
using MTS.Cli.Models;

namespace MTS.Cli.Services;

public class LunchDataService
{
    public List<CachedLunchList> Lists { get; private set; } = new();
    public bool IsLoaded { get; private set; } = false;
    public bool LoadedFromCache { get; private set; } = false;

    private static string GetCacheKey()
    {
        var now = DateTime.Now;
        var week = ISOWeek.GetWeekOfYear(now);
        return $"{now.Year}-W{week:D2}";
    }

    private static string GetCachePath(string cacheKey)
    {
        var dir = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.UserProfile),
            ".mts");
        Directory.CreateDirectory(dir);
        return Path.Combine(dir, $"cache_{cacheKey}.json");
    }

    private static List<RestaurantManagement> LoadRestaurants()
    {
        var assembly = Assembly.GetExecutingAssembly();
        using var stream = assembly.GetManifestResourceStream("restaurants.json")!;
        return JsonSerializer.Deserialize<List<RestaurantManagement>>(stream,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true })!;
    }

    public async Task LoadAsync()
    {
        if (IsLoaded) return;

        var cacheKey = GetCacheKey();
        var cachePath = GetCachePath(cacheKey);

        if (File.Exists(cachePath))
        {
            var json = await File.ReadAllTextAsync(cachePath);
            Lists = JsonSerializer.Deserialize<List<CachedLunchList>>(json) ?? new();
            LoadedFromCache = true;
        }
        else
        {
            var restaurants = LoadRestaurants();
            var containers = await LunchListFetcher.GetLunchListAsync(restaurants);

            Lists = containers.Select(c => new CachedLunchList
            {
                RestaurantName = c.RestaurantManagement.nimi?.Trim() ?? "",
                Emoji = c.RestaurantManagement.emoji,
                DayNumber = c.DayNumber,
                DayTitle = c.DayTitle,
                DescriptionHtml = StripHtml(c.DescriptionHtml),
                HasNoData = c.HasNoData
            }).ToList();

            await File.WriteAllTextAsync(cachePath, JsonSerializer.Serialize(Lists));
        }

        IsLoaded = true;
    }

    private static string StripHtml(string? html)
    {
        if (string.IsNullOrWhiteSpace(html)) return "";
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        return doc.DocumentNode.InnerText
            .Replace("&amp;", "&")
            .Replace("&nbsp;", " ")
            .Trim();
    }
}
