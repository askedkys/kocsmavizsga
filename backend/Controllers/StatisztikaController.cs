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

        [HttpGet]
        public IActionResult GetStatisztika()
        {
            try
            {
                var kocsmakSzama = _context.Kocsmak.Count();

                var legnepszerubbKocsma = _context.KocsmaRaktar
                    .Include(kr => kr.Kocsma)
                    .GroupBy(kr => kr.KocsmaId)
                    .Select(g => new
                    {
                        KocsmaId = g.Key,
                        OsszMennyiseg = g.Sum(kr => kr.Mennyiseg)
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

                var legtobbetRendeltItal = _context.KocsmaRaktar
                    .Include(kr => kr.Ital)
                    .GroupBy(kr => kr.ItalId)
                    .Select(g => new
                    {
                        ItalId = g.Key,
                        OsszMennyiseg = g.Sum(kr => kr.Mennyiseg)
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

                var teljesForgalom = _context.KocsmaRaktar
                    .Include(kr => kr.Ital)
                    .Sum(kr => kr.Mennyiseg * kr.Ar);

                var osszesTermekDb = _context.KocsmaRaktar
                    .Sum(kr => kr.Mennyiseg);

                var legertekesebbItal = _context.KocsmaRaktar
                    .Include(kr => kr.Ital)
                    .GroupBy(kr => kr.ItalId)
                    .Select(g => new
                    {
                        ItalId = g.Key,
                        OsszErtek = g.Sum(kr => kr.Mennyiseg * kr.Ar)
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

                var statisztika = new
                {
                    kocsmakSzama,

                    legnepszerubbKocsma = new
                    {
                        Nev = legnepszerubbKocsmaNev,
                        RendelesDb = legnepszerubbKocsmaMennyiseg
                    },

                    legtobbetRendeltItal = new
                    {
                        Nev = legtobbetRendeltItalNev,
                        Darab = legtobbetRendeltItalMennyiseg
                    },

                    teljesForgalom,
                    osszesTermekDb,

                    legertekesebbItal = new
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