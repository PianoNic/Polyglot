using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Polyglot.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDefaultImageModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DefaultImageModel",
                table: "AdminSettings",
                type: "character varying(128)",
                maxLength: 128,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DefaultImageModel",
                table: "AdminSettings");
        }
    }
}
