#!/bin/bash

# Integrated Workflow Setup Script
# Run this once to configure everything

set -e

echo "🚀 Setting up Integrated Workflow System..."
echo ""

# Check requirements
echo "✓ Checking requirements..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

if ! command -v git &> /dev/null; then
    echo "❌ Git not found. Please install Git"
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm not found. Installing..."
    npm install -g pnpm
fi

if ! command -v gh &> /dev/null; then
    echo "⚠️  GitHub CLI (gh) not found. Install from: https://cli.github.com"
fi

echo "✓ Requirements met"
echo ""

# Install dependencies
echo "📦 Installing MCP dependencies..."
pnpm add -D @modelcontextprotocol/sdk
echo "✓ Dependencies installed"
echo ""

# Make scripts executable
echo "🔧 Setting up scripts..."
chmod +x scripts/workflow-cli.js
chmod +x scripts/mcp/git-server.js
chmod +x scripts/mcp/vercel-server.js
chmod +x scripts/mcp/v0-server.js
chmod +x scripts/mcp/workflow-server.js
echo "✓ Scripts ready"
echo ""

# Create .env.local template if needed
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local template..."
    cat > .env.local << 'EOF'
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Stripe
STRIPE_SECRET_KEY=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Workflow Integration (Optional)
GITHUB_TOKEN=ghp_...
VERCEL_TOKEN=...
VERCEL_ORG_ID=...
VERCEL_PROJECT_ID=...
V0_API_KEY=...
V0_WORKSPACE_ID=...
EOF
    echo "✓ Created .env.local"
    echo "  → Update with your actual tokens"
    echo ""
fi

# Summary
echo "✨ Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Set environment variables:"
echo "   Edit .env.local with your tokens"
echo ""
echo "2. Enable MCP in Cursor:"
echo "   The .cursor/mcp.json file is ready"
echo "   Restart Cursor to load MCP servers"
echo ""
echo "3. Try a workflow:"
echo "   node scripts/workflow-cli.js feature"
echo "   node scripts/workflow-cli.js status"
echo ""
echo "4. Read the documentation:"
echo "   cat WORKFLOW_SETUP.md"
echo "   cat .cursor/project-context.md"
echo ""
echo "📚 Available Commands:"
echo "   node scripts/workflow-cli.js feature   - Create component feature"
echo "   node scripts/workflow-cli.js hotfix    - Quick bug fix workflow"
echo "   node scripts/workflow-cli.js release   - Create release"
echo "   node scripts/workflow-cli.js status    - Check git status"
echo ""
echo "🎯 In Cursor, you can now:"
echo "   - Use git_create_branch to create branches"
echo "   - Use v0_generate_component to make components"
echo "   - Use vercel_trigger_deploy to deploy"
echo "   - Run full workflows with workflow_component_feature"
echo ""
echo "Happy coding! 🚀"
