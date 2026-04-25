using Polyglot.Infrastructure;
using Polyglot.Infrastructure.Seeders;

namespace Polyglot.API.Extensions
{
    public static class SeedExtensions
    {
        public static async Task<WebApplication> ApplySeedsAsync(this WebApplication app)
        {
            using var scope = app.Services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<PolyglotDbContext>();

            await AdminSettingsSeeder.SeedAsync(db);

            return app;
        }
    }
}
