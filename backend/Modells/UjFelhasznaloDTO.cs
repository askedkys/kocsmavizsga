namespace kocsma_v3.Modells
{
    // ======================================================
    // ÚJ FELHASZNÁLÓ LÉTREHOZÁS DTO (API bemenet)
    // ======================================================
    public class UjFelhasznaloDto
    {
        public required string Nev { get; set; }              // Teljes név
        public required string Felhasznalonev { get; set; }   // Bejelentkezési név
        public required string Email { get; set; }            // Email cím
        public required string Jelszo { get; set; }           // Jelszó (plain text)
        public bool IsAdmin { get; set; } = false;            // Admin jogosultság (alap: nem)
        public int? KocsmaId { get; set; }                    // Ha kocsmáros, melyik kocsmáé
    }
}