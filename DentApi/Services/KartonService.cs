using DentApi.Models;
using MongoDB.Driver;
using MongoDB.Bson;
using DentApi.Dtos;


namespace DentApi.Services
{
    public class KartonServis
    {
        private readonly IMongoCollection<Karton> _kartoni;
        private readonly IMongoCollection<Pacijent> _pacijenti;


        public KartonServis(IMongoDatabase database)
        {
            _kartoni = database.GetCollection<Karton>("kartoni");
             _pacijenti = database.GetCollection<Pacijent>("pacijenti"); 

        }

        public async Task<Karton?> GetByPacijentIdAsync(string pacijentId) =>
            await _kartoni.Find(k => k.PacijentId == pacijentId).FirstOrDefaultAsync();

        public async Task CreateKartonAsync(Karton karton) =>
            await _kartoni.InsertOneAsync(karton);

        public async Task AddZubAsync(string pacijentId, Zub zub)
        {
            var update = Builders<Karton>.Update
                .Push(k => k.Zubi, zub)
                .Set(k => k.Azurirano, DateTime.UtcNow);

            await _kartoni.UpdateOneAsync(k => k.PacijentId == pacijentId, update);
        }

        public async Task AddProceduruAsync(string pacijentId, int brojZuba, Procedura procedura)
        {
            var filter = Builders<Karton>.Filter.And(
                Builders<Karton>.Filter.Eq(k => k.PacijentId, pacijentId),
                Builders<Karton>.Filter.ElemMatch(k => k.Zubi, z => z.BrojZuba == brojZuba)
            );

            var update = Builders<Karton>.Update
                .Push("zubi.$.procedure", procedura)
                //.Set("zubi.$.status", procedura.TipProcedure)
                .Set(k => k.Azurirano, DateTime.UtcNow);

            await _kartoni.UpdateOneAsync(filter, update);
        }

        public async Task UpdateAnamneza(string pacijentId, string anamneza)
        {
            var update = Builders<Karton>.Update
                .Set(k => k.Anamneza, anamneza)
                .Set(k => k.Azurirano, DateTime.UtcNow);

            await _kartoni.UpdateOneAsync(k => k.PacijentId == pacijentId, update);
        }
        public async Task IzmeniProceduruAsync(string pacijentId, int brojZuba, int indexIntervencije, Procedura novaIntervencija)
        {
            var filter = Builders<Karton>.Filter.And(
                Builders<Karton>.Filter.Eq(k => k.PacijentId, pacijentId),
                Builders<Karton>.Filter.ElemMatch(k => k.Zubi, z => z.BrojZuba == brojZuba)
            );

            var update = Builders<Karton>.Update
                .Set($"zubi.$.procedure.{indexIntervencije}", novaIntervencija)
                .Set(k => k.Azurirano, DateTime.UtcNow);

            await _kartoni.UpdateOneAsync(filter, update);
        }

        public async Task IzmeniStatusZubaAsync(string pacijentId, int brojZuba, string noviStatus)
        {
            var filter = Builders<Karton>.Filter.And(
                Builders<Karton>.Filter.Eq(k => k.PacijentId, pacijentId),
                Builders<Karton>.Filter.ElemMatch(k => k.Zubi, z => z.BrojZuba == brojZuba)
            );

            var update = Builders<Karton>.Update
                .Set("zubi.$.status", noviStatus)
                .Set(k => k.Azurirano, DateTime.UtcNow);

            await _kartoni.UpdateOneAsync(filter, update);
        }

        public async Task AddTerapijuAsync(string pacijentId, int brojZuba, Terapija terapija)
        {
            var filter = Builders<Karton>.Filter.And(
                Builders<Karton>.Filter.Eq(k => k.PacijentId, pacijentId),
                Builders<Karton>.Filter.ElemMatch(k => k.Zubi, z => z.BrojZuba == brojZuba)
            );

            var update = Builders<Karton>.Update
                .Push("zubi.$.terapije", terapija)
                .Set(k => k.Azurirano, DateTime.UtcNow);

            await _kartoni.UpdateOneAsync(filter, update);
        }

        public async Task IzmeniTerapijuAsync(string pacijentId, int brojZuba, int indexTerapije, Terapija novaTerapija)
        {
            var filter = Builders<Karton>.Filter.And(
                Builders<Karton>.Filter.Eq(k => k.PacijentId, pacijentId),
                Builders<Karton>.Filter.ElemMatch(k => k.Zubi, z => z.BrojZuba == brojZuba)
            );

            var update = Builders<Karton>.Update
                .Set($"zubi.$.terapije.{indexTerapije}", novaTerapija)
                .Set(k => k.Azurirano, DateTime.UtcNow);

            await _kartoni.UpdateOneAsync(filter, update);
        }
        public async Task<PacijentKartonDto?> GetKartonSaPacijentomAsync(string pacijentId)
        {
            var karton = await _kartoni
            .Find(k => k.PacijentId == pacijentId)
            .FirstOrDefaultAsync();
            if (karton is null) return null;

            var pacijent = await _pacijenti
                .Find(p => p.Id == pacijentId)
                .FirstOrDefaultAsync();

            if (pacijent is null) return null;

            return new PacijentKartonDto
            {
                Karton = karton,
                Pacijent = pacijent
            };
        }
    }
}