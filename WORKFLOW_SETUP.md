# Workflow Setup Guide

## Overview

This guide explains how to set up and use the integrated workflow system for Git, Vercel, V0, and Cursor.

## Quick Start

### 1. Install Dependencies

The MCP servers are Node-based and require the following packages to be installed:

```bash
pnpm add -D @modelcontextprotocol/sdk
```

### 2. Set Environment Variables

Create `.env.local` with the required tokens:

```env
# GitHub
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx

# Vercel
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id

# V0 (optional)
V0_API_KEY=your_v0_api_key
V0_WORKSPACE_ID=your_workspace_id
```

### 3. Start Cursor with MCP

In Cursor, enable MCP servers from `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "git-operations": { ... },
    "vercel-integration": { ... },
    "v0-integration": { ... },
    "workflow-orchestrator": { ... }
  }
}
```

## Workflows

### 📦 Component Feature Workflow

**Use when:** Adding a new component/feature to the project

**Steps:**
1. Ask Cursor: "Run the component feature workflow for [component name]"
2. Cursor will:
   - Create feature branch
   - Use V0 to generate component
   - Commit to git
   - Create PR on GitHub
   - Trigger Vercel preview

**Time saved:** ~5 min → ~1 min

### 🚑 Hotfix Workflow

**Use when:** Fixing urgent bugs

**Steps:**
```bash
node scripts/workflow-cli.js hotfix
```

1. Creates hotfix branch (`fix/BUG-123`)
2. You apply the fix in Cursor
3. Auto-runs tests
4. Creates PR
5. Auto-deploys preview

**Manual steps remain for actual fix application, but all git/deploy steps are automated.**

### 📦 Release Workflow

**Use when:** Publishing a new version

**Steps:**
```bash
node scripts/workflow-cli.js release
```

1. Creates release branch
2. Updates `package.json` version
3. Builds for production
4. Creates git tag
5. Creates PR and deploys to production

### 🔄 Quick Status Check

```bash
node scripts/workflow-cli.js status
```

Shows current branch, changes, and recent commits.

## MCP Servers Reference

### Git Operations Server

Available tools:
- `git_create_branch` - Create feature branch
- `git_commit` - Commit changes
- `git_create_pr` - Create pull request
- `git_status` - Check status
- `git_diff` - View diffs

### Vercel Integration Server

Available tools:
- `vercel_trigger_deploy` - Trigger deployment
- `vercel_get_deployments` - List deployments
- `vercel_get_deployment_status` - Check deployment status
- `vercel_get_env_vars` - List environment variables
- `vercel_set_env_var` - Set environment variable

### V0 Integration Server

Available tools:
- `v0_generate_component` - Generate component from description
- `v0_list_components` - List all components
- `v0_export_component` - Export component to project
- `v0_get_component_code` - Get component source code

### Workflow Orchestrator

Available tools:
- `workflow_component_feature` - Full feature workflow
- `workflow_bugfix_deploy` - Hotfix workflow
- `workflow_release` - Release workflow

## Using with Cursor

### In Cursor Chat:

**Generate a component:**
```
Generate a new authentication form component using the v0_generate_component tool.
Description: "Email/password login form with validation and error handling"
Name: "AuthForm"
```

**Create a feature:**
```
Use the workflow_component_feature workflow to create a new dashboard widget.
Description: "Widget showing property risk levels"
Component name: "RiskWidget"
Feature branch: "feat/risk-widget"
```

**Quick hotfix:**
```
Start a hotfix workflow for issue BUG-456:
Description: "Fix memory leak in auth service"
```

## GitHub Actions Integration

Automated pipelines run on:
- **Push to main:** Run tests → Deploy to production
- **Pull request:** Run tests → Deploy preview
- **Pre-deploy:** Health checks and performance monitoring

All steps are automatic after code is merged.

## Common Commands

```bash
# Run a workflow
node scripts/workflow-cli.js feature
node scripts/workflow-cli.js hotfix
node scripts/workflow-cli.js release
node scripts/workflow-cli.js status

# Git operations (via AI)
git_create_branch "feat/my-feature"
git_commit "feat: add new feature"
git_create_pr "Feature Title" "Description"

# Vercel (via AI)
vercel_trigger_deploy
vercel_get_deployments
vercel_set_env_var "KEY" "value"
```

## Troubleshooting

### MCP Servers not connecting

1. Check environment variables are set
2. Verify GitHub token has repo access
3. Ensure Vercel token is valid
4. Try restarting Cursor

### Build fails on deploy

1. Check GitHub Actions logs
2. Run `pnpm build` locally to debug
3. Fix and push again

### PR doesn't auto-deploy

1. Verify Vercel integration is connected
2. Check GitHub Actions workflow runs
3. Look at Vercel deployment logs

### Tests failing

1. Run `pnpm test` locally
2. Debug test output
3. Push fix and re-run workflow

## Tips

1. **Always create a branch** - Use git_create_branch or feature workflow
2. **Test locally first** - Run `pnpm test` before pushing
3. **Use descriptive commit messages** - Easier to review and understand
4. **Check PR preview** - Verify changes work before merging
5. **Review workflows** - Monitor GitHub Actions runs

## Next Steps

1. Set up environment variables
2. Install MCP dependencies
3. Enable MCP in Cursor settings
4. Try a feature workflow
5. Monitor GitHub Actions

---

For more details, see:
- [.cursor/project-context.md](.cursor/project-context.md)
- [.cursor/settings.json](.cursor/settings.json)
- [.github/workflows/integrated-workflow.yml](.github/workflows/integrated-workflow.yml)
