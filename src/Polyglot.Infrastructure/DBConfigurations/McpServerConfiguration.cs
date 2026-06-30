using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Polyglot.Domain;

namespace Polyglot.Infrastructure.DBConfigurations
{
    public class McpServerConfiguration : IEntityTypeConfiguration<McpServer>
    {
        public void Configure(EntityTypeBuilder<McpServer> builder)
        {
            builder.HasKey(server => server.Id);

            builder.Property(server => server.Name).IsRequired().HasMaxLength(200);
            builder.Property(server => server.Url).IsRequired().HasMaxLength(2048);
            builder.Property(server => server.AuthorizationHeader).HasMaxLength(4096);

            builder.HasOne<User>()
                .WithMany()
                .HasForeignKey(server => server.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(server => server.UserId);
        }
    }
}
