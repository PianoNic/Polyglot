using Microsoft.EntityFrameworkCore;
using Polyglot.Infrastructure;

namespace Polyglot.API.Extensions
{
    public static class MigrationExtensions
    {
        public static WebApplication ApplyMigrations(this WebApplication app)
        {
            using var scope = app.Services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<PolyglotDbContext>();
            db.Database.Migrate();
            return app;
        }
    }

}
