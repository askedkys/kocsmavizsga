using kocsma_v3.Modells;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace kocsma_v3.Controllers
{
    [ApiController]
    [Route("api/statisztika")]
    [Tags("Statisztika")]
    public class StatisztikaController : ControllerBase
    {
        private readonly KocsmaContext _context;

        public StatisztikaController(KocsmaContext context)
        {
            _context = context;
        }

        // ======================================================
        // TELJES RENDSZER STATISZTIKA LEKÉRÉSE
        // ======================================================

        /// <summary>
        /// Átfogó statisztikák lekérése a teljes rendszerről
        /// </summary>
        /// <returns>Kocsmák száma, legnépszerűbb kocsma, legkeresettebb ital, forgalmi adatok</returns>
        [HttpGet]
        public IActionResult GetStatisztika()
        {
            try
            {
                // ===== 1. KOCSMÁK SZÁMA =====
                var kocsmakSzama = _context.Kocsmak.Count();

                // ===== 2. LEGNÉPSZERŰBB KOCSMA ( - LEGTÖBB ITALLAL RENDELKEZIK) =====
                // Az a kocsma, amelynek a legtöbb ital van a raktárában (legnagyobb forgalmú)
                var legnepszerubbKocsma = _context.KocsmaRaktar
                    .Include(kr => kr.Kocsma)
                    .GroupBy(kr => kr.KocsmaId)
                    .Select(g => new
                    {
                        KocsmaId = g.Key,
                        OsszMennyiseg = g.Sum(kr => kr.Mennyiseg)  // Összes ital mennyisége a kocsmában
                    })
                    .OrderByDescending(x => x.OsszMennyiseg)
                    .FirstOrDefault();

                var legnepszerubbKocsmaNev = "Nincs adat";
                var legnepszerubbKocsmaMennyiseg = 0;

                if (legnepszerubbKocsma != null)
                {
                    var kocsma = _context.Kocsmak
                        .FirstOrDefault(k => k.KocsmaId == legnepszerubbKocsma.KocsmaId);
                    legnepszerubbKocsmaNev = kocsma?.Nev ?? "Ismeretlen kocsma";
                    legnepszerubbKocsmaMennyiseg = legnepszerubbKocsma.OsszMennyiseg;
                }

                // ===== 3. LEGTÖBBET RENDELT ITAL =====
                // Az az ital, amelyből a legtöbb darab van összesen a kocsmákban (legkeresettebb)
                var legtobbetRendeltItal = _context.KocsmaRaktar
                    .Include(kr => kr.Ital)
                    .GroupBy(kr => kr.ItalId)
                    .Select(g => new
                    {
                        ItalId = g.Key,
                        OsszMennyiseg = g.Sum(kr => kr.Mennyiseg)  // Összes darabszám az összes kocsmában
                    })
                    .OrderByDescending(x => x.OsszMennyiseg)
                    .FirstOrDefault();

                var legtobbetRendeltItalNev = "Nincs adat";
                var legtobbetRendeltItalMennyiseg = 0;

                if (legtobbetRendeltItal != null)
                {
                    var ital = _context.Italok
                        .FirstOrDefault(i => i.ItalId == legtobbetRendeltItal.ItalId);
                    legtobbetRendeltItalNev = ital?.Nev ?? "Ismeretlen ital";
                    legtobbetRendeltItalMennyiseg = legtobbetRendeltItal.OsszMennyiseg;
                }

                // ===== 4. TELJES FORGALOM ÉRTÉKE =====
                // Az összes kocsmában lévő összes ital összértéke (mennyiség * ár)
                var teljesForgalom = _context.KocsmaRaktar
                    .Include(kr => kr.Ital)
                    .Sum(kr => kr.Mennyiseg * kr.Ar);

                // ===== 5. ÖSSZES TERMÉK DARABSZÁM =====
                // Az összes kocsmában lévő összes ital darabszáma
                var osszesTermekDb = _context.KocsmaRaktar
                    .Sum(kr => kr.Mennyiseg);

                // ===== 6. LEGÉRTÉKESEBB ITAL =====
                // Az az ital, amelyik a legnagyobb összértékben van jelen a kocsmákban
                var legertekesebbItal = _context.KocsmaRaktar
                    .Include(kr => kr.Ital)
                    .GroupBy(kr => kr.ItalId)
                    .Select(g => new
                    {
                        ItalId = g.Key,
                        OsszErtek = g.Sum(kr => kr.Mennyiseg * kr.Ar)  // Összérték (mennyiség * ár)
                    })
                    .OrderByDescending(x => x.OsszErtek)
                    .FirstOrDefault();

                var legertekesebbItalNev = "Nincs adat";
                var legertekesebbItalErtek = 0m;

                if (legertekesebbItal != null)
                {
                    var ital = _context.Italok
                        .FirstOrDefault(i => i.ItalId == legertekesebbItal.ItalId);
                    legertekesebbItalNev = ital?.Nev ?? "Ismeretlen ital";
                    legertekesebbItalErtek = legertekesebbItal.OsszErtek;
                }

                // ===== 7. EREDMÉNY ÖSSZEÁLLÍTÁSA =====
                var statisztika = new
                {
                    kocsmakSzama,  // Összes kocsma száma

                    legnepszerubbKocsma = new  // Legnagyobb forgalmú kocsma
                    {
                        Nev = legnepszerubbKocsmaNev,
                        RendelesDb = legnepszerubbKocsmaMennyiseg
                    },

                    legtobbetRendeltItal = new  // Legtöbbet rendelt ital
                    {
                        Nev = legtobbetRendeltItalNev,
                        Darab = legtobbetRendeltItalMennyiseg
                    },

                    teljesForgalom,  // Teljes készletérték (Ft)
                    osszesTermekDb,  // Összes ital darabszám

                    legertekesebbItal = new  // Legnagyobb értékű ital
                    {
                        Nev = legertekesebbItalNev,
                        OsszErtek = legertekesebbItalErtek
                    }
                };

                return Ok(statisztika);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { uzenet = "Hiba a statisztika lekérdezésekor", hiba = ex.Message });
            }
        }
    }
}