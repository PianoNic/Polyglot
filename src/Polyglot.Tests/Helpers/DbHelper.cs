using Microsoft.EntityFrameworkCore;
using Polyglot.Domain;
using Polyglot.Infrastructure;

namespace Polyglot.Tests.Helpers;

public static class DbHelper
{
    public static PolyglotDbContext CreateContext(string? dbName = null)
    {
        var options = new DbContextOptionsBuilder<PolyglotDbContext>()
            .UseInMemoryDatabase(dbName ?? Guid.NewGuid().ToString())
            .Options;

        return new PolyglotDbContext(options);
    }

    public static async Task<PolyglotDbContext> CreateSeededContextAsync(
        AdminSettings? settings = null,
        string? dbName = null)
    {
        var context = CreateContext(dbName);

        context.AdminSettings.Add(settings ?? new AdminSettings());
        await context.SaveChangesAsync();

        return context;
    }
}
