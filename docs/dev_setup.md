# Polyglot - Dev Setup

## Prerequisites

- .NET 10 SDK
- Docker Desktop
- `dotnet-ef` global tool: `dotnet tool install --global dotnet-ef`

## Start the database

```bash
docker compose -f compose.dev.yml up -d
```

Postgres runs on port `3135` (mapped from container port `5432`).

## Configure secrets

All secrets live in **user secrets**.

Pick one of the two options below.

### Option 1 - CLI

```bash
cd src/Polyglot.API
dotnet user-secrets set "ConnectionStrings:PolyglotDatabase" "Host=localhost;Port=3135;Database=polyglot-dev;Username=postgres;Password=d4vpas8w0rd13!!!"
```

To verify:

```bash
dotnet user-secrets list
```

### Option 2 - Edit `secrets.json` directly

In Visual Studio: right-click the `Polyglot.API` project → **Manage User Secrets**.

Paste in:

```json
{
  "ConnectionStrings": {
    "PolyglotDatabase": "Host=localhost;Port=3135;Database=polyglot-dev;Username=postgres;Password=d4vpas8w0rd13!!!"
  }
}
```

## Run the API

```bash
cd src/Polyglot.API
dotnet run
```

Migrations are applied automatically on startup. Swagger is at `/swagger`.

## Migrations

From the `scripts/` folder:

| Command | What it does |
|---|---|
| `migration add <Name>` | Create a new migration |
| `migration update` | Apply pending migrations |
| `migration list` | List all migrations |
| `migration remove` | Remove the last (unapplied) migration |
| `migration drop` | Drop the database |

Windows uses `migration.bat`, Linux/Mac use `./migration.sh`.

## Stop & reset

```bash
docker compose -f compose.dev.yml down          # stop, keep data
docker compose -f compose.dev.yml down -v       # stop, wipe data
```