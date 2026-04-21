using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace kocsma_v3.Modells
{
    // ======================================================
    // FELHASZNÁLÓ MODELL
    // ======================================================
    [Table("FelhasznaloAdatok")]
    public class AdatokModell
    {
        [Key] public int Id { get; set; }                          // Egyedi azonosító
        public required string Nev { get; set; }                   // Teljes név
        public required string Felhasznalonev { get; set; }        // Bejelentkezési név
        public required string Email { get; set; }                 // Email cím
        public required string Jelszo { get; set; }                // Hashelt jelszó
        public bool IsAdmin { get; set; } = false;                 // Admin-e?
        public int? KocsmaId { get; set; }                         // Ha kocsmáros, melyik kocsma?

        [ForeignKey(nameof(KocsmaId))]
        public KocsmaModell? Kocsma { get; set; }                  // Kapcsolat a kocsmával
    }

    // ======================================================
    // REGISZTRÁCIÓS DTO (API bemenet)
    // ======================================================
    public class RegisztracioModellDTO
    {
        public required string Nev { get; set; }                   // Név
        public required string Felhasznalonev { get; set; }        // Felhasználónév
        public required string Email { get; set; }                 // Email
        public required string Jelszo { get; set; }                // Jelszó (plain)
    }
}