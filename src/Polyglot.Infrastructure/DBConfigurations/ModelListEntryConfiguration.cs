using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Polyglot.Domain;

namespace Polyglot.Infrastructure.DBConfigurations
{
    public class ModelListEntryConfiguration : IEntityTypeConfiguration<ModelListEntry>
    {
        public void Configure(EntityTypeBuilder<ModelListEntry> builder)
        {
            builder.HasKey(entry => entry.Id);

            builder.HasIndex(entry => entry.ModelId).IsUnique();
            builder.Property(entry => entry.ModelId).HasMaxLength(200);
            builder.Property(entry => entry.ListType).HasConversion<string>().HasMaxLength(20);
        }
    }
}
