using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace DentApi.Models
{
    public class Lekar 
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

        [BsonElement("brojTelefona")]
        public string BrojTelefona { get; set; } = null!;

        [BsonElement("email")]
        public string? Email { get; set; }

        [BsonElement("specijalizacija")]
        public string? Specijalizacija { get; set; }

    }
}