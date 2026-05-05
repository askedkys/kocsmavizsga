namespace kocsma_v3.Modells
{
    public class UjFelhasznaloDto
    {
        public required string Nev { get; set; }
        public required string Felhasznalonev { get; set; }
        public required string Email { get; set; }
        public required string Jelszo { get; set; }
        public bool IsAdmin { get; set; } = false;
        public int? KocsmaId { get; set; }
    }
}