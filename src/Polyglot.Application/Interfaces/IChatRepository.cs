using Polyglot.Domain;

namespace Polyglot.Application.Interfaces
{
    public interface IChatRepository
    {
        Task<Chat?> GetByIdAsync(Guid chatId, Guid userId, CancellationToken cancellationToken = default);
        Task<List<Chat>> GetAllByUserAsync(Guid userId, CancellationToken cancellationToken = default);
        Task<Chat> CreateAsync(Guid userId, string title, CancellationToken cancellationToken = default);
        Task DeleteAsync(Chat chat, CancellationToken cancellationToken = default);
        Task SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
