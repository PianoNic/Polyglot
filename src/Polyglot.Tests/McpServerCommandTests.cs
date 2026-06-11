using Microsoft.EntityFrameworkCore;
using NSubstitute;
using Polyglot.Application.Command;
using Polyglot.Application.Queries;
using Polyglot.Domain;
using Polyglot.Domain.Enums;
using Polyglot.Infrastructure;
using Polyglot.Infrastructure.Services;

namespace Polyglot.Tests;

public class McpServerCommandTests
{
    [Test]
    public async Task Create_OwnServer_Succeeds()
    {
        var db = CreateDb();
        var user = await SeedUser(db, UserRole.User);

        var result = await CreateHandler(db, user.Id).Handle(
            new CreateMcpServerCommand("My Server", "https://mcp.example.com", McpTransportMode.Auto, null, true, Global: false),
            CancellationToken.None);

        await Assert.That(result.IsSuccess).IsTrue();
        await Assert.That(result.Value!.IsGlobal).IsFalse();
        await Assert.That(result.Value!.CanManage).IsTrue();

        var saved = await db.McpServers.SingleAsync();
        await Assert.That(saved.UserId).IsEqualTo(user.Id);
    }

    [Test]
    public async Task Create_GlobalServer_AsNonAdmin_Fails()
    {
        var db = CreateDb();
        var user = await SeedUser(db, UserRole.User);

        var result = await CreateHandler(db, user.Id).Handle(
            new CreateMcpServerCommand("Shared", "https://mcp.example.com", McpTransportMode.Auto, null, true, Global: true),
            CancellationToken.None);

        await Assert.That(result.IsFailure).IsTrue();
        await Assert.That(result.Error).Contains("administrators");
        await Assert.That(await db.McpServers.AnyAsync()).IsFalse();
    }

    [Test]
    public async Task Create_GlobalServer_AsAdmin_Succeeds()
    {
        var db = CreateDb();
        var admin = await SeedUser(db, UserRole.Admin);

        var result = await CreateHandler(db, admin.Id).Handle(
            new CreateMcpServerCommand("Shared", "https://mcp.example.com", McpTransportMode.StreamableHttp, "Bearer secret", true, Global: true),
            CancellationToken.None);

        await Assert.That(result.IsSuccess).IsTrue();
        await Assert.That(result.Value!.IsGlobal).IsTrue();
        await Assert.That(result.Value!.HasAuthHeader).IsTrue();

        var saved = await db.McpServers.SingleAsync();
        await Assert.That(saved.UserId).IsNull();
    }

    [Test]
    public async Task Create_InvalidUrl_Fails()
    {
        var db = CreateDb();
        var user = await SeedUser(db, UserRole.User);

        var result = await CreateHandler(db, user.Id).Handle(
            new CreateMcpServerCommand("Bad", "not-a-url", McpTransportMode.Auto, null, true, Global: false),
            CancellationToken.None);

        await Assert.That(result.IsFailure).IsTrue();
        await Assert.That(result.Error).Contains("http");
    }

    [Test]
    public async Task Update_OthersServer_Fails()
    {
        var db = CreateDb();
        var owner = await SeedUser(db, UserRole.User, "owner");
        var intruder = await SeedUser(db, UserRole.User, "intruder");
        var server = await SeedServer(db, ownerId: owner.Id);

        var result = await UpdateHandler(db, intruder.Id).Handle(
            new UpdateMcpServerCommand(server.Id, "Hacked", "https://evil.example.com", McpTransportMode.Auto, null, true),
            CancellationToken.None);

        await Assert.That(result.IsFailure).IsTrue();
        await Assert.That(result.Error).Contains("not allowed");
    }

    [Test]
    public async Task Update_GlobalServer_AsNonAdmin_Fails()
    {
        var db = CreateDb();
        var user = await SeedUser(db, UserRole.User);
        var server = await SeedServer(db, ownerId: null);

        var result = await UpdateHandler(db, user.Id).Handle(
            new UpdateMcpServerCommand(server.Id, "Renamed", "https://mcp.example.com", McpTransportMode.Auto, null, true),
            CancellationToken.None);

        await Assert.That(result.IsFailure).IsTrue();
        await Assert.That(result.Error).Contains("not allowed");
    }

    [Test]
    public async Task Update_NullAuthHeader_KeepsExistingSecret()
    {
        var db = CreateDb();
        var user = await SeedUser(db, UserRole.User);
        var server = await SeedServer(db, ownerId: user.Id, authHeader: "Bearer keep-me");

        var result = await UpdateHandler(db, user.Id).Handle(
            new UpdateMcpServerCommand(server.Id, "Renamed", "https://mcp.example.com", McpTransportMode.Auto, null, true),
            CancellationToken.None);

        await Assert.That(result.IsSuccess).IsTrue();
        var saved = await db.McpServers.SingleAsync();
        await Assert.That(saved.AuthorizationHeader).IsEqualTo("Bearer keep-me");
    }

