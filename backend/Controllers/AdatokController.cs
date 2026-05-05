using kocsma_v3.Modells;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text;

namespace kocsma_v3.Controllers
{
    [ApiController]
    [Route("api/adatok")]
    [Tags("Adatok")]
    public class AdatokController : ControllerBase
    {
        private readonly KocsmaContext context;

        public AdatokController(KocsmaContext context)
        {
            this.context = context;
        }

        [HttpGet("felhasznalok")]
        public IActionResult AdatokLekerdezese()
        {
            var osszesadat = context.Set<AdatokModell>()
                .Select(a => new { a.Id, a.Nev, a.Felhasznalonev, a.Email, a.Jelszo })
                .ToList();
            return Ok(osszesadat);
        }

        [HttpPost("regisztracio")]
        public async Task<IActionResult> Regisztracio([FromBody] RegisztracioModellDTO dto)
        {
            if (await context.Set<AdatokModell>().AnyAsync(x => x.Felhasznalonev == dto.Felhasznalonev))
                return Conflict(new { uzenet = "Ez a felhasználónév már foglalt!" });

            if (await context.Set<AdatokModell>().AnyAsync(x => x.Email == dto.Email))
                return Conflict(new { uzenet = "Ez az E-mail cím már használatban van!" });

            var user = new AdatokModell
            {
                Nev = dto.Nev,
                Felhasznalonev = dto.Felhasznalonev,
                Email = dto.Email,
                Jelszo = dto.Jelszo
            };

            await context.Set<AdatokModell>().AddAsync(user);
            await context.SaveChangesAsync();

            return Ok(new { uzenet = "Sikeres regisztráció!" });
        }

        [HttpPost("bejelentkezes")]
        public IActionResult Bejelentkezes([FromBody] LoginModel model)
        {
            if (string.IsNullOrWhiteSpace(model?.Felhasznalonev) || string.IsNullOrWhiteSpace(model?.Jelszo))
                return BadRequest(new { Uzenet = "Hiányzó adatok!" });

            var felhasznalo = context.Set<AdatokModell>()
                .FirstOrDefault(f => f.Felhasznalonev == model.Felhasznalonev);

            if (felhasznalo == null)
                return Unauthorized(new { Uzenet = "Hibás felhasználónév / jelszó!" });

            if (felhasznalo.Jelszo != model.Jelszo)
                return Unauthorized(new { Uzenet = "Hibás felhasználónév / jelszó!" });

            var kocsma = context.Set<KocsmaModell>()
                .FirstOrDefault(k => k.TulajFelhasznalo == felhasznalo.Felhasznalonev);

            return Ok(new
            {
                Felhasznalo = new
                {
                    felhasznalo.Id,
                    felhasznalo.Nev,
                    felhasznalo.Felhasznalonev,
                    felhasznalo.Email,
                    felhasznalo.IsAdmin,
                    KocsmaId = kocsma?.KocsmaId
                }
            });
        }
    }
}