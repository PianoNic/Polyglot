using Polyglot.Infrastructure.Dtos;

namespace Polyglot.Infrastructure.Services
{
    public interface IOidcService
    {
        Task<OidcUser?> GetCurrentUserAsync(CancellationToken cancellationToken = default);
    }
}
