using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Polyglot.Domain;

namespace Polyglot.Infrastructure.DBConfigurations
{
    public class StripeEventConfiguration : IEntityTypeConfiguration<StripeEvent>
    {
        public void Configure(EntityTypeBuilder<StripeEvent> builder)
        {
            // The Stripe event id is the natural primary key; inserting a duplicate is
            // what makes credit grants idempotent under webhook retries.
            builder.HasKey(e => e.Id);
            builder.Property(e => e.Id).HasMaxLength(255);
        }
    }
}
