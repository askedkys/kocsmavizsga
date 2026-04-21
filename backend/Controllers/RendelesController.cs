using kocsma_v3.Modells;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace kocsma_v3.Controllers
{
    [ApiController]
    [Route("api/rendeles")]
    [Tags("Rendelés")]
    public class RendelesController : ControllerBase
    {
        private readonly KocsmaContext context;

        public RendelesController(KocsmaContext context)
        {
            this.context = context;
        }

        // ======================================================
        // RENDELÉS ADATOK DTO (Bemeneti modell) - 🔥 KIBŐVÍTVE
        // ======================================================
        public class RendelDto
        {
            public string ItalNev { get; set; } = string.Empty;   // Rendelni kívánt ital neve
            public int Mennyiseg { get; set; }                     // Rendelt mennyiség
            public string Felhasznalonev { get; set; } = string.Empty; // 🔥 Ki rendel?
        }

        // ======================================================
        // ÚJ RENDELÉS LEADÁSA - 🔥 TOKEN NÉLKÜLI VERZIÓ
        // ======================================================

        /// <summary>
        /// Új rendelés leadása a főraktárból a kocsmába
        /// </summary>
        /// <param name="dto">Rendelés adatai (italnév, mennyiség, felhasználónév)</param>
        /// <returns>Rendelés eredménye</returns>
        [HttpPost]
        public IActionResult Rendel([FromBody] RendelDto dto)
        {
            // ===== 1. FELHASZNÁLÓ AZONOSÍTÁSA - 🔥 TOKEN NÉLKÜL =====
            if (string.IsNullOrWhiteSpace(dto.Felhasznalonev))
                return BadRequest(new { uzenet = "Hiányzó felhasználónév!" });

            // Felhasználó keresése név alapján
            var felhasznalo = context.Felhasznalok
                .Include(f => f.Kocsma)
                .FirstOrDefault(f => f.Felhasznalonev == dto.Felhasznalonev);

            if (felhasznalo == null)
                return Unauthorized(new { uzenet = "Nem található a felhasználó!" });

            if (felhasznalo.KocsmaId == null)
                return BadRequest(new { uzenet = "A felhasználóhoz nincs kocsma rendelve." });

            int kocsmaId = felhasznalo.KocsmaId.Value;

            // ===== 2. BEJÖVŐ ADATOK ÉRVÉNYESSÉGÉNEK ELLENŐRZÉSE =====
            if (dto.Mennyiseg <= 0 || string.IsNullOrWhiteSpace(dto.ItalNev))
                return BadRequest(new { uzenet = "Érvénytelen rendelés." });

            var ital = context.Italok.FirstOrDefault(i => i.Nev == dto.ItalNev);
            if (ital == null)
                return NotFound(new { uzenet = "Nincs ilyen ital a főraktárban." });

            if (ital.Mennyiseg < dto.Mennyiseg)
                return BadRequest(new { uzenet = $"Nincs elég készlet a főraktárban. Maradék: {ital.Mennyiseg}" });

            // ===== 3. KÉSZLETMOZGATÁS =====
            // Főraktárból levonás
            ital.Mennyiseg -= dto.Mennyiseg;

            // Kocsma raktár frissítése
            var raktarSor = context.KocsmaRaktar
                .FirstOrDefault(r => r.KocsmaId == kocsmaId && r.ItalId == ital.ItalId);

            if (raktarSor == null)
            {
                // Ha még nincs ilyen ital a kocsma raktárában, új sor létrehozása
                raktarSor = new KocsmaRaktarModell
                {
                    KocsmaId = kocsmaId,
                    ItalId = ital.ItalId,
                    Mennyiseg = dto.Mennyiseg,
                    Ar = ital.Ar
                };
                context.KocsmaRaktar.Add(raktarSor);
            }
            else
            {
                // Ha már van, mennyiség növelése
                raktarSor.Mennyiseg += dto.Mennyiseg;
            }

            // Változások mentése
            context.SaveChanges();

            // ===== 4. VÁLASZ KÜLDÉSE =====
            return Ok(new
            {
                uzenet = "Rendelés sikeres.",
                kocsma = felhasznalo.Kocsma?.Nev,
                ital = ital.Nev,
                rendeltMennyiseg = dto.Mennyiseg,
                ujKocsmaRaktarMennyiseg = raktarSor.Mennyiseg,
                maradekForraktarMennyiseg = ital.Mennyiseg
            });
        }
    }
}