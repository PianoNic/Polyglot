using Polyglot.Application.Dtos;
using Polyglot.Domain;
using Polyglot.Domain.Enums;

namespace Polyglot.Application.Mappers
{
    public static class UserMapper
    {
        public static UserDto ToDto(this User user) =>
            new(user.Id, user.Email, user.DisplayName, user.AvatarUrl, user.Role, user.CreditBalance, user.IsLocked);
    }
}
