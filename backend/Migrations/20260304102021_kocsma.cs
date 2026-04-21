using Microsoft.EntityFrameworkCore.Migrations;
using MySql.EntityFrameworkCore.Metadata;

#nullable disable

namespace kocsma_v3.Migrations
{
    /// <inheritdoc />
    public partial class kocsma : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "AlkoholosItalokRaktar",
                columns: table => new
                {
                    ItalId = table.Column<int>(type: "int", nullable: false)
                    .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Nev = table.Column<string>(type: "longtext", nullable: false),
                    Mennyiseg = table.Column<int>(type: "int", nullable: false),
                    Ar = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Alkoholszazalek = table.Column<double>(type: "double", nullable: false),
                    Szarmazas = table.Column<string>(type: "longtext", nullable: false),
                    Kiszereles = table.Column<double>(type: "double", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AlkoholosItalokRaktar", x => x.ItalId);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Kocsmak",
                columns: table => new
                {
                    KocsmaId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Nev = table.Column<string>(type: "longtext", nullable: false),
                    Cim = table.Column<string>(type: "longtext", nullable: false),
                    Telefon = table.Column<string>(type: "longtext", nullable: false),
                    TulajFelhasznalo = table.Column<string>(type: "longtext", nullable: false),
                    Hetfo = table.Column<string>(type: "longtext", nullable: true),
                    Kedd = table.Column<string>(type: "longtext", nullable: true),
                    Szerda = table.Column<string>(type: "longtext", nullable: true),
                    Csutortok = table.Column<string>(type: "longtext", nullable: true),
                    Pentek = table.Column<string>(type: "longtext", nullable: true),
                    Szombat = table.Column<string>(type: "longtext", nullable: true),
                    Vasarnap = table.Column<string>(type: "longtext", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Kocsmak", x => x.KocsmaId);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "FelhasznaloAdatok",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Nev = table.Column<string>(type: "longtext", nullable: false),
                    Felhasznalonev = table.Column<string>(type: "longtext", nullable: false),
                    Email = table.Column<string>(type: "longtext", nullable: false),
                    Jelszo = table.Column<string>(type: "longtext", nullable: false),
                    IsAdmin = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    KocsmaId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FelhasznaloAdatok", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FelhasznaloAdatok_Kocsmak_KocsmaId",
                        column: x => x.KocsmaId,
                        principalTable: "Kocsmak",
                        principalColumn: "KocsmaId",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "KocsmaRaktar",
                columns: table => new
                {
                    RaktarId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    KocsmaId = table.Column<int>(type: "int", nullable: false),
                    ItalId = table.Column<int>(type: "int", nullable: false),
                    Mennyiseg = table.Column<int>(type: "int", nullable: false),
                    Ar = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KocsmaRaktar", x => x.RaktarId);
                    table.ForeignKey(
                        name: "FK_KocsmaRaktar_AlkoholosItalokRaktar_ItalId",
                        column: x => x.ItalId,
                        principalTable: "AlkoholosItalokRaktar",
                        principalColumn: "ItalId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_KocsmaRaktar_Kocsmak_KocsmaId",
                        column: x => x.KocsmaId,
                        principalTable: "Kocsmak",
                        principalColumn: "KocsmaId",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_FelhasznaloAdatok_KocsmaId",
                table: "FelhasznaloAdatok",
                column: "KocsmaId");

            migrationBuilder.CreateIndex(
                name: "IX_KocsmaRaktar_ItalId",
                table: "KocsmaRaktar",
                column: "ItalId");

            migrationBuilder.CreateIndex(
                name: "IX_KocsmaRaktar_KocsmaId",
                table: "KocsmaRaktar",
                column: "KocsmaId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FelhasznaloAdatok");

            migrationBuilder.DropTable(
                name: "KocsmaRaktar");

            migrationBuilder.DropTable(
                name: "AlkoholosItalokRaktar");

            migrationBuilder.DropTable(
                name: "Kocsmak");
        }
    }
}
