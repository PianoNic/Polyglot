using Polyglot.API.Extensions;
using Polyglot.Infrastructure.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.ConfigureKestrel(options => options.AddServerHeader = false);

builder.Services.AddApiPresentation();
builder.Services.AddOpenApiDocumentation(builder.Configuration);
builder.Services.AddMediator(options => { options.ServiceLifetime = ServiceLifetime.Scoped; });
builder.Services.AddPolyglotDatabase(builder.Configuration);
builder.Services.AddPolyglotServices(builder.Configuration);
builder.Services.AddPolyglotCors(builder.Configuration);
builder.Services.AddPolyglotAuthentication(builder.Configuration);
builder.Services.AddPolyglotAuthorization();

var app = builder.Build();

app.ApplyMigrations();
await app.ApplySeedsAsync();

app.UseOpenApiDocumentation(builder.Configuration);
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHealthChecks("/healthz").AllowAnonymous();

app.Run();
