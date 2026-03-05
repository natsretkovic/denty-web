using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace DentApi.Models
{
    public class Pacijent 
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("ime")]
        public string Ime { get; set; } = null!;

        [BsonElement("prezime")]
        public string Prezime { get; set; } = null!;

        [BsonElement("datumRodjenja")]
        public DateTime DatumRodjenja { get; set; }

        [BsonElement("jmbg")]
        public string Jmbg { get; set; } = null!;

        [BsonElement("brojTelefona")]
        public string BrojTelefona { get; set; } = null!;

        [BsonElement("email")]
        public string? Email { get; set; }

        [BsonElement("napomene")]
        public string? Napomene { get; set; }

        [BsonElement("kreiran")]
        public DateTime Kreiran { get; set; } = DateTime.UtcNow;
    }
}