using kocsma_v3.Modells;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace kocsma_v3.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Tags("Admin")]
    public class AdminController : ControllerBase
    {
        private readonly KocsmaContext context;

        public AdminController(KocsmaContext context)
        {
            this.context = context;
        }

        [HttpGet("felhasznalok")]
        public IActionResult OsszesFelhasznalo() => Ok(context.Felhasznalok.ToList());

        [HttpGet("kocsmak")]
        public IActionResult OsszesKocsmaAdmin() => Ok(context.Kocsmak.ToList());

        [HttpGet("italok")]
        public IActionResult OsszesItalAdmin() => Ok(context.Italok.ToList());

        [HttpPost("regisztracio")]
        public async Task<IActionResult> Regisztracio([FromBody] UjFelhasznaloDto dto)
        {
            if (dto == null)
                return BadRequest(new { uzenet = "Nincsenek megadva adatok." });

            if (!ModelState.IsValid)
                return BadRequest(new { uzenet = "Hibás vagy hiányos adatok." });

            if (await context.Set<AdatokModell>().AnyAsync(x => x.Felhasznalonev == dto.Felhasznalonev))
                return Conflict(new { uzenet = "Ez a felhasználónév már foglalt." });

            if (await context.Set<AdatokModell>().AnyAsync(x => x.Email == dto.Email))
                return Conflict(new { uzenet = "Ez az email cím már használatban van." });

            var user = new AdatokModell
            {
                Nev = dto.Nev,
                Felhasznalonev = dto.Felhasznalonev,
                Email = dto.Email,
                Jelszo = dto.Jelszo
            };

            await context.Set<AdatokModell>().AddAsync(user);
            await context.SaveChangesAsync();

            return Ok(new { uzenet = "Sikeres regisztráció.", nev = user.Nev });
        }

        [HttpPost("kocsmak")]
        public IActionResult LetrehozKocsma([FromBody] KocsmaModell uj)
        {
            context.Kocsmak.Add(uj);
            context.SaveChanges();
            return Ok(new { uzenet = "Kocsma létrehozva", uj.KocsmaId });
        }

        [HttpPost("italok")]
        public IActionResult LetrehozItal([FromBody] RaktarModell uj)
        {
            context.Italok.Add(uj);
            context.SaveChanges();
            return Ok(new { uzenet = "Ital létrehozva", uj.ItalId });
        }

        [HttpPost("felhasznalokDTO")]
        public async Task<IActionResult> LetrehozFelhasznaloAsync([FromBody] UjFelhasznaloDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Nev))
                return BadRequest(new { uzenet = "Minden adatot ki kell tölteni!" });

            if (string.IsNullOrWhiteSpace(dto.Felhasznalonev))
                return BadRequest(new { uzenet = "Minden adatot ki kell tölteni!" });

            if (string.IsNullOrWhiteSpace(dto.Email))
                return BadRequest(new { uzenet = "Minden adatot ki kell tölteni!" });

            if (string.IsNullOrWhiteSpace(dto.Jelszo))
                return BadRequest(new { uzenet = "Minden adatot ki kell tölteni!" });

            if (await context.Set<AdatokModell>().AnyAsync(x => x.Email == dto.Email))
                return Conflict(new { uzenet = "Ez az E-mail cím már használatban van!" });

            if (await context.Set<AdatokModell>().AnyAsync(x => x.Felhasznalonev == dto.Felhasznalonev))
                return Conflict(new { uzenet = "Ez a felhasználónév már foglalt!" });

            if (await context.Set<AdatokModell>().AnyAsync(x => x.KocsmaId == dto.KocsmaId && x.KocsmaId != null))
                return Conflict(new { uzenet = "Ez a kocsma már hozzá van rendelve egy felhasználóhoz!" });

            var uj = new AdatokModell
            {
                Nev = dto.Nev,
                Felhasznalonev = dto.Felhasznalonev,
                Email = dto.Email,
                Jelszo = dto.Jelszo,
                IsAdmin = dto.IsAdmin,
                KocsmaId = dto.KocsmaId
            };

            context.Felhasznalok.Add(uj);
            context.SaveChanges();
            return Ok(new { uzenet = "Felhasználó létrehozva." });
        }

        [HttpPost("kocsmakDTO")]
        public IActionResult LetrehozKocsma([FromBody] UjKocsmaDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Nev))
                return BadRequest(new { uzenet = "A kocsma neve nem lehet üres." });

            var uj = new KocsmaModell
            {
                Nev = dto.Nev,
                Cim = dto.Cim,
                Telefon = dto.Telefon,
                TulajFelhasznalo = dto.TulajFelhasznalo,

                Hetfo = dto.Hetfo,
                Kedd = dto.Kedd,
                Szerda = dto.Szerda,
                Csutortok = dto.Csutortok,
                Pentek = dto.Pentek,
                Szombat = dto.Szombat,
                Vasarnap = dto.Vasarnap
            };

            context.Kocsmak.Add(uj);
            context.SaveChanges();
            return Ok(new { uzenet = "Kocsma létrehozva." });
        }

        [HttpPost("italokDTO")]
        public IActionResult LetrehozItal([FromBody] UjItalDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Nev))
                return BadRequest(new { uzenet = "Az ital neve nem lehet üres." });

            if (dto.Ar <= 0)
                return BadRequest(new { uzenet = "Az ital ára érvénytelen." });

            if (dto.Alkoholszazalek < 0 || dto.Alkoholszazalek > 100)
                return BadRequest(new { uzenet = "Az alkoholszázalék 0 és 100 között kell legyen." });

            var uj = new RaktarModell
            {
                Nev = dto.Nev,
                Mennyiseg = dto.Mennyiseg,
                Ar = dto.Ar,
                Alkoholszazalek = dto.Alkoholszazalek,
                Szarmazas = dto.Szarmazas,
                Kiszereles = dto.Kiszereles
            };

            context.Italok.Add(uj);
            context.SaveChanges();
            return Ok(new { uzenet = "Ital létrehozva." });
        }

        [HttpPut("felhasznalok/{id}")]
        public IActionResult FrissitFelhasznalo(int id, [FromBody] UjFelhasznaloDto dto)
        {
            try
            {
                var felhasznalo = context.Felhasznalok.FirstOrDefault(f => f.Id == id);
                if (felhasznalo == null)
                    return NotFound(new { uzenet = "A felhasználó nem található." });

                felhasznalo.Nev = dto.Nev;
                felhasznalo.Felhasznalonev = dto.Felhasznalonev;
                felhasznalo.Email = dto.Email;
                felhasznalo.Jelszo = dto.Jelszo;
                felhasznalo.IsAdmin = dto.IsAdmin;
                felhasznalo.KocsmaId = dto.KocsmaId;

                context.SaveChanges();
                return Ok(new { uzenet = "Felhasználó frissítve." });
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPut("kocsmak/{id}")]
        public IActionResult FrissitKocsma(int id, [FromBody] KocsmaModell modositott)
        {
            var kocsma = context.Kocsmak.FirstOrDefault(k => k.KocsmaId == id);
            if (kocsma == null)
                return NotFound();

            kocsma.Nev = modositott.Nev;
            kocsma.Cim = modositott.Cim;
            kocsma.Telefon = modositott.Telefon;
            kocsma.TulajFelhasznalo = modositott.TulajFelhasznalo;

            kocsma.Hetfo = modositott.Hetfo;
            kocsma.Kedd = modositott.Kedd;
            kocsma.Szerda = modositott.Szerda;
            kocsma.Csutortok = modositott.Csutortok;
            kocsma.Pentek = modositott.Pentek;
            kocsma.Szombat = modositott.Szombat;
            kocsma.Vasarnap = modositott.Vasarnap;

            context.SaveChanges();
            return Ok(new { uzenet = "Kocsma frissítve" });
        }

        [HttpPut("italok/{id}")]
        public IActionResult FrissitItal(int id, [FromBody] RaktarModell modositott)
        {
            var ital = context.Italok.FirstOrDefault(i => i.ItalId == id);
            if (ital == null)
                return NotFound();

            ital.Nev = modositott.Nev;
            ital.Mennyiseg = modositott.Mennyiseg;
            ital.Ar = modositott.Ar;
            ital.Alkoholszazalek = modositott.Alkoholszazalek;
            ital.Szarmazas = modositott.Szarmazas;
            ital.Kiszereles = modositott.Kiszereles;

            context.SaveChanges();
            return Ok(new { uzenet = "Ital frissítve" });
        }

        [HttpDelete("felhasznalok/{felhasznalonev}")]
        public IActionResult TorolFelhasznalo(string felhasznalonev)
        {
            var felhasznalo = context.Felhasznalok.FirstOrDefault(f => f.Felhasznalonev == felhasznalonev);
            if (felhasznalo == null)
                return NotFound(new { uzenet = "Nincs ilyen felhasználó." });

            var kocsma = context.Kocsmak.FirstOrDefault(k => k.TulajFelhasznalo == felhasznalonev);
            if (kocsma != null)
            {
                bool vanKeszlet = context.KocsmaRaktar.Any(r => r.KocsmaId == kocsma.KocsmaId);
                if (vanKeszlet)
                    return BadRequest(new { uzenet = "A felhasználó nem törölhető, mert a hozzá tartozó kocsmának termékkészlete van." });
            }

            context.Felhasznalok.Remove(felhasznalo);
            context.SaveChanges();
            return Ok(new { uzenet = "Felhasználó törölve." });
        }

        [HttpDelete("kocsmak/{id}")]
        public IActionResult TorolKocsma(int id)
        {
            var kocsma = context.Kocsmak.FirstOrDefault(k => k.KocsmaId == id);
            if (kocsma == null)
                return NotFound(new { uzenet = "Nincs ilyen kocsma." });

            bool vanKeszlete = context.KocsmaRaktar.Any(r => r.KocsmaId == id);
            if (vanKeszlete)
                return BadRequest(new { uzenet = "A kocsma nem törölhető, mert termékkészlete van." });

            context.Kocsmak.Remove(kocsma);
            context.SaveChanges();
            return Ok(new { uzenet = "Kocsma törölve." });
        }

        [HttpDelete("italok/{id}")]
        public IActionResult TorolItal(int id)
        {
            var ital = context.Italok.FirstOrDefault(i => i.ItalId == id);
            if (ital == null)
                return NotFound(new { uzenet = "Nincs ilyen ital a főraktárban." });

            bool vanKocsmaban = context.KocsmaRaktar.Any(r => r.ItalId == id);
            if (vanKocsmaban)
                return BadRequest(new { uzenet = "Az ital nem törölhető, mert szerepel egy vagy több kocsma raktárkészletében." });

            context.Italok.Remove(ital);
            context.SaveChanges();
            return Ok(new { uzenet = "Ital törölve a főraktárból." });
        }
    }
}