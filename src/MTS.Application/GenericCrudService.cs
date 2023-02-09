using System.Net;
using System.Text;
using mtshome.web.Datas.Models;
using mtshome.web.Extensions;
using Newtonsoft.Json;

namespace mtshome.web.Datas;

public class GenericCrudService<T>
{
  private readonly string? _apiUrl;
  private readonly  IApiUrlService _apiUrlService;


  public GenericCrudService(IApiUrlService apiUrlService)
  {
    _apiUrlService = apiUrlService;
    _apiUrl = _apiUrlService.ApiUrl;
  }
  public async Task<List<ResponseSingleResult<T>>?> GetAll()
  {
    try
    {

      var url = $"{_apiUrl}/.netlify/functions/{typeof(T).Name}";
      var client = new HttpClient();
      await client.GetFromJsonFaunaAsync<T>(url);
      return new List<ResponseSingleResult<T>>();

    }
    catch (Exception e)
    {
      Console.WriteLine(e);
      throw;
    }
  }
  public async Task<List<Response<T>>?> GetAll2()
  {
    try
    {

      var url = $"{_apiUrl}/.netlify/functions/{typeof(T).Name}";
      var client = new HttpClient();
      return await client.GetFromJsonFaunaAsync2<T>(url);


    }
    catch (Exception e)
    {
      Console.WriteLine(e);
      throw;
    }
  }
  public async Task<Data<T>> Add(T data)
  {
    var url = $"{_apiUrl}/.netlify/functions/{typeof(T).Name}/";
    var client = new HttpClient();
    var content = new StringContent(JsonConvert.SerializeObject(data), Encoding.UTF8, "application/json");
    var result = await client.PostAsync(url, content);
    if (!result.IsSuccessStatusCode)
    {
      throw new Exception("Failed to save");
    }

    return await result.ReadFaunaResponseAsync<T>();
  }
  public async Task<Data<T>> Update(Data<T> data)
  {
    try
    {

      var url = $"{_apiUrl}/.netlify/functions/{typeof(T).Name}/{data.reference.reference.id}";
      var client = new HttpClient();
      var content = new StringContent(JsonConvert.SerializeObject(data.data), Encoding.UTF8, "application/json");
      var result = await client.PutAsync(url, content);
      if (!result.IsSuccessStatusCode)
      {
        if (result.StatusCode == HttpStatusCode.BadRequest) //TODO, pitäiskö tämä poistaaa??
        {
          return await Add(data.data);

        }
        throw new Exception("Failed to save");
      }

      return await result.ReadFaunaResponseAsync<T>();
    }
    catch (Exception e)
    {
      Console.WriteLine(e);
      throw;
    }
  }

  public async Task Delete(Data<T> data)
  {

    var url = $"{_apiUrl}/.netlify/functions/{typeof(T).Name}/{data.reference.reference.id}";
    var client = new HttpClient();
    var result = await client.DeleteAsync(url);
    if (!result.IsSuccessStatusCode)
    {
      throw new Exception("Failed to save");
    }
  }
}
