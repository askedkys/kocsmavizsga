using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace kocsma_v3.Modells
{
    [Table("KocsmaRaktar")]
    public class KocsmaRaktarModell
    {
        [Key]
        public int RaktarId { get; set; }

        // Kulcsok a kapcsolatokhoz
        public int KocsmaId { get; set; }
        [ForeignKey(nameof(KocsmaId))]
        public KocsmaModell? Kocsma { get; set; }

        public int ItalId { get; set; }
        [ForeignKey(nameof(ItalId))]
        public RaktarModell? Ital { get; set; }

        // Raktár adatok
        public int Mennyiseg { get; set; }
        public decimal Ar { get; set; }
    }
}