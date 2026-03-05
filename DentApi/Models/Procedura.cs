using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace DentApi.Models
{
    public class Procedura
    {
        [BsonElement("tipProcedure")]
        public string TipProcedure { get; set; } = null!; 

        [BsonElement("datumProcedure")]
        public DateTime DatumProcedure { get; set; }

        [BsonElement("opis")]
        public string? Opis { get; set; }

        [BsonElement("cena")]
        public decimal? Cena { get; set; }

        [BsonElement("imeStomatologa")]
        public string? ImeStomatologa { get; set; }

    }
}