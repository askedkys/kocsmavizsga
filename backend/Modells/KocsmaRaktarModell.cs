using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace kocsma_v3.Modells
{
    // ======================================================
    // KOCSMA RAKTÁR MODELL
    // ======================================================
    [Table("KocsmaRaktar")]
    public class KocsmaRaktarModell
    {
        [Key]
        public int RaktarId { get; set; }          // Egyedi raktár tétel azonosító

        // ===== KULCSOK =====
        public int KocsmaId { get; set; }          // Melyik kocsmáé a tétel?
        [ForeignKey(nameof(KocsmaId))]
        public KocsmaModell? Kocsma { get; set; }  // Kapcsolat a kocsmával

        public int ItalId { get; set; }             // Melyik italról van szó?
        [ForeignKey(nameof(ItalId))]
        public RaktarModell? Ital { get; set; }     // Kapcsolat az ital adataival

        // ===== RAKTÁR ADATOK =====
        public int Mennyiseg { get; set; }          // Jelenlegi készlet mennyiség
        public decimal Ar { get; set; }              // Egységár ebben a kocsmában
    }
}