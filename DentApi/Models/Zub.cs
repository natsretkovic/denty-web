using MongoDB.Bson.Serialization.Attributes;

namespace DentApi.Models
{
    public class Zub
    {
        [BsonElement("brojZuba")]
        public int BrojZuba { get; set; }

        [BsonElement("vilica")]
        public string Vilica { get; set; }

        [BsonElement("strana")]
        public string Strana { get; set; }

        [BsonElement("status")]
        public string Status { get; set; } = "zdrav";

        [BsonElement("procedure")]
        public List<Procedura> Procedure { get; set; } = new();

        [BsonElement("terapije")]
        public List<Terapija> Terapije { get; set; } = new();
    }
}