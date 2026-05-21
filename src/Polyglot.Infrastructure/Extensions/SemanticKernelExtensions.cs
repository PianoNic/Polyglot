using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Polyglot.Infrastructure.Services;

namespace Polyglot.Infrastructure.Extensions
{
    public static class SemanticKernelExtensions
    {
        public static IServiceCollection AddSemanticKernel(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddSingleton<IChatCompletionServiceFactory, OpenRouterChatCompletionFactory>();
            return services;
        }
    }
}
