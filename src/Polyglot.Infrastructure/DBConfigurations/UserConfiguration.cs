using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Polyglot.Domain;

namespace Polyglot.Infrastructure.DBConfigurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasKey(user => user.Id);

            builder.HasIndex(user => user.ExternalId).IsUnique();
            builder.Property(user => user.ExternalId).HasMaxLength(100);
            builder.Property(user => user.Email).HasMaxLength(255);
            builder.Property(user => user.DisplayName).HasMaxLength(100);
            builder.Property(user => user.Role).HasConversion<string>().HasMaxLength(20);
            builder.Property(user => user.StripeCustomerId).HasMaxLength(64);
            builder.HasIndex(user => user.StripeCustomerId);
            builder.OwnsOne(user => user.Preferences, preferences =>
            {
                preferences.Property(preference => preference.PreferredImageModel).HasMaxLength(128);
            });
        }
    }
}
