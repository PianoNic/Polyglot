using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Polyglot.Infrastructure;

namespace Polyglot.API.Extensions
{
    public static class DatabaseExtensions
    {
        public static IServiceCollection AddPolyglotDatabase(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<PolyglotDbContext>(options =>
                options.UseNpgsql(
                    configuration.GetConnectionString("PolyglotDatabase"),
                    npgsqlOptions => npgsqlOptions
                        .EnableRetryOnFailure(
                            maxRetryCount: 5,
                            maxRetryDelay: TimeSpan.FromSeconds(10),
                            errorCodesToAdd: null)));

            return services;
        }
    }
}
