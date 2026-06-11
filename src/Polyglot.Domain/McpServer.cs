using Polyglot.Domain.Enums;

namespace Polyglot.Domain
{
    public class McpServer : BaseEntity
    {
        public required string Name { get; set; }

        // Remote MCP endpoint reached over HTTP/SSE. Local stdio servers are not supported.
        public required string Url { get; set; }

        public McpTransportMode TransportMode { get; set; } = McpTransportMode.Auto;

        // Full value of the Authorization header sent to the endpoint (e.g. "Bearer xyz").
        // Null means the server is called without authentication.
        public string? AuthorizationHeader { get; set; }

        public bool Enabled { get; set; } = true;

        // Null = a shared server configured by an administrator and available to everyone.
        // Non-null = a server owned by a single user.
        public Guid? UserId { get; set; }
    }
}
