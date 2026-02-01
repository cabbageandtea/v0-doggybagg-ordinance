# MCP Setup – GitHub, Vercel, v0, Supabase, Filesystem

Your Cursor MCP config (`~/.cursor/mcp.json`) includes **fetch**, **GitHub**, **Vercel**, **v0**, **Supabase**, and **Filesystem**. Finish setup as below.

**This repo:** [github.com/cabbageandtea/v0-doggybagg-ordinance](https://github.com/cabbageandtea/v0-doggybagg-ordinance)

---

## Official MCP links

| Resource | Link |
|----------|------|
| **Cursor MCP docs** | [docs.cursor.com/context/model-context-protocol](https://docs.cursor.com/context/model-context-protocol) |
| **Vercel MCP** | [vercel.com/docs/ai-tooling/vercel-mcp](https://vercel.com/docs/ai-tooling/vercel-mcp) |
| **v0 MCP** | [v0.dev/docs/api/platform/adapters/mcp-server](https://v0.dev/docs/api/platform/adapters/mcp-server) |
| **GitHub MCP server** | [github.com/modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) (server-github) |
| **MCP spec** | [modelcontextprotocol.io](https://modelcontextprotocol.io) |

---

## 1. GitHub MCP

**What it does:** Access `cabbageandtea/v0-doggybagg-ordinance`, search code, manage issues and PRs.

**Setup:**

1. Create a Personal Access Token: [GitHub → Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. Grant scopes: `repo`, `read:org`, `read:user`
3. Set the token **before** starting Cursor (it must be in the environment Cursor inherits):
   - **Windows (PowerShell, current session):** `$env:GITHUB_PERSONAL_ACCESS_TOKEN = "ghp_your_token"`
   - **Windows (permanent):** System Properties → Environment Variables → User variables → New → `GITHUB_PERSONAL_ACCESS_TOKEN` = your token
   - **Start Cursor from that same PowerShell** so it inherits the variable, or restart Cursor after setting system env.
4. Reload Cursor: Ctrl+Shift+P → "Developer: Reload Window"

---

## 2. Vercel MCP

**What it does:** Docs search, projects, deployments, logs (OAuth to your Vercel account).

**Setup:**

- No keys in the config. It uses **OAuth**.
- After reloading Cursor, start the **vercel** MCP server.
- When you see **“Needs login”**, click it and complete sign-in in the browser.
- One-time authorization; then it stays connected.

**Optional – project-specific URL:**  
For a single project, you can use:

`https://mcp.vercel.com/YOUR_TEAM_SLUG/YOUR_PROJECT_SLUG`

instead of `https://mcp.vercel.com` in the `url` field.

---

## 3. v0 MCP

**What it does:** Create/manage v0 chats, use v0’s code generation from Cursor.

**Setup:**

1. Get a v0 API key: [v0 → Settings → API Keys](https://v0.app/chat/settings/keys) (Premium or Team plan required).
2. Set the **environment variable** (Cursor reads from your system). In PowerShell (permanent): `[System.Environment]::SetEnvironmentVariable("V0_API_KEY", "your-actual-key", "User")`. Or use System Properties → Environment Variables → User variables → New → `V0_API_KEY`.
3. **Restart Cursor** so it inherits the new variable.

**Security:** Don’t commit `mcp.json` if it contains real tokens. Your global config is in `C:\Users\malik\.cursor\mcp.json` (outside the repo), so it won’t be committed with the project.

---

## 4. Supabase MCP

**What it does:** Query your Supabase database, inspect schema, run SQL, manage projects.

**Setup:** OAuth only—no keys in config. After reloading Cursor, start the **supabase** MCP server. When prompted, sign in to Supabase in the browser and grant access.

**Docs:** [supabase.com/docs/guides/getting-started/mcp](https://supabase.com/docs/guides/getting-started/mcp)

---

## 5. Filesystem MCP

**What it does:** Read/write files in allowed directories for the AI to operate on your workspace.

**Setup:** Already configured with `C:/Users/malik/Ordinance.a`. No auth. To add more directories, edit the `args` array in `~/.cursor/mcp.json`.

---

## Reload and verify

1. **Reload Cursor:** Ctrl+Shift+P → “Developer: Reload Window”.
2. Open **Cursor Settings → Features → MCP** (or search “MCP”).
3. Confirm **fetch**, **github**, **vercel**, **v0**, **supabase**, and **filesystem** are listed.
4. Start each server; fix any “Needs login” (Vercel) or “Invalid API key” (GitHub, v0) as above. **GitHub MCP not working?** Set `GITHUB_PERSONAL_ACCESS_TOKEN` in System Environment Variables, then restart Cursor. The **fetch** server can still get repo content via `https://raw.githubusercontent.com/cabbageandtea/v0-doggybagg-ordinance/main/README.md`.

---

## Summary

| Server  | Auth              | Where to set it                          |
|---------|-------------------|------------------------------------------|
| fetch   | None              | Ready to use                             |
| github  | PAT               | `env.GITHUB_PERSONAL_ACCESS_TOKEN` or OS env |
| vercel  | OAuth (in browser)| Click “Needs login” in Cursor            |
| v0        | API key           | `V0_API_KEY` in OS env             |
| supabase  | OAuth (in browser)| Click "Needs login" in Cursor      |
| filesystem| None              | Ready (workspace path in config)   |
