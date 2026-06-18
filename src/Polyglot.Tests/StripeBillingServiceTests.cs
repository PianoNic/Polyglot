using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using Polyglot.Domain;
using Polyglot.Infrastructure;
using Polyglot.Infrastructure.Configuration;
using Polyglot.Infrastructure.Services;
using Polyglot.Tests.Helpers;

namespace Polyglot.Tests;

// Exercises the real webhook verification + parsing path (Stripe's EventUtility),
// using self-signed payloads. Mirrors what Stripe sends so the signature, the
// API-version tolerance, and the event-to-grant mapping are all covered.
public class StripeBillingServiceTests
{
    private const string Secret = "whsec_unit_test_secret";
    private const string SubPrice = "price_sub_unit";

    private static StripeBillingService CreateService(PolyglotDbContext? dbContext = null)
    {
        var options = new StripeOptions
        {
            SecretKey = "sk_test_unit",
            WebhookSecret = Secret,
            Products =
            {
                new StripeProductOption { PriceId = SubPrice, Name = "Sub", Credits = 100_000, Mode = "subscription" },
            },
        };
        return new StripeBillingService(Options.Create(options), dbContext ?? DbHelper.CreateContext(), NullLogger<StripeBillingService>.Instance);
    }

    private static string Sign(string payload)
    {
        var ts = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(Secret));
        var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes($"{ts}.{payload}"));
        return $"t={ts},v1={Convert.ToHexString(hash).ToLowerInvariant()}";
    }

    [Test]
    public async Task ParseWebhook_CheckoutSessionCompleted_ReturnsUserGrant()
    {
        var userId = Guid.NewGuid();
        var payload =
            """{"id":"evt_c","object":"event","type":"checkout.session.completed","data":{"object":{"id":"cs_1","object":"checkout.session","mode":"payment","payment_status":"paid","client_reference_id":"__UID__","metadata":{"credits":"50000","userId":"__UID__"}}}}"""
                .Replace("__UID__", userId.ToString());

        var grant = CreateService().ParseWebhook(payload, Sign(payload));

        await Assert.That(grant).IsNotNull();
        await Assert.That(grant!.EventId).IsEqualTo("evt_c");
        await Assert.That(grant.UserId).IsEqualTo(userId);
        await Assert.That(grant.Credits).IsEqualTo(50_000L);
    }

    [Test]
    public async Task ParseWebhook_InvoicePaid_MapsLinePriceToCredits()
    {
        var payload =
            """{"id":"evt_i","object":"event","type":"invoice.paid","data":{"object":{"id":"in_1","object":"invoice","customer":"cus_x","lines":{"object":"list","data":[{"id":"il_1","object":"line_item","pricing":{"price_details":{"price":"__PRICE__"}}}]}}}}"""
                .Replace("__PRICE__", SubPrice);

        var grant = CreateService().ParseWebhook(payload, Sign(payload));

        await Assert.That(grant).IsNotNull();
        await Assert.That(grant!.EventId).IsEqualTo("evt_i");
        await Assert.That(grant.StripeCustomerId).IsEqualTo("cus_x");
        await Assert.That(grant.Credits).IsEqualTo(100_000L);
    }

    [Test]
    public async Task ParseWebhook_UnhandledEvent_ReturnsNull()
    {
        var payload = """{"id":"evt_u","object":"event","type":"customer.created","data":{"object":{"id":"cus_1","object":"customer"}}}""";

        var grant = CreateService().ParseWebhook(payload, Sign(payload));

        await Assert.That(grant).IsNull();
    }

    [Test]
    public async Task CreatePortalSession_NoStripeCustomer_Throws()
    {
        var db = DbHelper.CreateContext();
        var user = new User
        {
            ExternalId = Guid.NewGuid().ToString(),
            Email = "user@example.com",
            Preferences = new UserPreferences(),
        };
        db.Users.Add(user);
        await db.SaveChangesAsync();

        var threw = false;
        try
        {
            await CreateService(db).CreatePortalSessionAsync(user.Id);
        }
        catch (InvalidOperationException)
        {
            threw = true;
        }

        await Assert.That(threw).IsTrue();
    }

    [Test]
    public async Task ParseWebhook_BadSignature_Throws()
    {
        var payload = """{"id":"evt_c","object":"event","type":"checkout.session.completed","data":{"object":{"id":"cs_1","object":"checkout.session"}}}""";

        var threw = false;
        try
        {
            CreateService().ParseWebhook(payload, "t=1,v1=deadbeef");
        }
        catch (Exception)
        {
            threw = true;
        }

        await Assert.That(threw).IsTrue();
    }
}
