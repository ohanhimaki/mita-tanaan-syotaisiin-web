using System.Text.Json.Serialization;

namespace MTS.Application
{
    public class BestFood
    {
        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("searchTerms")]
        public ICollection<string> SearchTerms { get; set; }
    }
}
