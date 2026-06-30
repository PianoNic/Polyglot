using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi;

namespace Polyglot.API.Extensions
{
    public static class OpenApiExtensions
    {
        public static IServiceCollection AddOpenApiDocumentation(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddSwaggerGen(options =>
            {
                var authority = configuration["Oidc:Authority"]
                    ?? throw new InvalidOperationException("Oidc:Authority not configured");

                options.SupportNonNullableReferenceTypes();

                options.AddSecurityDefinition("OpenIdConnect", new OpenApiSecurityScheme
                {
                    Type = SecuritySchemeType.OpenIdConnect,
                    OpenIdConnectUrl = new Uri($"{authority}/.well-known/openid-configuration"),
                });

                options.AddSecurityRequirement(document => new OpenApiSecurityRequirement
                {
                    [new OpenApiSecuritySchemeReference("OpenIdConnect", document)] = new List<string>()
                });
            });

            return services;
        }

        public static WebApplication UseOpenApiDocumentation(this WebApplication app, IConfiguration configuration)
        {
            if (!app.Environment.IsDevelopment())
                return app;

            app.UseSwagger();
            app.UseSwaggerUI(options =>
            {
                options.OAuthClientId(configuration["Oidc:ClientId"]);
                options.OAuthUsePkce();
            });

            return app;
        }
    }
}
