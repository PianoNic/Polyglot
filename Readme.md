# <p align="center">Polyglot</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/PianoNic/Polyglot/main/assets/icon.svg" width="120" alt="Polyglot logo">
</p>

<p align="center">
  <strong>Self-hostable AI chat: many models, one balance of credits.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/backend-.NET%2010-white" alt=".NET 10"/>
  <img src="https://img.shields.io/badge/frontend-Angular%2021-white" alt="Angular 21"/>
</p>

## About

Polyglot talks to any model through OpenRouter, meters usage in credits, and lets models call tools: run JavaScript, generate images, and reach remote MCP servers.

## Features

- Any OpenRouter model, with per-model access control
- Credit-based billing (Stripe) instead of raw token costs
- Tool calling: JavaScript runner, image generation, and remote MCP servers
- Keycloak (OIDC) authentication
- Angular 21 UI built on [ngx-prompt-kit](https://github.com/PianoNic/ngx-prompt-kit)

## Quick start

```bash
docker compose -f compose.dev.yml up -d      # Postgres + Keycloak
dotnet run --project src/Polyglot.API         # backend  -> :5246
cd src/Polyglot.Frontend && bun run start     # frontend -> :4200
```

Add your OpenRouter key first (in `src/Polyglot.API`):

```bash
dotnet user-secrets set "OpenRouter:ApiKey" "sk-or-..."
```

Full setup (secrets, Keycloak, migrations): see [docs/dev_setup.md](docs/dev_setup.md).

## License

Proprietary. See [LICENSE](LICENSE).

<p align="center">Made by <a href="https://github.com/PianoNic">PianoNic</a></p>
