using Microsoft.AspNetCore.Http;
using Polyglot.Application.Interfaces;
using System.Security.Claims;

namespace Polyglot.Infrastructure.Services
{
    public class CurrentUserService(IHttpContextAccessor httpContextAccessor) : ICurrentUserService
    {
        private ClaimsPrincipal? User => httpContextAccessor.HttpContext?.User;

        public string? ExternalId =>
            User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? User?.FindFirst("sub")?.Value;

        public string? Email =>
            User?.FindFirst(ClaimTypes.Email)?.Value
            ?? User?.FindFirst("email")?.Value;

        public string? DisplayName =>
            User?.FindFirst(ClaimTypes.Name)?.Value
            ?? User?.FindFirst("name")?.Value;

        public bool IsAuthenticated => User?.Identity?.IsAuthenticated ?? false;
    }
}
