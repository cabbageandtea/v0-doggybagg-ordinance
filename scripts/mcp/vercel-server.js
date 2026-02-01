#!/usr/bin/env node

/**
 * MCP Server: Vercel Integration
 * Control deployments and preview environments
 * - Trigger deployments
 * - Get deployment status
 * - Generate preview links
 * - Manage environment variables
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const fetch = require('node-fetch');

const server = new Server({
  name: 'vercel-integration-mcp',
  version: '1.0.0',
});

const VERCEL_API = 'https://api.vercel.com';
const token = process.env.VERCEL_TOKEN;
const orgId = process.env.VERCEL_ORG_ID;
const projectId = process.env.VERCEL_PROJECT_ID;

async function vercelFetch(endpoint, options = {}) {
  const url = `${VERCEL_API}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!response.ok) {
    throw new Error(`Vercel API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

const tools = [
  {
    name: 'vercel_trigger_deploy',
    description: 'Trigger a new deployment on Vercel',
    inputSchema: {
      type: 'object',
      properties: {
        ref: {
          type: 'string',
          description: 'Git ref/branch to deploy',
          default: 'main',
        },
      },
    },
  },
  {
    name: 'vercel_get_deployments',
    description: 'Get list of recent deployments',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Number of deployments to fetch',
          default: 10,
        },
      },
    },
  },
  {
    name: 'vercel_get_deployment_status',
    description: 'Get status of a specific deployment',
    inputSchema: {
      type: 'object',
      properties: {
        deployment_id: {
          type: 'string',
          description: 'Deployment ID',
        },
      },
      required: ['deployment_id'],
    },
  },
  {
    name: 'vercel_get_env_vars',
    description: 'List environment variables',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'vercel_set_env_var',
    description: 'Set an environment variable',
    inputSchema: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          description: 'Variable name',
        },
        value: {
          type: 'string',
          description: 'Variable value',
        },
        target: {
          type: 'array',
          description: 'Environments (production, preview, development)',
          items: { type: 'string' },
          default: ['preview'],
        },
      },
      required: ['key', 'value'],
    },
  },
];

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request;
  let result;

  try {
    switch (name) {
      case 'vercel_trigger_deploy': {
        const { ref = 'main' } = args;
        result = await vercelFetch(`/v13/deployments?teamId=${orgId}`, {
          method: 'POST',
          body: JSON.stringify({
            name: projectId,
            gitSource: {
              ref,
              repo: projectId,
              type: 'github',
            },
          }),
        });
        return {
          content: [{ type: 'text', text: `✅ Deployment triggered:\nURL: ${result.url}\nState: ${result.state}` }],
        };
      }

      case 'vercel_get_deployments': {
        const { limit = 10 } = args;
        result = await vercelFetch(`/v6/deployments?projectId=${projectId}&teamId=${orgId}&limit=${limit}`);
        const list = result.deployments
          .map((d) => `• ${d.url} (${d.state})`)
          .join('\n');
        return {
          content: [{ type: 'text', text: `📋 Recent Deployments:\n${list}` }],
        };
      }

      case 'vercel_get_deployment_status': {
        const { deployment_id } = args;
        result = await vercelFetch(`/v13/deployments/${deployment_id}?teamId=${orgId}`);
        return {
          content: [
            {
              type: 'text',
              text: `📊 Deployment Status:\nState: ${result.state}\nURL: ${result.url}\nCreated: ${result.createdAt}`,
            },
          ],
        };
      }

      case 'vercel_get_env_vars': {
        result = await vercelFetch(`/v9/projects/${projectId}/env?teamId=${orgId}`);
        const list = result.envs.map((e) => `• ${e.key} (${e.target.join(',')})`).join('\n');
        return {
          content: [{ type: 'text', text: `🔑 Environment Variables:\n${list}` }],
        };
      }

      case 'vercel_set_env_var': {
        const { key, value, target = ['preview'] } = args;
        result = await vercelFetch(`/v10/projects/${projectId}/env?teamId=${orgId}`, {
          method: 'POST',
          body: JSON.stringify({ key, value, target }),
        });
        return {
          content: [{ type: 'text', text: `✅ Environment variable set:\n${key} = ${value}` }],
        };
      }

      default:
        return { content: [{ type: 'text', text: `Unknown tool: ${name}` }] };
    }
  } catch (error) {
    return {
      content: [{ type: 'text', text: `❌ Error: ${error.message}` }],
    };
  }
});

server.setRequestHandler(require('@modelcontextprotocol/sdk/types.js').ListToolsRequestSchema, async () => {
  return { tools };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Vercel Integration MCP Server running');
}

main().catch(console.error);
