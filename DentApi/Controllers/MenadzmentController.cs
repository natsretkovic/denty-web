using DentApi.Models;
using DentApi.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson.Serialization.Serializers;
using MongoDB.Bson.Serialization;
using MongoDB.Bson;

namespace DentApi.Controllers
{
    [ApiController]
    [Route("api/menadzment")]
    public class MenadzmentController : ControllerBase
    {
        private readonly MenadzmentServis _menadzmentServis;

        public MenadzmentController(MenadzmentServis menadzmentServis)
        {
            _menadzmentServis = menadzmentServis;
        }


        [HttpGet("lekari")]
        public async Task<IActionResult> PreuzmiSveLekare() =>
            Ok(await _menadzmentServis.GetAllLekariAsync());

        [HttpGet("lekari/{id}")]
        public async Task<IActionResult> PreuzmiLekaraPoId(string id)
        {
            var lekar = await _menadzmentServis.GetLekarByIdAsync(id);
            if (lekar is null) return NotFound();
            return Ok(lekar);
        }

        [HttpPost("lekari")]
        public async Task<IActionResult> KreirajLekara([FromBody] Lekar lekar)
        {
            await _menadzmentServis.CreateLekarAsync(lekar);
            return CreatedAtAction(nameof(PreuzmiLekaraPoId), new { id = lekar.Id }, lekar);
        }

        [HttpPut("lekari/{id}")]
        public async Task<IActionResult> AzurirajLekara(string id, [FromBody] Lekar azuriran)
        {
            var postojeci = await _menadzmentServis.GetLekarByIdAsync(id);
            if (postojeci is null) return NotFound();

            azuriran.Id = id;
            await _menadzmentServis.UpdateLekarAsync(id, azuriran);
            return NoContent();
        }

        [HttpDelete("lekari/{id}")]
        public async Task<IActionResult> ObrisiLekara(string id)
        {
            var postojeci = await _menadzmentServis.GetLekarByIdAsync(id);
            if (postojeci is null) return NotFound();

            await _menadzmentServis.DeleteLekarAsync(id);
            return NoContent();
        }


        [HttpGet("statistike/najcesce-procedure")]
        public async Task<IActionResult> NajcesceProcedure()
        {
            var rezultat = await _menadzmentServis.NajcesceProcedureAsync();
            return Content(new BsonArray(rezultat).ToJson(), "application/json");
        }

        [HttpGet("statistike/najcesce-leceni-zubi")]
        public async Task<IActionResult> NajcesceLeceniZubi()
        {
            var rezultat = await _menadzmentServis.NajcesceLeceniZubiAsync();
            return Content(new BsonArray(rezultat).ToJson(), "application/json");
        }

        [HttpGet("statistike/najaktivniji-lekari")]
        public async Task<IActionResult> NajaktivnijiLekari()
        {
            var rezultat = await _menadzmentServis.NajaktivnijiLekariAsync();
            return Content(new BsonArray(rezultat).ToJson(), "application/json");
        }

        [HttpGet("statistike/najcesci-lekovi")]
        public async Task<IActionResult> NajcesciLekovi()
        {
            var rezultat = await _menadzmentServis.NajcesciLekoviAsync();
            return Content(new BsonArray(rezultat).ToJson(), "application/json");
        }

        [HttpGet("statistike/dnevni-obracun")]
        public async Task<IActionResult> DnevniObracun()
        {
            var rezultat = await _menadzmentServis.DnevniObracunAsync();
            return Content(new BsonArray(rezultat).ToJson(), "application/json");
        }

        [HttpGet("statistike/ukupan-prihod-danas")]
        public async Task<IActionResult> UkupanPrihodDanas()
        {
            var rezultat = await _menadzmentServis.UkupanPrihodDanasAsync();
            var json = rezultat.ToJson();
            return Content(json, "application/json");
        }
    }
}