using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Polyglot.Domain;

namespace Polyglot.Infrastructure.DBConfigurations
{
    public class ModelConfiguration : IEntityTypeConfiguration<Model>
    {
        public void Configure(EntityTypeBuilder<Model> builder)
        {
            builder.HasKey(model => model.Id);

            builder.Property(model => model.ModelId).HasMaxLength(200);
            builder.Property(model => model.Name).HasMaxLength(200);
            builder.Property(model => model.PromptPricePerMillion).HasPrecision(18, 8);
            builder.Property(model => model.CompletionPricePerMillion).HasPrecision(18, 8);

            builder.HasIndex(model => model.ModelId).IsUnique();
        }
    }
}
