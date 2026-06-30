using Polyglot.Domain.Enums;

namespace Polyglot.Application.Dtos;

public record McpServerDto
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public required string Url { get; init; }
    public required McpTransportMode TransportMode { get; init; }
    public required bool Enabled { get; init; }

    public required bool IsGlobal { get; init; }

    public required bool HasAuthHeader { get; init; }

    public required bool CanManage { get; init; }
}
