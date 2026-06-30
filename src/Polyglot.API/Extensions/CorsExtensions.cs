using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Polyglot.API.Extensions
{
    public static class CorsExtensions
    {
        public static IServiceCollection AddPolyglotCors(this IServiceCollection services, IConfiguration configuration)
        {
            var allowedOrigins = configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
                ?? throw new InvalidOperationException("Cors:AllowedOrigins not configured");

            services.AddCors(options =>
                options.AddDefaultPolicy(policy => policy
                    .WithOrigins(allowedOrigins)
                    .AllowAnyHeader()
                    .AllowAnyMethod()));

            return services;
        }
    }
}
