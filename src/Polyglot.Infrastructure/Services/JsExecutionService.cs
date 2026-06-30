using System.Text;
using Jint;
using Jint.Native;
using Jint.Runtime;

namespace Polyglot.Infrastructure.Services
{
    public interface IJsExecutionService
    {
        JsExecutionResult Execute(string code, CancellationToken cancellationToken = default);
    }

    public record JsExecutionResult(bool Success, string Output, string? Error);

    public class JsExecutionService(TimeSpan? timeout = null) : IJsExecutionService
    {
        private const int MaxOutputChars = 32_768;
        private const long MemoryLimitBytes = 64 * 1024 * 1024;

        private readonly TimeSpan _timeout = timeout ?? TimeSpan.FromSeconds(5);

        public JsExecutionResult Execute(string code, CancellationToken cancellationToken = default)
        {
            var output = new StringBuilder();
            try
            {
                var engine = new Engine(options => options
                    .TimeoutInterval(_timeout)
                    .LimitMemory(MemoryLimitBytes)
                    .LimitRecursion(128)
                    .CancellationToken(cancellationToken));

                engine.SetValue("console", new ConsoleShim(output));

                var result = engine.Evaluate(code);
                if (!result.IsUndefined() && !result.IsNull())
                    Append(output, result.ToString());

                return new JsExecutionResult(true, Render(output), null);
            }
            catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
            {
                throw;
            }
            catch (JavaScriptException ex)
            {
                return new JsExecutionResult(false, Render(output), $"JavaScript error: {ex.Message}");
            }
            catch (TimeoutException)
            {
                return new JsExecutionResult(false, Render(output), $"Execution timed out after {_timeout.TotalSeconds:0.#}s.");
            }
            catch (Exception ex)
            {
                return new JsExecutionResult(false, Render(output), ex.Message);
            }
        }

        private static void Append(StringBuilder output, string text)
        {
            if (output.Length < MaxOutputChars)
                output.AppendLine(text);
        }

        private static string Render(StringBuilder output)
        {
            var text = output.ToString().TrimEnd('\r', '\n');
            return text.Length > MaxOutputChars
                ? text[..MaxOutputChars] + "\n[output truncated]"
                : text;
        }

#pragma warning disable IDE1006
        private class ConsoleShim(StringBuilder output)
        {
            public void log(params JsValue[] args) => Write(args);
            public void info(params JsValue[] args) => Write(args);
            public void warn(params JsValue[] args) => Write(args);
            public void error(params JsValue[] args) => Write(args);

            private void Write(JsValue[] args) =>
                Append(output, string.Join(" ", args.Select(argument => argument.ToString())));
        }
#pragma warning restore IDE1006
    }
}
