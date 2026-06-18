namespace Polyglot.Domain
{
    public class UserPreferences
    {
        // OpenRouter model id used by the built-in image-generation tool.
        // Null falls back to the server's configured default image model.
        public string? PreferredImageModel { get; set; }
    }
}
