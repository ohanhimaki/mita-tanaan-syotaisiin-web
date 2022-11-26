using System.Text.Json;
using Microsoft.JSInterop;
using MTS.Application.LunchList.Queries;

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
    if (string.IsNullOrWhiteSpace(userVote) )
    {
      UserVotes = new UserVotesLocalStorage();
    }
    else
    {
      var userVoteObject = JsonSerializer.Deserialize<UserVotesLocalStorage>(userVote);
      UserVotes = userVoteObject ?? new UserVotesLocalStorage();

    }

    //Make event to update UI

    UserVotesStateChanged?.Invoke(this, EventArgs.Empty);
  }
  // Event to update UI
  public event EventHandler UserVotesStateChanged;

  private UserVotesLocalStorage? UserVotes { get; set; }

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
      UserVotesStateChanged?.Invoke(this, EventArgs.Empty);
      SaveUserVotes();
  }

  private async void SaveUserVotes()
  {
      await _ijsRuntime.InvokeVoidAsync("localStorage.setItem", "userVote", JsonSerializer.Serialize(UserVotes));
  }

  public bool IsUserVoted(LunchListVm lunchListRow)
  {
    if (UserVotes is null)
    {
      return false;
    }

    var day = UserVotes?.Days?
      .SingleOrDefault(x => x.DateKey == lunchListRow.DateString);
    if (day is null)
    {
      return false;
    }
     return day.RestaurantIds.Contains(lunchListRow.Restaurant.ravintolaid);
  }

  public bool AllowedToVote(LunchListVm lunchListRow)
  {
    if (UserVotes is null)
    {
      return false;
    }

    var day = UserVotes?.Days?
      .SingleOrDefault(x => x.DateKey == lunchListRow.DateString);
    if (day is null)
    {
      return true;
    }
      return day.RestaurantIds.Count < 3;

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

