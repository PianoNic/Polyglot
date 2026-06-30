using Microsoft.Extensions.AI;

namespace Polyglot.Infrastructure.Services
{
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
                }
            }
        }
    }
}
