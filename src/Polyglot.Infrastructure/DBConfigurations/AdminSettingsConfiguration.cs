using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Polyglot.Domain;

namespace Polyglot.Infrastructure.DBConfigurations
{
    public class AdminSettingsConfiguration : IEntityTypeConfiguration<AdminSettings>
    {
        public void Configure(EntityTypeBuilder<AdminSettings> builder)
        {
            builder.HasKey(adminSettings => adminSettings.Id);

            builder.Property(adminSettings => adminSettings.MaxPricePerMillionTokens).HasPrecision(18, 6);
            builder.Property(adminSettings => adminSettings.CostMultiplier).HasPrecision(8, 4);
            builder.Property(adminSettings => adminSettings.CreditsPerUsd).HasPrecision(18, 4);
            builder.Property(adminSettings => adminSettings.DefaultImageModel).HasMaxLength(128);

            builder.ToTable(table => table.HasCheckConstraint("CK_AdminSettings_Singleton", $"\"Id\" = '{AdminSettings.SingletonId}'"));
        }
    }
}
