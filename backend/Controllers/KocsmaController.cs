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

        // ======================================================
        // GET VÉGPONTOK - KOCSMA ADATOK LEKÉRÉSE
        // ======================================================

        /// <summary>
        /// Összes kocsma listázása
        /// </summary>
        [HttpGet("osszes")]
        public IActionResult OsszesKocsma()
        {
            var kocsmak = context.Kocsmak.ToList();
            return Ok(kocsmak);
        }

        /// <summary>
        /// Egy adott kocsma adatainak lekérése ID alapján
        /// </summary>
        /// <param name="id">Kocsma azonosítója</param>
        [HttpGet("{id}")]
        public IActionResult GetKocsmaById(int id)
        {
            var kocsma = context.Kocsmak.FirstOrDefault(k => k.KocsmaId == id);
            if (kocsma == null)
                return NotFound(new { uzenet = "Nincs ilyen kocsma." });

            return Ok(kocsma);
        }

        /// <summary>
        /// Adott kocsma saját raktárkészletének lekérése
        /// </summary>
        /// <param name="id">Kocsma azonosítója</param>
        [HttpGet("{id}/raktar")]
        public IActionResult SajatRaktar(int id)
        {
            // Kocsma létezésének ellenőrzése
            var kocsmaVan = context.Kocsmak.Any(k => k.KocsmaId == id);
            if (!kocsmaVan)
                return NotFound(new { uzenet = "Nincs ilyen kocsma." });

            // Kocsma raktárkészletének lekérése az Ital adatokkal együtt
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

        // ======================================================
        // PUT VÉGPONTOK - KOCSMA ADATOK MÓDOSÍTÁSA
        // ======================================================

        /// <summary>
        /// Kocsma adatainak módosítása - 🔥 KIBŐVÍTVE NYITVATARTÁSSAL
        /// </summary>
        /// <param name="id">Módosítandó kocsma azonosítója</param>
        /// <param name="frissitett">Frissített kocsma adatok</param>
        [HttpPut("{id}")]
        public IActionResult KocsmaModositasa(int id, [FromBody] KocsmaModell frissitett)
        {
            // Kocsma keresése
            var kocsma = context.Kocsmak.FirstOrDefault(k => k.KocsmaId == id);
            if (kocsma == null)
                return NotFound(new { uzenet = "Nincs ilyen kocsma." });

            // Jogosultság ellenőrzés - csak a tulajdonos módosíthatja
            if (kocsma.TulajFelhasznalo != frissitett.TulajFelhasznalo)
                return Unauthorized(new { uzenet = "Nem módosíthatod más kocsmáját." });

            // Kocsma alapadatok frissítése
            kocsma.Nev = frissitett.Nev;
            kocsma.Cim = frissitett.Cim;
            kocsma.Telefon = frissitett.Telefon;

            // 🔥 NYITVATARTÁS MEZŐK FRISSÍTÉSE
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