using MongoDB.Bson.Serialization.Attributes;

namespace DentApi.Models
{
    public class Terapija
    {
        [BsonElement("lek")]
        public string Lek { get; set; } = null!;

        [BsonElement("doza")]
        public string Doza { get; set; } = null!;

        [BsonElement("datumPrepisivanja")]
        public DateTime DatumPrepisivanja { get; set; }

        [BsonElement("datumZavrsetka")]
        public DateTime DatumZavrsetka { get; set; }

        [BsonElement("napomena")]
        public string? Napomena { get; set; }
    }
}