using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Polyglot.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPreferredImageModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Preferences_PreferredImageModel",
                table: "Users",
                type: "character varying(128)",
                maxLength: 128,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Preferences_PreferredImageModel",
                table: "Users");
        }
    }
}
