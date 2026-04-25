using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Polyglot.Domain;

namespace Polyglot.Infrastructure.DBConfigurations
{
    public class AdminSettingsConfiguration : IEntityTypeConfiguration<AdminSettings>
    {
        public void Configure(EntityTypeBuilder<AdminSettings> builder)
        {
            builder.HasKey(a => a.Id);

            builder.Property(a => a.MaxPricePerMillionTokens).HasPrecision(18, 6);

            builder.ToTable(t => t.HasCheckConstraint("CK_AdminSettings_Singleton", $"\"Id\" = '{AdminSettings.SingletonId}'"));
        }
    }
}
