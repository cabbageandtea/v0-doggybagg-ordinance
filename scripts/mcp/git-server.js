#!/usr/bin/env node

/**
 * MCP Server: Git Operations
 * Provides AI-controlled git operations through Cursor
 * - Create/switch branches
 * - Commit with auto-messages
 * - Create PRs
 * - Manage tags
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, TextContent, Tool } = require('@modelcontextprotocol/sdk/types.js');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const server = new Server({
  name: 'git-operations-mcp',
  version: '1.0.0',
});

// Helper: Execute git commands
function gitExec(command) {
  try {
    return execSync(`git ${command}`, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch (error) {
    throw new Error(`Git error: ${error.message}`);
  }
}

// Tool definitions
const tools = [
  {
    name: 'git_create_branch',
    description: 'Create and checkout a new feature branch',
    inputSchema: {
      type: 'object',
      properties: {
        branch_name: {
          type: 'string',
          description: 'Branch name (e.g., feature/auth-redesign, fix/bug-123)',
        },
        from_branch: {
          type: 'string',
          description: 'Base branch (default: main)',
          default: 'main',
        },
      },
      required: ['branch_name'],
    },
  },
  {
    name: 'git_commit',
    description: 'Stage changes and commit with AI-generated or custom message',
    inputSchema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'Commit message',
        },
        files: {
          type: 'array',
          description: 'Specific files to commit (if empty, commits all staged)',
          items: { type: 'string' },
        },
        auto_stage: {
          type: 'boolean',
          description: 'Auto-stage all changes',
          default: true,
        },
      },
      required: ['message'],
    },
  },
  {
    name: 'git_create_pr',
    description: 'Create a pull request on GitHub',
    inputSchema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'PR title',
        },
        description: {
          type: 'string',
          description: 'PR description/body',
        },
        target_branch: {
          type: 'string',
          description: 'Target branch (default: main)',
          default: 'main',
        },
      },
      required: ['title'],
    },
  },
  {
    name: 'git_status',
    description: 'Get current git status and branch info',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'git_diff',
    description: 'Get diff of changes',
    inputSchema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          description: 'Specific file to diff (optional)',
        },
        staged: {
          type: 'boolean',
          description: 'Show staged changes only',
          default: false,
        },
      },
    },
  },
];

// Tool handlers
async function handleGitCreateBranch(args) {
  try {
    const { branch_name, from_branch = 'main' } = args;
    gitExec(`fetch origin ${from_branch}`);
    gitExec(`checkout -b ${branch_name} origin/${from_branch}`);
    return `✅ Created and checked out branch: ${branch_name}`;
  } catch (error) {
    return `❌ Error: ${error.message}`;
  }
}

async function handleGitCommit(args) {
  try {
    const { message, files = [], auto_stage = true } = args;
    
    if (auto_stage && files.length === 0) {
      gitExec('add -A');
    } else if (files.length > 0) {
      gitExec(`add ${files.join(' ')}`);
    }
    
    gitExec(`commit -m "${message}"`);
    return `✅ Committed: ${message}`;
  } catch (error) {
    return `❌ Error: ${error.message}`;
  }
}

async function handleGitCreatePR(args) {
  try {
    const { title, description = '', target_branch = 'main' } = args;
    const current_branch = gitExec('rev-parse --abbrev-ref HEAD');
    
    // Push branch
    gitExec(`push -u origin ${current_branch}`);
    
    // Create PR using gh CLI
    const gh_cmd = `gh pr create --title "${title}" --body "${description}" --base ${target_branch} --head ${current_branch}`;
    const result = execSync(gh_cmd, { encoding: 'utf-8' });
    
    return `✅ PR Created:\n${result}`;
  } catch (error) {
    return `❌ Error: ${error.message}`;
  }
}

async function handleGitStatus(_args) {
  try {
    const branch = gitExec('rev-parse --abbrev-ref HEAD');
    const status = gitExec('status --short');
    const logs = gitExec('log --oneline -5');
    
    return `📊 Git Status:\n\nBranch: ${branch}\n\nChanges:\n${status || '(no changes)'}\n\nRecent commits:\n${logs}`;
  } catch (error) {
    return `❌ Error: ${error.message}`;
  }
}

async function handleGitDiff(args) {
  try {
    const { file = '', staged = false } = args;
    const flag = staged ? '--staged' : '';
    const target = file ? ` ${file}` : '';
    const diff = gitExec(`diff ${flag}${target}`);
    return `📝 Diff:\n\`\`\`\n${diff}\n\`\`\``;
  } catch (error) {
    return `❌ Error: ${error.message}`;
  }
}

// Register tools
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request;

  let result;
  switch (name) {
    case 'git_create_branch':
      result = await handleGitCreateBranch(args);
      break;
    case 'git_commit':
      result = await handleGitCommit(args);
      break;
    case 'git_create_pr':
      result = await handleGitCreatePR(args);
      break;
    case 'git_status':
      result = await handleGitStatus(args);
      break;
    case 'git_diff':
      result = await handleGitDiff(args);
      break;
    default:
      result = `Unknown tool: ${name}`;
  }

  return {
    content: [
      {
        type: 'text',
        text: result,
      },
    ],
  };
});

// Expose tools
server.setRequestHandler(require('@modelcontextprotocol/sdk/types.js').ListToolsRequestSchema, async () => {
  return { tools };
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Git Operations MCP Server running');
}

main().catch(console.error);
