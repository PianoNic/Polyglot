using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Polyglot.Domain;

namespace Polyglot.Infrastructure.DBConfigurations
{
    public class AttachmentConfiguration : IEntityTypeConfiguration<Attachment>
    {
        public void Configure(EntityTypeBuilder<Attachment> builder)
        {
            builder.HasKey(attachment => attachment.Id);

            builder.HasIndex(attachment => attachment.MessageId);
            builder.HasIndex(attachment => attachment.UserId);
            builder.Property(attachment => attachment.FileName).HasMaxLength(255);
            builder.Property(attachment => attachment.MediaType).HasMaxLength(100);

            builder.HasOne<Message>()
                .WithMany()
                .HasForeignKey(attachment => attachment.MessageId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
