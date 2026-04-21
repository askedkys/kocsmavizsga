using kocsma_v3.Modells;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace kocsma_v3.Modells
{
    // ======================================================
    // KÖZPONTI RAKTÁR MODELL (Alkoholos italok)
    // ======================================================
    [Table("AlkoholosItalokRaktar")]
    public class RaktarModell
    {
        [Key]
        public int ItalId { get; set; }                 // Egyedi ital azonosító

        public required string Nev { get; set; }        // Ital neve
        public int Mennyiseg { get; set; }              // Teljes készlet mennyiség
        public decimal Ar { get; set; }                  // Egységár (Ft)
        public double Alkoholszazalek { get; set; }      // Alkoholtartalom %
        public required string Szarmazas { get; set; }   // Származási ország
        public double Kiszereles { get; set; }           // Kiszerelés (liter)
    }

    // ======================================================
    // ÚJ ITAL LÉTREHOZÁS DTO (API bemenet)
    // ======================================================
    public class UjItalDTO
    {
        public required string Nev { get; set; }         // Ital neve
        public int Mennyiseg { get; set; }               // Kezdő készlet
        public decimal Ar { get; set; }                   // Egységár
        public int Alkoholszazalek { get; set; }         // Alkoholtartalom %
        public required string Szarmazas { get; set; }   // Származási ország
        public double Kiszereles { get; set; }           // Kiszerelés (liter)
    }
}