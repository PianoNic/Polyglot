using Microsoft.Extensions.Configuration;
using Polyglot.Infrastructure.Dtos;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace Polyglot.Infrastructure.Clients
{
    public class OpenRouterClient(IHttpClientFactory httpClientFactory, IConfiguration configuration) : IOpenRouterClient
    {
        public async Task<List<AvailableModelDto>> GetModelsAsync(CancellationToken cancellationToken = default)
        {
            var client = httpClientFactory.CreateClient();
            var response = await client.GetAsync("https://openrouter.ai/api/v1/models", cancellationToken);
            response.EnsureSuccessStatusCode();

            using var json = await JsonDocument.ParseAsync(await response.Content.ReadAsStreamAsync(cancellationToken), cancellationToken: cancellationToken);

            var models = new List<AvailableModelDto>();

            foreach (var model in json.RootElement.GetProperty("data").EnumerateArray())
            {
                var id = model.GetProperty("id").GetString()!;
                var name = model.GetProperty("name").GetString()!;
                var contextLength = model.GetProperty("context_length").GetInt32();

                var architecture = model.GetProperty("architecture");
                var inputModalities = architecture.GetProperty("input_modalities").EnumerateArray().Select(m => m.GetString()!).ToList();
                var outputModalities = architecture.GetProperty("output_modalities").EnumerateArray().Select(m => m.GetString()!).ToList();

                List<string> supportedParameters = model.TryGetProperty("supported_parameters", out var sp)
                    ? sp.EnumerateArray().Select(p => p.GetString()!).ToList()
                    : [];

                var pricing = model.GetProperty("pricing");
                var promptPrice = decimal.Parse(pricing.GetProperty("prompt").GetString() ?? "0") * 1_000_000;
                var completionPrice = decimal.Parse(pricing.GetProperty("completion").GetString() ?? "0") * 1_000_000;

                var slashIndex = id.IndexOf('/');
                var provider = slashIndex > 0 ? id[..slashIndex] : string.Empty;
                models.Add(new AvailableModelDto
                {
                    Id = id,
                    Name = name,
                    Provider = provider,
                    Currency = "USD",
                    ContextLength = contextLength,
                    InputModalities = inputModalities,
                    OutputModalities = outputModalities,
                    SupportedParameters = supportedParameters,
                    InputPricePer1M = promptPrice,
                    OutputPricePer1M = completionPrice,
                });
            }

            return models;
        }

        public async Task<GeneratedImage> GenerateImageAsync(string model, string prompt, CancellationToken cancellationToken = default)
        {
            var apiKey = configuration["OpenRouter:ApiKey"] ?? throw new InvalidOperationException("OpenRouter:ApiKey not configured");
            var client = httpClientFactory.CreateClient();

            var body = new
            {
                model,
                messages = new[] { new { role = "user", content = prompt } },
                modalities = new[] { "image", "text" }
            };

            using var request = new HttpRequestMessage(HttpMethod.Post, "https://openrouter.ai/api/v1/chat/completions")
            {
                Content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json")
            };
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

            using var response = await client.SendAsync(request, cancellationToken);
            response.EnsureSuccessStatusCode();

            using var json = await JsonDocument.ParseAsync(await response.Content.ReadAsStreamAsync(cancellationToken), cancellationToken: cancellationToken);
            var root = json.RootElement;
            var message = root.GetProperty("choices")[0].GetProperty("message");

            if (!message.TryGetProperty("images", out var images) || images.ValueKind != JsonValueKind.Array || images.GetArrayLength() == 0)
                throw new InvalidOperationException("The image model returned no image.");

            var dataUrl = images[0].GetProperty("image_url").GetProperty("url").GetString()
                ?? throw new InvalidOperationException("The image model returned an empty image URL.");

            var (data, mediaType) = ParseDataUrl(dataUrl);

            decimal cost = 0m;
            if (root.TryGetProperty("usage", out var usage)
                && usage.TryGetProperty("cost", out var costEl)
                && costEl.ValueKind == JsonValueKind.Number)
                cost = costEl.GetDecimal();

            return new GeneratedImage(data, mediaType, cost);
        }

        // Parses "data:<media-type>;base64,<payload>" into raw bytes + media type.
        private static (byte[] Data, string MediaType) ParseDataUrl(string dataUrl)
        {
            var comma = dataUrl.IndexOf(',');
            if (comma < 0 || !dataUrl.StartsWith("data:", StringComparison.OrdinalIgnoreCase))
                throw new InvalidOperationException("Unexpected image data URL format.");

            var mediaType = dataUrl[5..comma].Split(';')[0];
            if (string.IsNullOrEmpty(mediaType))
                mediaType = "image/png";

            return (Convert.FromBase64String(dataUrl[(comma + 1)..]), mediaType);
        }
    }
}
