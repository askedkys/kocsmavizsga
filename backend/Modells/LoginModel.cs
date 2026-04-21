namespace kocsma_v3.Modells
{
    // ======================================================
    // BEJELENTKEZÉSI MODELL (API bemenet)
    // ======================================================
    public class LoginModel
    {
        public required string Felhasznalonev { get; set; }    // Felhasználónév
        public required string Jelszo { get; set; }            // Jelszó (plain text)
    }
}