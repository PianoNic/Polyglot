using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Polyglot.Domain;
using Polyglot.Infrastructure.Clients;

namespace Polyglot.Infrastructure.Services
{
    public class ModelSyncService(IServiceProvider services, ILogger<ModelSyncService> logger) : BackgroundService
    {
        private static readonly TimeSpan Interval = TimeSpan.FromHours(12);

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            logger.LogInformation("Model Sync Service running.");

            await SyncAsync(stoppingToken);

            using PeriodicTimer timer = new(Interval);

            try
            {
                while (await timer.WaitForNextTickAsync(stoppingToken))
                {
                    await SyncAsync(stoppingToken);
                }
            }
            catch (OperationCanceledException)
            {
                logger.LogInformation("Model Sync Service is stopping.");
            }
        }

        private async Task SyncAsync(CancellationToken cancellationToken)
        {
            try
            {
                using (var scope = services.CreateScope())
                {
                    var openRouter =
                        scope.ServiceProvider
                            .GetRequiredService<IOpenRouterClient>();
                    var dbContext =
                        scope.ServiceProvider
                            .GetRequiredService<PolyglotDbContext>();

                    var fetched = await openRouter.GetModelsAsync(cancellationToken);
                    var existing = await dbContext.Models.ToListAsync(cancellationToken);
                    var existingByModelId = existing.ToDictionary(model => model.ModelId);
                    var fetchedIds = fetched.Select(fetchedModel => fetchedModel.Id).ToHashSet();

                    foreach (var fetchedModel in fetched)
                    {
                        if (existingByModelId.TryGetValue(fetchedModel.Id, out var row))
                        {
                            row.Name = fetchedModel.Name;
                            row.ContextLength = fetchedModel.ContextLength;
                            row.InputModalities = fetchedModel.InputModalities;
                            row.OutputModalities = fetchedModel.OutputModalities;
                            row.SupportedParameters = fetchedModel.SupportedParameters;
                            row.PromptPricePerMillion = fetchedModel.InputPricePer1M;
                            row.CompletionPricePerMillion = fetchedModel.OutputPricePer1M;
                        }
                        else
                        {
                            dbContext.Models.Add(new Model
                            {
                                ModelId = fetchedModel.Id,
                                Name = fetchedModel.Name,
                                ContextLength = fetchedModel.ContextLength,
                                InputModalities = fetchedModel.InputModalities,
                                OutputModalities = fetchedModel.OutputModalities,
                                SupportedParameters = fetchedModel.SupportedParameters,
                                PromptPricePerMillion = fetchedModel.InputPricePer1M,
                                CompletionPricePerMillion = fetchedModel.OutputPricePer1M,
                            });
                        }
                    }

                    foreach (var row in existing.Where(model => !fetchedIds.Contains(model.ModelId)))
                    {
                        dbContext.Models.Remove(row);
                    }

                    await dbContext.SaveChangesAsync(cancellationToken);

                    logger.LogInformation("Model sync complete: {Count} models from OpenRouter", fetched.Count);
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Model sync failed");
            }
        }
    }
}