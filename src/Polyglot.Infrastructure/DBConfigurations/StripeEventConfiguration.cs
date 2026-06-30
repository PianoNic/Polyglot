using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Polyglot.Domain;

namespace Polyglot.Infrastructure.DBConfigurations
{
    public class StripeEventConfiguration : IEntityTypeConfiguration<StripeEvent>
    {
        public void Configure(EntityTypeBuilder<StripeEvent> builder)
        {
            builder.HasKey(stripeEvent => stripeEvent.Id);
            builder.Property(stripeEvent => stripeEvent.Id).HasMaxLength(255);
        }
    }
}
