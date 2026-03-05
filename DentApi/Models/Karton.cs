using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace DentApi.Models
{
    public class Karton
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("pacijentId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string PacijentId { get; set; } = null!;

        [BsonElement("zubi")]
        public List<Zub> Zubi { get; set; } = new();

        [BsonElement("anamneza")]
        public string? Anamneza { get; set; }

        [BsonElement("alergije")]
        public List<string> Alergije { get; set; } = new();

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("azurirano")]
        public DateTime Azurirano { get; set; } = DateTime.UtcNow;

    }
}