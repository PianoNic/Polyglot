using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Polyglot.Domain;

namespace Polyglot.Infrastructure.DBConfigurations
{
    public class MessageConfiguration : IEntityTypeConfiguration<Message>
    {
        public void Configure(EntityTypeBuilder<Message> builder)
        {
            builder.HasKey(message => message.Id);

            builder.HasIndex(message => new { message.ChatId, message.SequenceNumber });
            builder.Property(message => message.Role).HasConversion<string>().HasMaxLength(20);
            builder.Property(message => message.Model).HasMaxLength(200);
            builder.Property(message => message.ToolCallId).HasMaxLength(100);
            builder.Property(message => message.FinishReason).HasMaxLength(50);
            builder.Property(message => message.ToolCalls).HasColumnType("text");
            builder.Property(message => message.TokenUsage).HasMaxLength(50);
        }
    }
}
