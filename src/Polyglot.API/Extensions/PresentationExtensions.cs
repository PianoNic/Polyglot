using System.Text.Json.Serialization;
using Microsoft.Extensions.DependencyInjection;

namespace Polyglot.API.Extensions
{
    public static class PresentationExtensions
    {
        public static IServiceCollection AddApiPresentation(this IServiceCollection services)
        {
            services.AddControllers()
                .AddJsonOptions(options =>
                    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

            services.ConfigureHttpJsonOptions(options =>
                options.SerializerOptions.Converters.Add(new JsonStringEnumConverter()));

            services.AddHealthChecks();

            return services;
        }
    }
}
