#!/usr/bin/env node

/**
 * MCP Server: V0 Integration
 * Generate and integrate components from V0
 * - Generate components from descriptions
 * - List available generated components
 * - Export components to project
 * - Manage component versions
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const server = new Server({
  name: 'v0-integration-mcp',
  version: '1.0.0',
});

const V0_API = 'https://api.v0.dev';
const apiKey = process.env.V0_API_KEY;
const workspaceId = process.env.V0_WORKSPACE_ID;

async function v0Fetch(endpoint, options = {}) {
  const url = `${V0_API}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!response.ok) {
    throw new Error(`V0 API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

const tools = [
  {
    name: 'v0_generate_component',
    description: 'Generate a React component from a description',
    inputSchema: {
      type: 'object',
      properties: {
        description: {
          type: 'string',
          description: 'Component description and requirements',
        },
        component_name: {
          type: 'string',
          description: 'Name for the generated component',
        },
        ui_framework: {
          type: 'string',
          description: 'UI framework (shadcn, radix)',
          default: 'shadcn',
        },
      },
      required: ['description', 'component_name'],
    },
  },
  {
    name: 'v0_list_components',
    description: 'List all generated components in workspace',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'v0_export_component',
    description: 'Export a V0 component to local project',
    inputSchema: {
      type: 'object',
      properties: {
        component_id: {
          type: 'string',
          description: 'V0 component ID',
        },
        output_path: {
          type: 'string',
          description: 'Local path to export to',
          default: 'components/generated',
        },
      },
      required: ['component_id'],
    },
  },
  {
    name: 'v0_get_component_code',
    description: 'Get raw code of a generated component',
    inputSchema: {
      type: 'object',
      properties: {
        component_id: {
          type: 'string',
          description: 'V0 component ID',
        },
      },
      required: ['component_id'],
    },
  },
];

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request;
  let result;

  try {
    switch (name) {
      case 'v0_generate_component': {
        const { description, component_name, ui_framework = 'shadcn' } = args;
        result = await v0Fetch(`/workspaces/${workspaceId}/components`, {
          method: 'POST',
          body: JSON.stringify({
            description,
            name: component_name,
            framework: ui_framework,
          }),
        });
        return {
          content: [
            {
              type: 'text',
              text: `✅ Component generated:\n• ID: ${result.id}\n• Name: ${result.name}\n• Status: ${result.status}\n• Preview: ${result.preview_url}`,
            },
          ],
        };
      }

      case 'v0_list_components': {
        result = await v0Fetch(`/workspaces/${workspaceId}/components`);
        const list = result.components
          .map((c) => `• ${c.name} (${c.id}) - ${c.status}`)
          .join('\n');
        return {
          content: [{ type: 'text', text: `📦 Generated Components:\n${list}` }],
        };
      }

      case 'v0_export_component': {
        const { component_id, output_path = 'components/generated' } = args;
        result = await v0Fetch(`/workspaces/${workspaceId}/components/${component_id}/export`, {
          method: 'POST',
          body: JSON.stringify({ format: 'tsx' }),
        });

        const fullPath = path.join(process.cwd(), output_path, `${result.name}.tsx`);
        fs.mkdirSync(path.dirname(fullPath), { recursive: true });
        fs.writeFileSync(fullPath, result.code);

        return {
          content: [
            {
              type: 'text',
              text: `✅ Component exported:\n• Path: ${fullPath}\n• Imports: ${result.imports.join(', ')}`,
            },
          ],
        };
      }

      case 'v0_get_component_code': {
        const { component_id } = args;
        result = await v0Fetch(`/workspaces/${workspaceId}/components/${component_id}/code`);
        return {
          content: [{ type: 'text', text: `📝 Component Code:\n\`\`\`tsx\n${result.code}\n\`\`\`` }],
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
  console.error('V0 Integration MCP Server running');
}

main().catch(console.error);
