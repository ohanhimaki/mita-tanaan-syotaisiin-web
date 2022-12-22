using System.Text.Json.Serialization;
using Newtonsoft.Json;

namespace mtshome.web.Datas.Models;

// Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse);
public class Collection
{
    public Reference reference { get; set; }
}

public class Data<T>
{
    public Reference? reference { get; set; }

    public long ts { get; set; }

    public T data { get; set; }

}



public class Reference
{
    [JsonPropertyName("reference")]
    public Reference2 reference { get; set; }
}
public class Reference2
{
    public string id { get; set; }
    public Collection collection { get; set; }
}

public class Response<T>
{
    public List<Data<T>> data { get; set; }
}
public class ResponseSingleResult<T> : Data<T>
{
}
public class OwnerReference
{
    public Reference reference { get; set; }
}