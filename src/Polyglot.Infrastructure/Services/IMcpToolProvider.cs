namespace Polyglot.Infrastructure.Services
{
    public interface IMcpToolProvider
    {
        Task<McpToolset> GetToolsForUserAsync(Guid userId, CancellationToken cancellationToken);
    }
}
