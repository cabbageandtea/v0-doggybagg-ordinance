#!/bin/bash

# Workflow System Validation
# Run this to verify everything is set up correctly

echo "🔍 Validating Integrated Workflow System"
echo "======================================"
echo ""

errors=0
warnings=0

# Check files exist
echo "📁 Checking files..."
files=(
  ".cursor/mcp.json"
  ".cursor/settings.json"
  ".cursor/project-context.md"
  "scripts/mcp/git-server.js"
  "scripts/mcp/vercel-server.js"
  "scripts/mcp/v0-server.js"
  "scripts/mcp/workflow-server.js"
  "scripts/workflow-cli.js"
  ".github/workflows/integrated-workflow.yml"
  "WORKFLOW_SETUP.md"
  "INTEGRATED_WORKFLOW_SUMMARY.md"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file (missing)"
    ((errors++))
  fi
done

echo ""

# Check executables
echo "🔧 Checking executable scripts..."
scripts=(
  "scripts/workflow-cli.js"
  "scripts/setup-workflow.sh"
  "scripts/mcp/git-server.js"
)

for script in "${scripts[@]}"; do
  if [ -x "$script" ]; then
    echo "  ✅ $script (executable)"
  elif [ -f "$script" ]; then
    echo "  ⚠️  $script (not executable, fixing...)"
    chmod +x "$script"
    ((warnings++))
  else
    echo "  ❌ $script (missing)"
    ((errors++))
  fi
done

echo ""

# Check environment
echo "🔐 Checking environment setup..."

if grep -q "GITHUB_TOKEN" .env.local 2>/dev/null; then
  if [ -z "${GITHUB_TOKEN}" ]; then
    echo "  ⚠️  GITHUB_TOKEN in .env.local but not exported"
    ((warnings++))
  else
    echo "  ✅ GITHUB_TOKEN set"
  fi
else
  echo "  ⚠️  GITHUB_TOKEN not in .env.local"
  ((warnings++))
fi

if grep -q "VERCEL_TOKEN" .env.local 2>/dev/null; then
  if [ -z "${VERCEL_TOKEN}" ]; then
    echo "  ⚠️  VERCEL_TOKEN in .env.local but not exported"
    ((warnings++))
  else
    echo "  ✅ VERCEL_TOKEN set"
  fi
else
  echo "  ⚠️  VERCEL_TOKEN not in .env.local"
  ((warnings++))
fi

echo ""

# Check dependencies
echo "📦 Checking dependencies..."

if grep -q "@modelcontextprotocol/sdk" package.json; then
  echo "  ✅ MCP SDK in dependencies"
else
  echo "  ⚠️  MCP SDK not in dependencies (install with: pnpm add -D @modelcontextprotocol/sdk)"
  ((warnings++))
fi

echo ""

# Check commands in package.json
echo "📋 Checking workflow scripts in package.json..."
scripts_in_pkg=(
  "workflow:setup"
  "workflow:feature"
  "workflow:hotfix"
  "workflow:release"
  "workflow:status"
)

for script in "${scripts_in_pkg[@]}"; do
  if grep -q "\"$script\"" package.json; then
    echo "  ✅ $script"
  else
    echo "  ❌ $script (missing from package.json)"
    ((errors++))
  fi
done

echo ""

# Check git setup
echo "🌳 Checking git setup..."

if git rev-parse --git-dir > /dev/null 2>&1; then
  echo "  ✅ Git repository initialized"
  
  # Check for origin
  if git config --get remote.origin.url > /dev/null; then
    echo "  ✅ Remote 'origin' configured"
  else
    echo "  ⚠️  Remote 'origin' not configured"
    ((warnings++))
  fi
else
  echo "  ❌ Not a git repository"
  ((errors++))
fi

echo ""

# Check tools
echo "🛠️  Checking required tools..."

tools=(
  "node:Node.js"
  "git:Git"
  "gh:GitHub CLI"
  "pnpm:pnpm"
)

for tool_info in "${tools[@]}"; do
  IFS=':' read -r tool name <<< "$tool_info"
  if command -v $tool &> /dev/null; then
    version=$($tool --version 2>/dev/null | head -1)
    echo "  ✅ $name ($version)"
  else
    echo "  ⚠️  $name not installed"
    ((warnings++))
  fi
done

echo ""
echo "======================================"

if [ $errors -eq 0 ] && [ $warnings -eq 0 ]; then
  echo "✨ All checks passed! System is ready."
  echo ""
  echo "Next steps:"
  echo "  1. pnpm workflow:setup"
  echo "  2. Configure .env.local with your tokens"
  echo "  3. Restart Cursor to load MCP servers"
  echo "  4. Try: pnpm workflow:status"
  exit 0
elif [ $errors -eq 0 ]; then
  echo "⚠️  System ready with $warnings warning(s)."
  echo "    Install missing tools or tokens as needed."
  exit 0
else
  echo "❌ System has $errors error(s) and $warnings warning(s)."
  echo "    Please fix errors before using workflows."
  exit 1
fi
