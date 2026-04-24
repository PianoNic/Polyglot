using Microsoft.EntityFrameworkCore;
using Polyglot.Application.Interfaces;
using Polyglot.Domain;

namespace Polyglot.Infrastructure.Repositories
{
    public class ChatRepository(PolyglotDbContext dbContext) : IChatRepository
    {
        public async Task<Chat?> GetByIdAsync(Guid chatId, Guid userId, CancellationToken cancellationToken = default)
        {
            return await dbContext.Chats
                .Include(c => c.Messages.OrderBy(m => m.SequenceNumber))
                .FirstOrDefaultAsync(c => c.Id == chatId && c.UserId == userId, cancellationToken);
        }

        public async Task<List<Chat>> GetAllByUserAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            return await dbContext.Chats
                .Where(c => c.UserId == userId)
                .OrderByDescending(c => c.UpdatedAt)
                .ToListAsync(cancellationToken);
        }

        public async Task<Chat> CreateAsync(Guid userId, string title, CancellationToken cancellationToken = default)
        {
            var chat = new Chat
            {
                UserId = userId,
                Title = title,
                User = null!,
                Messages = []
            };

            dbContext.Chats.Add(chat);
            return chat;
        }

        public async Task DeleteAsync(Chat chat, CancellationToken cancellationToken = default)
        {
            dbContext.Chats.Remove(chat);
            await dbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            await dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
