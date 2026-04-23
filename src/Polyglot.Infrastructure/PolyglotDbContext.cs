using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Polyglot.Domain;

namespace Polyglot.Infrastructure
{
    public class PolyglotDbContext(DbContextOptions<PolyglotDbContext> options) : DbContext(options)
    {
        public DbSet<User> Users => Set<User>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(PolyglotDbContext).Assembly);
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            foreach (var entry in ChangeTracker.Entries<BaseEntity>())
                if (entry.State == EntityState.Modified)
                    entry.Entity.UpdatedAt = DateTime.UtcNow;

            return base.SaveChangesAsync(cancellationToken);
        }
    }

    public class PolyglotDbContextFactory : IDesignTimeDbContextFactory<PolyglotDbContext>
    {
        public PolyglotDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<PolyglotDbContext>();
            optionsBuilder.UseNpgsql();
            return new PolyglotDbContext(optionsBuilder.Options);
        }
    }
}
