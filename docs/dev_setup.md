# Polyglot — Development Environment Setup

This is the **single, complete guide** to running Polyglot locally. Follow the
steps top to bottom and you'll have the backend, frontend, database, and auth
running. Each step says what it does and how to verify it worked.

---

## 1. Prerequisites

Install these once. Versions are what the project is built and tested against.

| Tool | Version | Needed for | Install |
|------|---------|-----------|---------|
| **.NET SDK** | 10.0.x | Building & running the API | <https://dotnet.microsoft.com/download/dotnet/10.0> |
| **Docker** (with Compose) | recent | Postgres + Keycloak containers | <https://docs.docker.com/get-docker/> |
| **Bun** | 1.3.5 | Frontend package manager & scripts | <https://bun.sh> |
| **Java (JRE)** | 11+ | Only for regenerating the API client (`bun run apigen`) | <https://adoptium.net> |
| **dotnet-ef** | 10.x | Only for creating/applying DB migrations by hand | `dotnet tool install --global dotnet-ef` |

> The API applies database migrations automatically on startup, so you only need
> `dotnet-ef` if you change the data model. Java is only required when you
> regenerate the typed API client after backend API changes.

---

## 2. What runs where

| Service | URL | Started by | Notes |
|---------|-----|-----------|-------|
| **Postgres** | `localhost:3135` | Docker | db `polyglot-dev`, user `postgres` |
| **Keycloak** (OIDC) | `localhost:8080` | Docker | realm `polyglot` imported on first start |
| **API** | `localhost:5246` | `dotnet run` | Swagger at `/swagger` |
| **Frontend** | `localhost:4200` | `bun run start` | Angular dev server |

---

## 3. Start the infrastructure (Postgres + Keycloak)

From the repository root:

```bash
docker compose -f compose.dev.yml up -d
```

This starts **two** containers:

- **Postgres** on port `3135`
- **Keycloak** on port `8080`, with the `polyglot` realm, client, and roles
  imported automatically from `keycloak/polyglot-realm.json`.

> **First run takes a few minutes**: Compose builds a custom Keycloak image
> (custom login theme + password blacklist) and Keycloak needs ~30s to start.
> It's ready once the admin console at <http://localhost:8080> loads.

---

## 4. Configure backend secrets

All secrets live in **.NET user secrets** (never committed). The API will not
start unless the connection string, OIDC, CORS, and OpenRouter key are set.

Get a (free) OpenRouter API key at <https://openrouter.ai/keys>.

```bash
cd src/Polyglot.API

dotnet user-secrets set "ConnectionStrings:PolyglotDatabase" "Host=localhost;Port=3135;Database=polyglot-dev;Username=postgres;Password=d4vpas8w0rd13!!!"

dotnet user-secrets set "Oidc:Authority" "http://localhost:8080/realms/polyglot"
dotnet user-secrets set "Oidc:RequireHttpsMetadata" "false"
dotnet user-secrets set "Oidc:ClientId" "polyglot"
dotnet user-secrets set "Oidc:RedirectUri" "http://localhost:4200/"
dotnet user-secrets set "Oidc:PostLogoutRedirectUri" "http://localhost:4200"
dotnet user-secrets set "Oidc:Scope" "openid profile email roles"

dotnet user-secrets set "Cors:AllowedOrigins:0" "http://localhost:4200"

dotnet user-secrets set "OpenRouter:ApiKey" "<your-openrouter-api-key>"
```

That's every secret the app needs for local development. Other settings
(database backups to S3/RustFS via `Backup:*`, the chat-title model via
`Chat:TitleModel`) are **optional** — backups are disabled by default and the
rest have sensible defaults, so you don't need to set them to run locally.

**Verify:**

```bash
dotnet user-secrets list
```

> Prefer editing JSON? In Visual Studio / Rider, right-click the `Polyglot.API`
> project → **Manage User Secrets**, and paste the equivalent JSON.

---

## 5. Run the backend

```bash
cd src/Polyglot.API
dotnet run
```

- Database migrations are applied automatically on startup.
- The API listens on `http://localhost:5246`.
- It's running once the Swagger UI loads at <http://localhost:5246/swagger>.

Leave this running and open a new terminal for the frontend.

---

## 6. Run the frontend

```bash
cd src/Polyglot.Frontend
bun install
bun run start
```

Open <http://localhost:4200>. The app reads its OIDC settings from the API
(`/api/App`) and the typed API client is already committed, so no code
generation is needed for a normal run.

---

## 7. Create your account

The `polyglot` realm ships with **no users** and **open registration**:

1. Visit <http://localhost:4200> — you'll be redirected to Keycloak.
2. Click **Register** and create an account.
3. You're redirected back, signed in, and given the starting credit balance.

### Make a user an admin (optional)

To access the admin area, grant the `admin` realm role:

1. Open the Keycloak admin console: <http://localhost:8080/admin>
   (master admin login: `admin` / `admin`).
2. Switch the realm dropdown (top-left) from `master` to **`polyglot`**.
3. **Users** → pick your user → **Role mapping** → **Assign role** →
   select **`admin`**.
4. Sign out and back in so the new role is in your token.

---

## 8. Regenerate the API client (only after backend API changes)

The frontend's typed client under `src/Polyglot.Frontend/src/app/api` is
generated from the backend's OpenAPI document — **never edit it by hand**.

To regenerate after you change controllers/DTOs:

1. Make sure the **backend is running** (step 5) — the generator reads
   `http://localhost:5246/swagger/v1/swagger.json`.
2. Ensure **Java** is installed (the generator is a Java tool).
3. Run:

   ```bash
   cd src/Polyglot.Frontend
   bun run apigen
   ```

---

## 9. Database migrations

Schema changes use EF Core migrations. Run these from the `scripts/` folder
(`migration.sh` on Linux/macOS, `migration.bat` on Windows):

| Command | What it does |
|---------|--------------|
| `migration add <Name>` | Create a new migration |
| `migration update` | Apply pending migrations |
| `migration list` | List all migrations |
| `migration remove` | Remove the last (unapplied) migration |
| `migration drop --confirm` | Drop the database |

The running API already applies migrations on startup; these are for authoring.

---

## 10. Stop & reset

```bash
docker compose -f compose.dev.yml down       # stop, keep data
docker compose -f compose.dev.yml down -v     # stop and wipe all data
```

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| **API exits immediately on start** | A required secret is missing. Re-check step 4 — `OpenRouter:ApiKey`, `Oidc:Authority`, `Cors:AllowedOrigins:0`, and the connection string are all mandatory. |
| **Login page never appears / `/api/App` fails** | Keycloak isn't up yet, or `Oidc:Authority` is wrong. Confirm step 3's verify command succeeds. |
| **Keycloak fails with "Password blacklist rockyou.txt not found"** | You're running a plain Keycloak image instead of the project's. Use `docker compose -f compose.dev.yml up -d`, which builds the correct image. |
| **`bun run apigen` fails** | The backend must be running on `:5246` and Java must be installed. |
| **Port already in use** (3135 / 8080 / 5246 / 4200) | Stop the conflicting process or change the port (compose file for containers, `ASPNETCORE_URLS` for the API). |
| **Can't reach the admin area after assigning the `admin` role** | Sign out and back in so the refreshed token carries the role. |
