using System.Net;
using System.Net.Sockets;
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

            if (TargetsPrivateHost(uri))
                return "URL must point to a public host";

            return null;
        }

        // Blocks SSRF to internal infrastructure: loopback, link-local (incl. cloud
        // metadata 169.254.169.254), and private/unique-local addresses. Hostnames are
        // resolved so names that map to internal IPs are caught too.
        private static bool TargetsPrivateHost(Uri uri)
        {
            if (string.Equals(uri.Host, "localhost", StringComparison.OrdinalIgnoreCase))
                return true;

            IEnumerable<IPAddress> addresses;
            if (IPAddress.TryParse(uri.Host, out var literal))
            {
                addresses = [literal];
            }
            else
            {
                // Unresolvable hosts will simply fail to connect later, so don't block them.
                try { addresses = Dns.GetHostAddresses(uri.Host); }
                catch { return false; }
            }

            return addresses.Any(IsPrivate);
        }

        private static bool IsPrivate(IPAddress ip)
        {
            if (ip.IsIPv4MappedToIPv6)
                ip = ip.MapToIPv4();

            if (IPAddress.IsLoopback(ip))
                return true;

            if (ip.AddressFamily == AddressFamily.InterNetwork)
            {
                var b = ip.GetAddressBytes();
                return b[0] == 10
                    || (b[0] == 172 && b[1] >= 16 && b[1] <= 31)
                    || (b[0] == 192 && b[1] == 168)
                    || (b[0] == 169 && b[1] == 254);
            }

            return ip.IsIPv6LinkLocal || ip.IsIPv6SiteLocal || ip.IsIPv6UniqueLocal;
        }
    }
}
