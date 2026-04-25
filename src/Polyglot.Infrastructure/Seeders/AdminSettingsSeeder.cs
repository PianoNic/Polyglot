using Microsoft.EntityFrameworkCore;
using Polyglot.Domain;

namespace Polyglot.Infrastructure.Seeders
{
    public static class AdminSettingsSeeder
    {
        public static async Task SeedAsync(PolyglotDbContext dbContext, CancellationToken cancellationToken = default)
        {
            if (await dbContext.AdminSettings.AnyAsync(cancellationToken))
                return;

            dbContext.AdminSettings.Add(new AdminSettings());
            await dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
