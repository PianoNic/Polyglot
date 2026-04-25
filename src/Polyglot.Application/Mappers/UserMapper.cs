using Polyglot.Application.Dtos;
using Polyglot.Domain;
using Polyglot.Domain.Enums;

namespace Polyglot.Application.Mappers
{
    public static class UserMapper
    {
        public static UserDto ToDto(this User user) =>
            new(user.ExternalId, user.Email, user.DisplayName, user.AvatarUrl, user.Role, user.CreditBalance);

        public static User ToDomain(this UserDto dto) =>
            new()
            {
                ExternalId = dto.ExternalId,
                Email = dto.Email,
                DisplayName = dto.DisplayName,
                AvatarUrl = dto.AvatarUrl,
                Role = dto.Role,
                CreditBalance = dto.CreditBalance,
                Preferences = new UserPreferences()
            };
    }
}
