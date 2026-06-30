using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Polyglot.Infrastructure.Services;
using System.Security.Claims;

namespace Polyglot.API.Extensions
{
    public static class AuthenticationExtensions
    {
        public static IServiceCollection AddPolyglotAuthentication(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.Authority = configuration["Oidc:Authority"];
                    options.RequireHttpsMetadata = configuration.GetValue("Oidc:RequireHttpsMetadata", true);
                    options.MapInboundClaims = false;
                    options.TokenValidationParameters.NameClaimType = "name";
                    options.TokenValidationParameters.RoleClaimType = "roles";
                    options.TokenValidationParameters.ValidateAudience = false;
                })
                .AddUserSync();

            return services;
        }

        public static IServiceCollection AddPolyglotAuthorization(this IServiceCollection services)
        {
            services.AddAuthorization(options =>
                options.FallbackPolicy = new AuthorizationPolicyBuilder()
                    .RequireAuthenticatedUser()
                    .Build());

            return services;
        }

        public static AuthenticationBuilder AddUserSync(this AuthenticationBuilder builder)
        {
            builder.Services.PostConfigure<JwtBearerOptions>(
                JwtBearerDefaults.AuthenticationScheme,
                options =>
                {
                    options.Events ??= new JwtBearerEvents();
                    var previous = options.Events.OnTokenValidated;

                    options.Events.OnTokenValidated = async context =>
                    {
                        if (previous is not null)
                            await previous(context);

                        if (context.Principal?.Identity is not ClaimsIdentity identity)
                            return;

                        context.HttpContext.User = context.Principal;

                        var externalId = identity.FindFirst("sub")?.Value ?? identity.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                        if (string.IsNullOrEmpty(externalId))
                            return;

                        var userService = context.HttpContext.RequestServices.GetRequiredService<IUserService>();

                        if (await userService.ExistsAsync(externalId, context.HttpContext.RequestAborted))
                            return;

                        await userService.SyncCurrentUserAsync(context.HttpContext.RequestAborted);
                    };
                });

            return builder;
        }
    }
}
