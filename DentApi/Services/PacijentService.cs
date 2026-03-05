using DentApi.Models;
using MongoDB.Driver;
using MongoDB.Bson;


namespace DentApi.Services
{
    public class PacijentServis
    {
        private readonly IMongoCollection<Pacijent> _pacijenti;

        public PacijentServis(IMongoDatabase database)
        {
            _pacijenti = database.GetCollection<Pacijent>("pacijenti");
        }

        public async Task<List<Pacijent>> GetAllPacijentiAsync() =>
            await _pacijenti.Find(_ => true).ToListAsync();

        public async Task<Pacijent?> GetByIdAsync(string id) =>
            await _pacijenti.Find(p => p.Id == id).FirstOrDefaultAsync();

        public async Task CreatePacijentAsync(Pacijent pacijent) =>
            await _pacijenti.InsertOneAsync(pacijent);

        public async Task UpdatePacijentAsync(string id, Pacijent azuriran) =>
            await _pacijenti.ReplaceOneAsync(p => p.Id == id, azuriran);

        public async Task DeletePacijentAsync(string id) =>
            await _pacijenti.DeleteOneAsync(p => p.Id == id);

        public async Task<Pacijent?> GetByJmbgAsync(string jmbg) =>
            await _pacijenti.Find(p => p.Jmbg == jmbg).FirstOrDefaultAsync();
    }
}