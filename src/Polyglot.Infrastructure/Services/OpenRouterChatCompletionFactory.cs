using Microsoft.Extensions.Configuration;
using Microsoft.SemanticKernel.ChatCompletion;
using Microsoft.SemanticKernel.Connectors.OpenAI;

namespace Polyglot.Infrastructure.Services;

public class OpenRouterChatCompletionFactory : IChatCompletionServiceFactory
{
    private readonly string _apiKey;
    private readonly HttpClient _httpClient;

    public OpenRouterChatCompletionFactory(IConfiguration configuration, IHttpClientFactory httpClientFactory)
    {
        _apiKey = configuration["OpenRouter:ApiKey"]
            ?? throw new InvalidOperationException("OpenRouter:ApiKey not configured");
        _httpClient = httpClientFactory.CreateClient();
        _httpClient.BaseAddress = new Uri("https://openrouter.ai/api/v1");
        if (!_httpClient.DefaultRequestHeaders.Contains("X-Title"))
            _httpClient.DefaultRequestHeaders.Add("X-Title", "Polyglot");
    }

    public IChatCompletionService Create(string modelId)
    {
        return new OpenAIChatCompletionService(modelId, _apiKey, httpClient: _httpClient);
    }
}
