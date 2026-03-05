using DentApi.Models;
using DentApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace DentApi.Controllers
{
    [ApiController]
    [Route("api/lekar")]
    public class LekarController : ControllerBase
    {
        private readonly PacijentServis _pacijentServis;
        private readonly KartonServis _kartonServis;

        public LekarController(PacijentServis pacijentServis, KartonServis kartonServis)
        {
            _pacijentServis = pacijentServis;
            _kartonServis = kartonServis;
        }


        [HttpGet("svi_pacijenti")]
        public async Task<IActionResult> PreuzmiSvePacijente() =>
            Ok(await _pacijentServis.GetAllPacijentiAsync());

        [HttpGet("pacijenti/{id}")]
        public async Task<IActionResult> PreuzmiPacijentaPoId(string id)
        {
            var pacijent = await _pacijentServis.GetByIdAsync(id);
            if (pacijent is null) return NotFound();
            return Ok(pacijent);
        }

        [HttpGet("get_pacijenta/{jmbg}")]
        public async Task<IActionResult> PreuzmiPacijentaPoJmbg(string jmbg)
        {
            var pacijent = await _pacijentServis.GetByJmbgAsync(jmbg);
            if (pacijent is null) return NotFound();
            return Ok(pacijent);
        }

        [HttpPost("kreiraj_pacijenta")]
        public async Task<IActionResult> KreirajPacijenta([FromBody] Pacijent pacijent)
        {
            await _pacijentServis.CreatePacijentAsync(pacijent);
            return CreatedAtAction(nameof(PreuzmiPacijentaPoId), new { id = pacijent.Id }, pacijent);
        }

        [HttpPut("azuriraj_pacijenta/{id}")]
        public async Task<IActionResult> AzurirajPacijenta(string id, [FromBody] Pacijent azuriran)
        {
            var postojeci = await _pacijentServis.GetByIdAsync(id);
            if (postojeci is null) return NotFound();

            azuriran.Id = id;
            await _pacijentServis.UpdatePacijentAsync(id, azuriran);
            return NoContent();
        }

        [HttpDelete("obrisi_pacijenta/{id}")]
        public async Task<IActionResult> ObrisiPacijenta(string id)
        {
            var postojeci = await _pacijentServis.GetByIdAsync(id);
            if (postojeci is null) return NotFound();

            await _pacijentServis.DeletePacijentAsync(id);
            return NoContent();
        }

        [HttpGet("preuzmi_karton/{pacijentId}")]
        public async Task<IActionResult> PreuzmiKarton(string pacijentId)
        {
            var karton = await _kartonServis.GetKartonSaPacijentomAsync(pacijentId);
            if (karton is null) return NotFound();
            return Ok(karton);
        }

        [HttpPost("kreiraj_karton")]
        public async Task<IActionResult> KreirajKarton([FromBody] Karton karton)
        {
            await _kartonServis.CreateKartonAsync(karton);
            return CreatedAtAction(nameof(PreuzmiKarton), new { pacijentId = karton.PacijentId }, karton);
        }

        [HttpPost("dodaj_zub/{pacijentId}")]
        public async Task<IActionResult> DodajZub(string pacijentId, [FromBody] Zub zub)
        {
            var karton = await _kartonServis.GetByPacijentIdAsync(pacijentId);
            if (karton is null) return NotFound();

            await _kartonServis.AddZubAsync(pacijentId, zub);
            return NoContent();
        }

        [HttpPost("dodaj_proceduru/{pacijentId}/{brojZuba}")]
        public async Task<IActionResult> DodajProceduru(string pacijentId, int brojZuba, [FromBody] Procedura procedura)
        {
            var karton = await _kartonServis.GetByPacijentIdAsync(pacijentId);
            if (karton is null) return NotFound();

            await _kartonServis.AddProceduruAsync(pacijentId, brojZuba, procedura);
            return NoContent();
        }

        [HttpPut("izmeni_proceduru/{pacijentId}/{brojZuba}/{indexProcedure}")]
        public async Task<IActionResult> IzmeniProceduru(string pacijentId, int brojZuba, int indexProcedure, [FromBody] Procedura novaProcedura)
        {
            var karton = await _kartonServis.GetByPacijentIdAsync(pacijentId);
            if (karton is null) return NotFound();

            await _kartonServis.IzmeniProceduruAsync(pacijentId, brojZuba, indexProcedure, novaProcedura);
            return NoContent();
        }

        [HttpPatch("izmeni_status_zuba/{pacijentId}/{brojZuba}")]
        public async Task<IActionResult> IzmeniStatusZuba(string pacijentId, int brojZuba, [FromBody] string noviStatus)
        {
            var karton = await _kartonServis.GetByPacijentIdAsync(pacijentId);
            if (karton is null) return NotFound();

            await _kartonServis.IzmeniStatusZubaAsync(pacijentId, brojZuba, noviStatus);
            return NoContent();
        }

        [HttpPatch("azuriraj_anamnezu/{pacijentId}")]
        public async Task<IActionResult> AzurirajAnamnezu(string pacijentId, [FromBody] string anamneza)
        {
            var karton = await _kartonServis.GetByPacijentIdAsync(pacijentId);
            if (karton is null) return NotFound();

            await _kartonServis.UpdateAnamneza(pacijentId, anamneza);
            return NoContent();
        }

        [HttpPost("dodaj_terapiju/{pacijentId}/{brojZuba}")]
        public async Task<IActionResult> DodajTerapiju(string pacijentId, int brojZuba, [FromBody] Terapija terapija)
        {
            var karton = await _kartonServis.GetByPacijentIdAsync(pacijentId);
            if (karton is null) return NotFound();

            await _kartonServis.AddTerapijuAsync(pacijentId, brojZuba, terapija);
            return NoContent();
        }

        [HttpPut("izmeni_terapiju/{pacijentId}/{brojZuba}/{indexTerapije}")]
        public async Task<IActionResult> IzmeniTerapiju(string pacijentId, int brojZuba, int indexTerapije, [FromBody] Terapija novaTerapija)
        {
            var karton = await _kartonServis.GetByPacijentIdAsync(pacijentId);
            if (karton is null) return NotFound();

            await _kartonServis.IzmeniTerapijuAsync(pacijentId, brojZuba, indexTerapije, novaTerapija);
            return NoContent();
        }
    }
}