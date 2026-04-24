using Polyglot.Domain;

namespace Polyglot.Application.Interfaces
{
    public interface IAdminSettingsRepository
    {
        Task<AdminSettings> GetAsync(CancellationToken cancellationToken = default);
        Task SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
