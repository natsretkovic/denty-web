using DentApi.Models;
using MongoDB.Bson;
using MongoDB.Driver;

namespace DentApi.Services
{
    public class MenadzmentServis
    {
        private readonly IMongoCollection<Karton> _kartoni;
        private readonly IMongoCollection<Pacijent> _pacijenti;
        private readonly IMongoCollection<Lekar> _lekari;

        public MenadzmentServis(IMongoDatabase database)
        {
            _kartoni = database.GetCollection<Karton>("kartoni");
            _pacijenti = database.GetCollection<Pacijent>("pacijenti");
            _lekari = database.GetCollection<Lekar>("lekari");
        }

        public async Task<List<Lekar>> GetAllLekariAsync() =>
            await _lekari.Find(_ => true).ToListAsync();

        public async Task<Lekar?> GetLekarByIdAsync(string id) =>
            await _lekari.Find(l => l.Id == id).FirstOrDefaultAsync();

        public async Task CreateLekarAsync(Lekar lekar) =>
            await _lekari.InsertOneAsync(lekar);

        public async Task UpdateLekarAsync(string id, Lekar azuriran) =>
            await _lekari.ReplaceOneAsync(l => l.Id == id, azuriran);

        public async Task DeleteLekarAsync(string id) =>
            await _lekari.DeleteOneAsync(l => l.Id == id);

        public async Task<List<BsonDocument>> NajcesceProcedureAsync()
        {
            var pipeline = new[]
            {
                new BsonDocument("$unwind", "$zubi"),
                new BsonDocument("$unwind", "$zubi.procedure"),
                new BsonDocument("$group", new BsonDocument
                {
                    { "_id", "$zubi.procedure.tipProcedure" },
                    { "broj", new BsonDocument("$sum", 1) }
                }),
                new BsonDocument("$sort", new BsonDocument("broj", -1)),
                new BsonDocument("$limit", 5)
            };

            return await _kartoni.Aggregate<BsonDocument>(pipeline).ToListAsync();
        }

        public async Task<List<BsonDocument>> NajcesceLeceniZubiAsync()
        {
            var pipeline = new[]
            {
                new BsonDocument("$unwind", "$zubi"),
                new BsonDocument("$unwind", "$zubi.procedure"),
                new BsonDocument("$group", new BsonDocument
                {
                    { "_id", "$zubi.brojZuba" },
                    { "brojIntervencija", new BsonDocument("$sum", 1) }
                }),
                new BsonDocument("$sort", new BsonDocument("brojIntervencija", -1)),
                new BsonDocument("$limit", 10)
            };

            return await _kartoni.Aggregate<BsonDocument>(pipeline).ToListAsync();
        }

        public async Task<List<BsonDocument>> NajaktivnijiLekariAsync()
        {
            var pipeline = new[]
            {
                new BsonDocument("$unwind", "$zubi"),
                new BsonDocument("$unwind", "$zubi.procedure"),
                new BsonDocument("$group", new BsonDocument
                {
                    { "_id", "$zubi.procedure.imeStomatologa" },
                    { "brojProcedura", new BsonDocument("$sum", 1) },
                    { "ukupanPrihod", new BsonDocument("$sum", "$zubi.procedure.cena") }
                }),
                new BsonDocument("$sort", new BsonDocument("brojProcedura", -1))
            };

            return await _kartoni.Aggregate<BsonDocument>(pipeline).ToListAsync();
        }

        public async Task<List<BsonDocument>> NajcesciLekoviAsync()
        {
            var pipeline = new[]
            {
                new BsonDocument("$unwind", "$zubi"),
                new BsonDocument("$unwind", "$zubi.terapije"),
                new BsonDocument("$group", new BsonDocument
                {
                    { "_id", "$zubi.terapije.lek" },
                    { "brojPrepisivanja", new BsonDocument("$sum", 1) }
                }),
                new BsonDocument("$sort", new BsonDocument("brojPrepisivanja", -1)),
                new BsonDocument("$limit", 10)
            };

            return await _kartoni.Aggregate<BsonDocument>(pipeline).ToListAsync();
        }

        public async Task<List<BsonDocument>> DnevniObracunAsync()
        {
            var pocetakDana = DateTime.UtcNow.Date;
            var krajDana = pocetakDana.AddDays(1);

            var pipeline = new[]
            {
                new BsonDocument("$unwind", "$zubi"),
                new BsonDocument("$unwind", "$zubi.procedure"),
                new BsonDocument("$match", new BsonDocument("zubi.procedure.datumProcedure", new BsonDocument
                { 
                    { "$gte", pocetakDana },
                    { "$lt", krajDana }
                })),
                new BsonDocument("$group", new BsonDocument
                {
                    { "_id", "$zubi.procedure.imeStomatologa" },
                    { "brojProcedura", new BsonDocument("$sum", 1) },
                    { "ukupanPrihod", new BsonDocument("$sum", "$zubi.procedure.cena") },
                    { "procedure", new BsonDocument("$push", "$zubi.procedure.tipProcedure") }
                }),
                new BsonDocument("$sort", new BsonDocument("ukupanPrihod", -1))
            };

            return await _kartoni.Aggregate<BsonDocument>(pipeline).ToListAsync();
        }

        public async Task<List<BsonDocument>> UkupanPrihodDanasAsync()
        {
            var pocetakDana = new BsonDateTime(DateTime.UtcNow.Date);
            var krajDana = new BsonDateTime(DateTime.UtcNow.Date.AddDays(1));

            var pipeline = new[]
            {
                new BsonDocument("$unwind", "$zubi"),
                new BsonDocument("$unwind", "$zubi.procedure"),
                new BsonDocument("$match", new BsonDocument("zubi.procedure.datumProcedure", new BsonDocument
                {
                    { "$gte", pocetakDana },
                    { "$lt", krajDana }
                })),
                new BsonDocument("$group", new BsonDocument
                {
                    { "_id", BsonNull.Value },
                    { "ukupanPrihod", new BsonDocument("$sum", "$zubi.procedure.cena") },
                    { "ukupnoProcedura", new BsonDocument("$sum", 1) }
                })
            };

            return await _kartoni.Aggregate<BsonDocument>(pipeline).ToListAsync();
        }
    }
}