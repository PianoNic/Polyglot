using Polyglot.Domain.Enums;

namespace Polyglot.Application.Dtos;

public record McpServerDto
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public required string Url { get; init; }
    public required McpTransportMode TransportMode { get; init; }
    public required bool Enabled { get; init; }

    // True for shared, admin-configured servers (UserId == null).
    public required bool IsGlobal { get; init; }

    // The secret header value is never returned; the UI only needs to know whether one is set.
    public required bool HasAuthHeader { get; init; }

    // Whether the current caller is allowed to edit or delete this server.
    public required bool CanManage { get; init; }
}
