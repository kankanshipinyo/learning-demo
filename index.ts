import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { randomUUID } from "node:crypto";
import { appendFile } from "node:fs/promises";
import { join } from "node:path";
import { z } from "zod";

const server = new McpServer({
  name: "mcp-demo-server",
  version: "0.1.0"
});

server.tool(
  "add",
  "Add two numbers together.",
  {
    a: z.number().describe("The first number."),
    b: z.number().describe("The second number.")
  },
  async ({ a, b }) => ({
    content: [
      {
        type: "text",
        text: `${a} + ${b} = ${a + b}`
      }
    ]
  })
);

server.tool(
  "current_time",
  "Get the current server time as an ISO timestamp.",
  {},
  async () => ({
    content: [
      {
        type: "text",
        text: new Date().toISOString()
      }
    ]
  })
);

server.tool(
  "proof_of_call",
  "Return a proof that this MCP server was actually called, and append it to a local log file.",
  {
    note: z.string().optional().describe("Optional note to include in the proof log.")
  },
  async ({ note }) => {
    const proof = {
      source: "mcp-demo-server",
      pid: process.pid,
      cwd: process.cwd(),
      timestamp: new Date().toISOString(),
      nonce: randomUUID(),
      note: note ?? null
    };

    await appendFile(
      join(process.cwd(), "mcp-demo-calls.log"),
      `${JSON.stringify(proof)}\n`,
      "utf8"
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(proof, null, 2)
        }
      ]
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
