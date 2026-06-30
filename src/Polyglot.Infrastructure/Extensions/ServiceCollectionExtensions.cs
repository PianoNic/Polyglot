using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Polyglot.Infrastructure.BackgroundServices;
using Polyglot.Infrastructure.Clients;
using Polyglot.Infrastructure.Configuration;
using Polyglot.Infrastructure.Services;

namespace Polyglot.Infrastructure.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddPolyglotServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddHttpClient();
            services.AddHttpContextAccessor();

            services.AddScoped<IOidcService, OidcService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IOpenRouterClient, OpenRouterClient>();
            services.AddScoped<ICreditsService, CreditsService>();
            services.AddSingleton<IJsExecutionService>(_ => new JsExecutionService());
            services.AddSingleton<IChatTitleGenerator, ChatTitleGenerator>();
            services.AddScoped<IMcpToolProvider, McpToolProvider>();
            services.AddScoped<IStripeBillingService, StripeBillingService>();
            services.Configure<StripeOptions>(configuration.GetSection(StripeOptions.SectionName));

            services.AddAgentFramework(configuration);
            services.AddHostedServices();

            return services;
        }
    }
}
