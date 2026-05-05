using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace kocsma_v3.Modells
{
    [Table("Kocsmak")]
    public class KocsmaModell
    {
        [Key]
        public int KocsmaId { get; set; }
        public required string Nev { get; set; }
        public required string Cim { get; set; }
        public required string Telefon { get; set; }
        public required string TulajFelhasznalo { get; set; }

        public string? Hetfo { get; set; }
        public string? Kedd { get; set; }
        public string? Szerda { get; set; }
        public string? Csutortok { get; set; }
        public string? Pentek { get; set; }
        public string? Szombat { get; set; }
        public string? Vasarnap { get; set; }
    }
    public class UjKocsmaDto
    {
        public required string Nev { get; set; }
        public required string Cim { get; set; }
        public required string Telefon { get; set; }
        public required string TulajFelhasznalo { get; set; }

        public string? Hetfo { get; set; }
        public string? Kedd { get; set; }
        public string? Szerda { get; set; }
        public string? Csutortok { get; set; }
        public string? Pentek { get; set; }
        public string? Szombat { get; set; }
        public string? Vasarnap { get; set; }
    }
}