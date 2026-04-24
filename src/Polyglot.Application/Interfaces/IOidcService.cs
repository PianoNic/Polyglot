using Polyglot.Application.Dtos;

namespace Polyglot.Application.Interfaces
{
    public interface IOidcService
    {
        Task<OidcUser?> GetCurrentUserAsync(CancellationToken cancellationToken = default);
    }
}
