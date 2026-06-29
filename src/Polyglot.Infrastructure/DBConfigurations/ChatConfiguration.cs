using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Polyglot.Domain;

namespace Polyglot.Infrastructure.DBConfigurations
{
    public class ChatConfiguration : IEntityTypeConfiguration<Chat>
    {
        public void Configure(EntityTypeBuilder<Chat> builder)
        {
            builder.HasKey(chat => chat.Id);

            builder.HasIndex(chat => chat.UserId);
            builder.Property(chat => chat.Title).HasMaxLength(200);

            builder.HasOne(chat => chat.User).WithMany().HasForeignKey(chat => chat.UserId).OnDelete(DeleteBehavior.Cascade);
            builder.HasMany(chat => chat.Messages).WithOne(message => message.Chat).HasForeignKey(message => message.ChatId).OnDelete(DeleteBehavior.Cascade);
        }
    }
}
