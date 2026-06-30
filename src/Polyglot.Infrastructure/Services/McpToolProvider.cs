using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.AI;
using Microsoft.Extensions.Logging;
using ModelContextProtocol.Client;
using Polyglot.Domain.Enums;

namespace Polyglot.Infrastructure.Services
{
    public class McpToolProvider(
        PolyglotDbContext dbContext,
        ILoggerFactory loggerFactory,
        ILogger<McpToolProvider> logger) : IMcpToolProvider
    {
        private static readonly TimeSpan ConnectTimeout = TimeSpan.FromSeconds(15);

        public async Task<McpToolset> GetToolsForUserAsync(Guid userId, CancellationToken cancellationToken)
        {
            var servers = await dbContext.McpServers
                .Where(server => server.Enabled && (server.UserId == null || server.UserId == userId))
                .AsNoTracking()
                .ToListAsync(cancellationToken);

            if (servers.Count == 0)
                return McpToolset.Empty;

            var tools = new List<AIFunction>();
            var connections = new List<IAsyncDisposable>();

            foreach (var server in servers)
            {
                try
                {
                    var options = new HttpClientTransportOptions
                    {
                        Endpoint = new Uri(server.Url),
                        Name = server.Name,
                        ConnectionTimeout = ConnectTimeout,
                        TransportMode = server.TransportMode switch
                        {
                            McpTransportMode.Sse => HttpTransportMode.Sse,
                            McpTransportMode.StreamableHttp => HttpTransportMode.StreamableHttp,
                            _ => HttpTransportMode.AutoDetect
                        }
                    };

                    if (!string.IsNullOrWhiteSpace(server.AuthorizationHeader))
                        options.AdditionalHeaders = new Dictionary<string, string> { ["Authorization"] = server.AuthorizationHeader };

                    using var timeoutCts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
                    timeoutCts.CancelAfter(ConnectTimeout);

                    var transport = new HttpClientTransport(options, loggerFactory);
                    var client = await McpClient.CreateAsync(transport, loggerFactory: loggerFactory, cancellationToken: timeoutCts.Token);
                    connections.Add(client);

                    var serverTools = await client.ListToolsAsync(cancellationToken: timeoutCts.Token);
                    tools.AddRange(serverTools);
                }
                catch (Exception ex) when (ex is not OperationCanceledException || !cancellationToken.IsCancellationRequested)
                {
                    logger.LogWarning(ex, "Failed to load tools from MCP server {ServerName} ({ServerId})", server.Name, server.Id);
                }
            }

            return new McpToolset(tools, connections);
        }
    }
}
