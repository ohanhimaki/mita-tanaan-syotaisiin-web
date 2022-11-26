using System.Text.Json;
using Microsoft.JSInterop;

namespace MTS.Web;

public class UserVoteService
{
  private readonly IJSRuntime _ijsRuntime;

  public UserVoteService(IJSRuntime ijsRuntime)
  {
    _ijsRuntime = ijsRuntime;

    InitializeUserVoteService();





  }

  private async void InitializeUserVoteService()
  {
    var currentDay = DateTime.Now.ToString("yyyyMMdd");

    var userVote = await _ijsRuntime.InvokeAsync<string>("localStorage.getItem", "userVote");
    var userVoteObject = JsonSerializer.Deserialize<UserVotesLocalStorage>(userVote);
    UserVotes = userVoteObject ?? new UserVotesLocalStorage();
  }

  private UserVotesLocalStorage UserVotes { get; set; }

  public async void AddVote(string dateKey, int restaurantId)
  {
      var date = UserVotes.Days.SingleOrDefault(x => x.DateKey == dateKey);
      if (date is null)
      {
        UserVotes.Days.Add(new Day()
        {
          DateKey = dateKey,
          RestaurantIds = new List<int>(){restaurantId}
        });
      }
      else
      {
        date.RestaurantIds.Add(restaurantId);
      }
      SaveUserVotes();
  }

  private async void SaveUserVotes()
  {
      await _ijsRuntime.InvokeVoidAsync("localStorage.setItem", "userVote", JsonSerializer.Serialize(UserVotes));
  }
}

public class UserVotesLocalStorage
{
  public List<Day> Days { get; set; } = new List<Day>();
}

public class Day
{
  public string DateKey { get; set; }
  public List<int> RestaurantIds { get; set; } = new List<int>();
}

