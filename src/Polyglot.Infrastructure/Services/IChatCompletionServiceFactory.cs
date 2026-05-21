using Microsoft.SemanticKernel.ChatCompletion;

namespace Polyglot.Infrastructure.Services;

public interface IChatCompletionServiceFactory
{
    IChatCompletionService Create(string modelId);
}
