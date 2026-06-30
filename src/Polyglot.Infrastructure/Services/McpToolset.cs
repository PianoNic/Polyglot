using Microsoft.Extensions.AI;

namespace Polyglot.Infrastructure.Services
{
    // Holds the MCP tools discovered for a chat turn together with the live client
    // connections that back them, so the connections stay open for the whole
    // tool-calling loop and are torn down together afterwards.
    public class McpToolset(IReadOnlyList<AIFunction> tools, IReadOnlyList<IAsyncDisposable> connections) : IAsyncDisposable
    {
        public static readonly McpToolset Empty = new([], []);

        public IReadOnlyList<AIFunction> Tools => tools;

        public async ValueTask DisposeAsync()
        {
            foreach (var connection in connections)
            {
                try
                {
                    await connection.DisposeAsync();
                }
                catch
                {
                    // Best-effort cleanup: a server that fails to close cleanly must not
                    // surface as an error after the response has already been delivered.
                }
            }
        }
    }
}
