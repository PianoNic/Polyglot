using Polyglot.Domain.Enums;

namespace Polyglot.Application.Dtos;

public record UserDto(
    string ExternalId,
    string Email,
    string DisplayName,
    string? AvatarUrl,
    UserRole Role);
