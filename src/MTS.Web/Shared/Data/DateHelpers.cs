namespace MTS.Web.Shared.Data;

public static class DateHelpers
{

  public static DateTime DateOfWeek(this DateTime date, DayOfWeek dayOfWeek, DayOfWeek startOfWeek = DayOfWeek.Monday)
  {
    //monday: -1 * (((int)DateTime.Now.DayOfWeek + 6) % 7);
    //sunday: 6 - (((int)DateTime.Now.DayOfWeek + 6) % 7);

    var currentDay = date.DayOfWeek;

    var daysToAdd = ((int)dayOfWeek + 6) % 7 - ((int)currentDay + 6) % 7;
    if (daysToAdd < 0)
    {
      // daysToAdd += 7;
    }

    return date.AddDays(daysToAdd);




    int diff = dayOfWeek - startOfWeek;
    if (diff < 0)
    {
      diff += 7;
    }
    return date.AddDays(diff - (int)date.DayOfWeek + (int)startOfWeek);
  }
  public static int ToInt(this DateTime date)
  {

    return date.Year * 10000 + date.Month * 100 + date.Day;
  }




}
