namespace Polyglot.Infrastructure.Services
{
    public interface IMcpToolProvider
    {
        // Connects to every enabled MCP server visible to the user (their own plus the
        // shared/global ones) and exposes the discovered tools as AIFunctions. The returned
        // toolset owns the live connections and must be disposed once the chat turn completes.
        Task<McpToolset> GetToolsForUserAsync(Guid userId, CancellationToken cancellationToken);
    }
}
