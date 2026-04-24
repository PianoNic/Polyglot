using Microsoft.EntityFrameworkCore;
using Polyglot.Application.Interfaces;
using Polyglot.Domain;

namespace Polyglot.Infrastructure.Repositories
{
    public class AdminSettingsRepository(PolyglotDbContext dbContext) : IAdminSettingsRepository
    {
        public async Task<AdminSettings> GetAsync(CancellationToken cancellationToken = default)
        {
            var settings = await dbContext.AdminSettings.FirstOrDefaultAsync(cancellationToken);
            if (settings is not null) return settings;

            settings = new AdminSettings();
            dbContext.AdminSettings.Add(settings);
            await dbContext.SaveChangesAsync(cancellationToken);
            return settings;
        }

        public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            await dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
