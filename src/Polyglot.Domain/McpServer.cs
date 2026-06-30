using Polyglot.Domain.Enums;

namespace Polyglot.Domain
{
    public class McpServer : BaseEntity
    {
        public required string Name { get; set; }

        public required string Url { get; set; }

        public McpTransportMode TransportMode { get; set; } = McpTransportMode.Auto;

        public string? AuthorizationHeader { get; set; }

        public bool Enabled { get; set; } = true;

        public Guid? UserId { get; set; }
    }
}