    [Test]
    public async Task Update_EmptyAuthHeader_ClearsSecret()
    {
        var db = CreateDb();
        var user = await SeedUser(db, UserRole.User);
        var server = await SeedServer(db, ownerId: user.Id, authHeader: "Bearer remove-me");

        var result = await UpdateHandler(db, user.Id).Handle(
            new UpdateMcpServerCommand(server.Id, "Renamed", "https://mcp.example.com", McpTransportMode.Auto, "", true),
            CancellationToken.None);

        await Assert.That(result.IsSuccess).IsTrue();
        var saved = await db.McpServers.SingleAsync();
        await Assert.That(saved.AuthorizationHeader).IsNull();
    }

    [Test]
    public async Task Delete_GlobalServer_AsNonAdmin_Fails()
    {
        var db = CreateDb();
        var user = await SeedUser(db, UserRole.User);
        var server = await SeedServer(db, ownerId: null);

        var result = await DeleteHandler(db, user.Id).Handle(new DeleteMcpServerCommand(server.Id), CancellationToken.None);

        await Assert.That(result.IsFailure).IsTrue();
        await Assert.That(await db.McpServers.AnyAsync()).IsTrue();
    }

    [Test]
    public async Task Delete_OwnServer_Succeeds()
    {
        var db = CreateDb();
        var user = await SeedUser(db, UserRole.User);
        var server = await SeedServer(db, ownerId: user.Id);

        var result = await DeleteHandler(db, user.Id).Handle(new DeleteMcpServerCommand(server.Id), CancellationToken.None);

        await Assert.That(result.IsSuccess).IsTrue();
        await Assert.That(await db.McpServers.AnyAsync()).IsFalse();
    }

    [Test]
    public async Task GetServers_ReturnsGlobalAndOwn_WithManageFlags()
    {
        var db = CreateDb();
        var user = await SeedUser(db, UserRole.User, "me");
        var other = await SeedUser(db, UserRole.User, "other");
        var global = await SeedServer(db, ownerId: null, name: "Global");
        var mine = await SeedServer(db, ownerId: user.Id, name: "Mine");
        await SeedServer(db, ownerId: other.Id, name: "Theirs");

        var result = await QueryHandler(db, user.Id).Handle(new GetMcpServersQuery(), CancellationToken.None);

        await Assert.That(result.IsSuccess).IsTrue();
        var servers = result.Value!;
        await Assert.That(servers.Count).IsEqualTo(2);

        var globalDto = servers.Single(s => s.Id == global.Id);
        await Assert.That(globalDto.IsGlobal).IsTrue();
        await Assert.That(globalDto.CanManage).IsFalse(); // non-admin cannot manage shared servers

        var mineDto = servers.Single(s => s.Id == mine.Id);
        await Assert.That(mineDto.CanManage).IsTrue();
    }

    // --- Helpers ---

    private static PolyglotDbContext CreateDb()
    {
        var options = new DbContextOptionsBuilder<PolyglotDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new PolyglotDbContext(options);
    }

    private static async Task<User> SeedUser(PolyglotDbContext db, UserRole role, string externalId = "ext-1")
    {
        var user = new User
        {
            ExternalId = externalId,
            Email = $"{externalId}@test.com",
            Role = role,
            Preferences = new UserPreferences()
        };
        db.Users.Add(user);
        await db.SaveChangesAsync();
        return user;
    }

    private static async Task<McpServer> SeedServer(PolyglotDbContext db, Guid? ownerId, string name = "Server", string? authHeader = null)
    {
        var server = new McpServer
        {
            Name = name,
            Url = "https://mcp.example.com",
            TransportMode = McpTransportMode.Auto,
            AuthorizationHeader = authHeader,
            Enabled = true,
            UserId = ownerId
        };
        db.McpServers.Add(server);
        await db.SaveChangesAsync();
        return server;
    }

    private static IUserService UserService(Guid userId)
    {
        var userService = Substitute.For<IUserService>();
        userService.GetCurrentUserIdAsync(Arg.Any<CancellationToken>()).Returns(userId);
        return userService;
    }

    private static CreateMcpServerCommandHandler CreateHandler(PolyglotDbContext db, Guid userId)
        => new(UserService(userId), db);

    private static UpdateMcpServerCommandHandler UpdateHandler(PolyglotDbContext db, Guid userId)
        => new(UserService(userId), db);

    private static DeleteMcpServerCommandHandler DeleteHandler(PolyglotDbContext db, Guid userId)
        => new(UserService(userId), db);

    private static GetMcpServersQueryHandler QueryHandler(PolyglotDbContext db, Guid userId)
        => new(UserService(userId), db);
}
