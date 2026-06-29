using Microsoft.EntityFrameworkCore;
using Polyglot.Application.Command;
using Polyglot.Domain;
using Polyglot.Infrastructure;
using Polyglot.Tests.Helpers;

namespace Polyglot.Tests;

public class GrantStripeCreditsCommandTests
{
    private static async Task<User> SeedUser(PolyglotDbContext db, long balance = 0, string? stripeCustomerId = null)
    {
        var user = new User
        {
            ExternalId = Guid.NewGuid().ToString(),
            Email = "user@example.com",
            CreditBalance = balance,
            StripeCustomerId = stripeCustomerId,
            Preferences = new UserPreferences(),
        };
        db.Users.Add(user);
        await db.SaveChangesAsync();
        return user;
    }

    [Test]
    public async Task Grant_ByUserId_AddsCredits()
    {
        var db = DbHelper.CreateContext();
        var user = await SeedUser(db, balance: 100);

        var result = await new GrantStripeCreditsCommandHandler(db).Handle(
            new GrantStripeCreditsCommand("evt_1", user.Id, null, 500), CancellationToken.None);

        await Assert.That(result.IsSuccess).IsTrue();
        var saved = await db.Users.SingleAsync(entity => entity.Id == user.Id);
        await Assert.That(saved.CreditBalance).IsEqualTo(600L);
        await Assert.That(await db.StripeEvents.AnyAsync(stripeEvent => stripeEvent.Id == "evt_1")).IsTrue();
    }

    [Test]
    public async Task Grant_SameEventTwice_CreditsOnce()
    {
        var db = DbHelper.CreateContext();
        var user = await SeedUser(db, balance: 0);

        var first = await new GrantStripeCreditsCommandHandler(db).Handle(
            new GrantStripeCreditsCommand("evt_dup", user.Id, null, 1000), CancellationToken.None);
        var second = await new GrantStripeCreditsCommandHandler(db).Handle(
            new GrantStripeCreditsCommand("evt_dup", user.Id, null, 1000), CancellationToken.None);

        await Assert.That(first.IsSuccess).IsTrue();
        await Assert.That(second.IsSuccess).IsTrue();
        var saved = await db.Users.SingleAsync(entity => entity.Id == user.Id);
        await Assert.That(saved.CreditBalance).IsEqualTo(1000L);
        await Assert.That(await db.StripeEvents.CountAsync()).IsEqualTo(1);
    }

    [Test]
    public async Task Grant_ByStripeCustomerId_ResolvesUser()
    {
        var db = DbHelper.CreateContext();
        var user = await SeedUser(db, balance: 50, stripeCustomerId: "cus_123");

        var result = await new GrantStripeCreditsCommandHandler(db).Handle(
            new GrantStripeCreditsCommand("evt_sub", null, "cus_123", 200), CancellationToken.None);

        await Assert.That(result.IsSuccess).IsTrue();
        var saved = await db.Users.SingleAsync(entity => entity.Id == user.Id);
        await Assert.That(saved.CreditBalance).IsEqualTo(250L);
    }

    [Test]
    public async Task Grant_NonPositiveCredits_Fails()
    {
        var db = DbHelper.CreateContext();
        var user = await SeedUser(db);

        var result = await new GrantStripeCreditsCommandHandler(db).Handle(
            new GrantStripeCreditsCommand("evt_zero", user.Id, null, 0), CancellationToken.None);

        await Assert.That(result.IsFailure).IsTrue();
        await Assert.That(await db.StripeEvents.AnyAsync()).IsFalse();
    }

    [Test]
    public async Task Grant_UnknownUser_Fails()
    {
        var db = DbHelper.CreateContext();

        var result = await new GrantStripeCreditsCommandHandler(db).Handle(
            new GrantStripeCreditsCommand("evt_missing", Guid.NewGuid(), null, 500), CancellationToken.None);

        await Assert.That(result.IsFailure).IsTrue();
        await Assert.That(await db.StripeEvents.AnyAsync()).IsFalse();
    }
}
