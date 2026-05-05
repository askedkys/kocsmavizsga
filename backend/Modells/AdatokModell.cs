using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace kocsma_v3.Modells
{
    [Table("FelhasznaloAdatok")]
    public class AdatokModell
    {
        [Key] public int Id { get; set; }
        public required string Nev { get; set; }
        public required string Felhasznalonev { get; set; }
        public required string Email { get; set; }
        public required string Jelszo { get; set; }
        public bool IsAdmin { get; set; } = false;
        public int? KocsmaId { get; set; }

        [ForeignKey(nameof(KocsmaId))]
        public KocsmaModell? Kocsma { get; set; }
    }

    public class RegisztracioModellDTO
    {
        public required string Nev { get; set; }
        public required string Felhasznalonev { get; set; }
        public required string Email { get; set; }
        public required string Jelszo { get; set; }
    }
}