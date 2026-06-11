using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Polyglot.Domain;

namespace Polyglot.Infrastructure.DBConfigurations
{
    public class McpServerConfiguration : IEntityTypeConfiguration<McpServer>
    {
        public void Configure(EntityTypeBuilder<McpServer> builder)
        {
            builder.HasKey(s => s.Id);

            builder.Property(s => s.Name).IsRequired().HasMaxLength(200);
            builder.Property(s => s.Url).IsRequired().HasMaxLength(2048);
            builder.Property(s => s.AuthorizationHeader).HasMaxLength(4096);

            // Owned servers disappear with their user; global servers (UserId == null) are unaffected.
            builder.HasOne<User>()
                .WithMany()
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(s => s.UserId);
        }
    }
}
