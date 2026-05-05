using kocsma_v3.Modells;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace kocsma_v3.Modells
{
    [Table("AlkoholosItalokRaktar")]
    public class RaktarModell
    {
        [Key]
        public int ItalId { get; set; }
        public required string Nev { get; set; }
        public int Mennyiseg { get; set; } 
        public decimal Ar { get; set; }
        public double Alkoholszazalek { get; set; }
        public required string Szarmazas { get; set; }
        public double Kiszereles { get; set; }
    }
    public class UjItalDTO
    {
        public required string Nev { get; set; }
        public int Mennyiseg { get; set; }
        public decimal Ar { get; set; }
        public int Alkoholszazalek { get; set; }
        public required string Szarmazas { get; set; }
        public double Kiszereles { get; set; }
    }
}