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

        public class RendelDto
        {
            public string ItalNev { get; set; } = string.Empty;
            public int Mennyiseg { get; set; }
            public string Felhasznalonev { get; set; } = string.Empty;
        }

        [HttpPost]
        public IActionResult Rendel([FromBody] RendelDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Felhasznalonev))
                return BadRequest(new { uzenet = "Hiányzó felhasználónév!" });

            var felhasznalo = context.Felhasznalok
                .Include(f => f.Kocsma)
                .FirstOrDefault(f => f.Felhasznalonev == dto.Felhasznalonev);

            if (felhasznalo == null)
                return Unauthorized(new { uzenet = "Nem található a felhasználó!" });

            if (felhasznalo.KocsmaId == null)
                return BadRequest(new { uzenet = "A felhasználóhoz nincs kocsma rendelve." });

            int kocsmaId = felhasznalo.KocsmaId.Value;

            if (dto.Mennyiseg <= 0 || string.IsNullOrWhiteSpace(dto.ItalNev))
                return BadRequest(new { uzenet = "Érvénytelen rendelés." });

            var ital = context.Italok.FirstOrDefault(i => i.Nev == dto.ItalNev);
            if (ital == null)
                return NotFound(new { uzenet = "Nincs ilyen ital a főraktárban." });

            if (ital.Mennyiseg < dto.Mennyiseg)
                return BadRequest(new { uzenet = $"Nincs elég készlet a főraktárban. Maradék: {ital.Mennyiseg}" });

            ital.Mennyiseg -= dto.Mennyiseg;

            var raktarSor = context.KocsmaRaktar
                .FirstOrDefault(r => r.KocsmaId == kocsmaId && r.ItalId == ital.ItalId);

            if (raktarSor == null)
            {
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
                raktarSor.Mennyiseg += dto.Mennyiseg;
            }

            context.SaveChanges();

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