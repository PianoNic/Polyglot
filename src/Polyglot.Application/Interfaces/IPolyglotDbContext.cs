namespace Polyglot.Application.Interfaces
{
    public interface IPolyglotDbContext
    {
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
