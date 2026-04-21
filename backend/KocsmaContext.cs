using kocsma_v3.Modells;
using Microsoft.AspNetCore.Components.RenderTree;
using Microsoft.EntityFrameworkCore;

namespace kocsma_v3
{
    public class KocsmaContext : DbContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseMySQL("server=localhost; database=kocsma_v3 ;uid=root; pw=;");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Felhasználó – Kocsma kapcsolat (felhasznaloadatok.KocsmaId → kocsmak.KocsmaId)
            modelBuilder.Entity<AdatokModell>()
                .HasOne(f => f.Kocsma)
                .WithMany()
                .HasForeignKey(f => f.KocsmaId)
                .OnDelete(DeleteBehavior.Restrict);

            // Kocsma – KocsmaRaktar kapcsolat (kocsaraktar.KocsmaId → kocsmak.KocsmaId)
            modelBuilder.Entity<KocsmaRaktarModell>()
                .HasOne(r => r.Kocsma)
                .WithMany()
                .HasForeignKey(r => r.KocsmaId)
                .OnDelete(DeleteBehavior.Restrict);

            // Ital – KocsmaRaktar kapcsolat (kocsaraktar.ItalId → alkoholositalokraktar.ItalId)
            modelBuilder.Entity<KocsmaRaktarModell>()
                .HasOne(r => r.Ital)
                .WithMany()
                .HasForeignKey(r => r.ItalId)
                .OnDelete(DeleteBehavior.Restrict);
        }
        public DbSet<AdatokModell> Felhasznalok { get; set; }
        public DbSet<KocsmaModell> Kocsmak { get; set; }
        public DbSet<RaktarModell> Italok { get; set; }
        public DbSet<KocsmaRaktarModell> KocsmaRaktar { get; set; }
    }
}