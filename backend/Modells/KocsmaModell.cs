using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace kocsma_v3.Modells
{
    // ======================================================
    // KOCSMA MODELL - KIBŐVÍTVE NYITVATARTÁSSAL
    // ======================================================
    [Table("Kocsmak")]  // Adatbázis tábla neve
    public class KocsmaModell
    {
        [Key]
        public int KocsmaId { get; set; }           // Egyedi kocsma azonosító

        public required string Nev { get; set; }     // Kocsma neve
        public required string Cim { get; set; }     // Kocsma címe
        public required string Telefon { get; set; } // Kocsma telefonszáma
        public required string TulajFelhasznalo { get; set; } // Tulajdonos felhasználóneve

        // ======================================================
        // 🔥 NYITVATARTÁS MEZŐK - napokra bontva
        // ======================================================
        public string? Hetfo { get; set; }      // Pl. "16-24" vagy "Zárva"
        public string? Kedd { get; set; }       // Pl. "16-24"
        public string? Szerda { get; set; }     // Pl. "16-24"
        public string? Csutortok { get; set; }  // Pl. "16-24"
        public string? Pentek { get; set; }     // Pl. "16-24"
        public string? Szombat { get; set; }    // Pl. "14-02"
        public string? Vasarnap { get; set; }   // Pl. "14-22"
    }

    // ======================================================
    // KOCSMA LÉTREHOZÁS DTO (API bemenet) - KIBŐVÍTVE
    // ======================================================
    public class UjKocsmaDto
    {
        public required string Nev { get; set; }               // Új kocsma neve
        public required string Cim { get; set; }               // Új kocsma címe
        public required string Telefon { get; set; }           // Új kocsma telefonszáma
        public required string TulajFelhasznalo { get; set; }  // Tulajdonos felhasználóneve

        // 🔥 NYITVATARTÁS MEZŐK - opcionálisak
        public string? Hetfo { get; set; }
        public string? Kedd { get; set; }
        public string? Szerda { get; set; }
        public string? Csutortok { get; set; }
        public string? Pentek { get; set; }
        public string? Szombat { get; set; }
        public string? Vasarnap { get; set; }
    }
}