using Polyglot.Domain.Enums;

namespace Polyglot.Application.Dtos;

public record UserDto(
    Guid Id,
    string Email,
    string DisplayName,
    string? AvatarUrl,
    UserRole Role,
    long CreditBalance,
    bool IsLocked);
