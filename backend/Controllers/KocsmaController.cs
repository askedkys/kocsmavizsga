using kocsma_v3.Modells;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace kocsma_v3.Controllers
{
    [ApiController]
    [Route("api/kocsma")]
    [Tags("Kocsma")]
    public class KocsmaController : ControllerBase
    {
        private readonly KocsmaContext context;

        public KocsmaController(KocsmaContext context)
        {
            this.context = context;
        }

        [HttpGet("osszes")]
        public IActionResult OsszesKocsma()
        {
            var kocsmak = context.Kocsmak.ToList();
            return Ok(kocsmak);
        }

        [HttpGet("{id}")]
        public IActionResult GetKocsmaById(int id)
        {
            var kocsma = context.Kocsmak.FirstOrDefault(k => k.KocsmaId == id);
            if (kocsma == null)
                return NotFound(new { uzenet = "Nincs ilyen kocsma." });

            return Ok(kocsma);
        }

        [HttpGet("{id}/raktar")]
        public IActionResult SajatRaktar(int id)
        {
            var kocsmaVan = context.Kocsmak.Any(k => k.KocsmaId == id);
            if (!kocsmaVan)
                return NotFound(new { uzenet = "Nincs ilyen kocsma." });

            var keszlet = context.KocsmaRaktar
                .Include(r => r.Ital)
                .Where(r => r.KocsmaId == id)
                .Select(r => new
                {
                    r.ItalId,
                    Nev = r.Ital!.Nev,
                    r.Mennyiseg,
                    r.Ar
                })
                .ToList();

            return Ok(keszlet);
        }

        [HttpPut("{id}")]
        public IActionResult KocsmaModositasa(int id, [FromBody] KocsmaModell frissitett)
        {
            var kocsma = context.Kocsmak.FirstOrDefault(k => k.KocsmaId == id);
            if (kocsma == null)
                return NotFound(new { uzenet = "Nincs ilyen kocsma." });

            if (kocsma.TulajFelhasznalo != frissitett.TulajFelhasznalo)
                return Unauthorized(new { uzenet = "Nem módosíthatod más kocsmáját." });

            kocsma.Nev = frissitett.Nev;
            kocsma.Cim = frissitett.Cim;
            kocsma.Telefon = frissitett.Telefon;

            kocsma.Hetfo = frissitett.Hetfo;
            kocsma.Kedd = frissitett.Kedd;
            kocsma.Szerda = frissitett.Szerda;
            kocsma.Csutortok = frissitett.Csutortok;
            kocsma.Pentek = frissitett.Pentek;
            kocsma.Szombat = frissitett.Szombat;
            kocsma.Vasarnap = frissitett.Vasarnap;

            context.SaveChanges();
            return Ok(new { uzenet = "Kocsma adatai frissítve." });
        }
    }
}