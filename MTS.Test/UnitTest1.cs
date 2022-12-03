using System;
using MTS.Web.Shared.Data;
using NUnit.Framework;

namespace MTS.Test;

public class Tests
{
  [SetUp]
  public void Setup()
  {
  }

  [Test]
  public void DateOfWeekShouldReturnCorrectly()
  {
    var date = new DateTime(2022, 12, 3);
    var dateShouldBe =new DateTime(2022, 11, 28);
    var dateOfWeek = date.DateOfWeek(DayOfWeek.Monday);
    var date2 = new DateTime(2022, 11, 27);
    var dateShouldBe2 =new DateTime(2022, 11, 26);
    var dateOfWeek2 = date2.DateOfWeek(DayOfWeek.Saturday);
    Assert.AreEqual(dateShouldBe, dateOfWeek);
    Assert.AreEqual(dateShouldBe2, dateOfWeek2);
    Assert.Pass();
  }
}
