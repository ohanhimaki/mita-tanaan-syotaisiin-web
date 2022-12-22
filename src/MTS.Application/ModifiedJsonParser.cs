using mtshome.web.Datas.Models;
using Newtonsoft.Json;

namespace mtshome.web.Extensions;

public static class ModifiedJsonParser
{
  public static async Task<Response<T>[]> GetFromJsonFaunaAsync<T>(this HttpClient client, string url)
  {
    var jsonString =  await client.GetStringAsync(url);
    var json = jsonString.ToString()
      .Replace("\"ref\"", "\"reference\"")
      .Replace("\"@ref\"", "\"reference\"");
    var result = JsonConvert.DeserializeObject<Response<T>[]>(json);
    Console.WriteLine(JsonConvert.SerializeObject(result));

    return result;
  }
  public static async Task<ResponseSingleResult<T>> GetFromJsonFaunaSingleAsync<T>(this HttpClient client, string url)
  {
    var jsonString =  await client.GetStringAsync(url);
    var json = jsonString.ToString()
      .Replace("\"ref\"", "\"reference\"")
      .Replace("\"@ref\"", "\"reference\"");

    var result = JsonConvert.DeserializeObject<ResponseSingleResult<T>>(json);
    return result;
  }
  public static async Task<Data<T>> ReadFaunaResponseAsync<T>(this HttpResponseMessage response)
  {
    var jsonString = await response.Content.ReadAsStringAsync();
    var json = jsonString.ToString()
      .Replace("\"ref\"", "\"reference\"")
      .Replace("\"@ref\"", "\"reference\"");

    return JsonConvert.DeserializeObject<Data<T>>(json);

  }
}
