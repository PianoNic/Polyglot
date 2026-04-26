using Polyglot.Domain.Enums;

namespace Polyglot.Domain
{
    public class User : BaseEntity
    {
        public required string ExternalId { get; init; }
        public required string Email { get; set; }
        public string DisplayName { get; set; } = "Polyglot User";
        public UserRole Role { get; set; } = UserRole.User;
        public string? AvatarUrl { get; set; }
        public long CreditBalance { get; set; }
        public bool IsLocked { get; set; }
        public required UserPreferences Preferences { get; set; } = new UserPreferences();
    }
}
