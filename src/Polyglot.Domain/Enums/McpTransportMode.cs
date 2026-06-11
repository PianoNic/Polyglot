namespace Polyglot.Domain.Enums
{
    public enum McpTransportMode
    {
        // Probe the endpoint and pick Streamable HTTP or SSE automatically.
        Auto = 0,
        StreamableHttp = 1,
        Sse = 2
    }
}
