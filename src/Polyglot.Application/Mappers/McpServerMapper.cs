using Polyglot.Application.Dtos;
using Polyglot.Domain;
using Polyglot.Domain.Enums;

namespace Polyglot.Application.Mappers
{
    public static class McpServerAuthorization
    {
        // Shared (global) servers are admin-only; owned servers can be managed by their owner.
        public static bool CanManage(McpServer server, User user)
            => server.UserId is null ? user.Role == UserRole.Admin : server.UserId == user.Id;
    }

    public static class McpServerMapper
    {
        public static McpServerDto ToDto(this McpServer server, bool canManage)
        {
            return new McpServerDto
            {
                Id = server.Id,
                Name = server.Name,
                Url = server.Url,
                TransportMode = server.TransportMode,
                Enabled = server.Enabled,
                IsGlobal = server.UserId is null,
                HasAuthHeader = !string.IsNullOrEmpty(server.AuthorizationHeader),
                CanManage = canManage,
            };
        }
    }

    public static class McpServerValidation
    {
        // Returns an error message, or null when the input is valid.
        public static string? Validate(string? name, string? url)
        {
            if (string.IsNullOrWhiteSpace(name))
                return "Name is required";

            if (string.IsNullOrWhiteSpace(url))
                return "URL is required";

            if (!Uri.TryCreate(url.Trim(), UriKind.Absolute, out var uri)
                || (uri.Scheme != Uri.UriSchemeHttp && uri.Scheme != Uri.UriSchemeHttps))
                return "URL must be an absolute http or https address";

            return null;
        }
    }
}
