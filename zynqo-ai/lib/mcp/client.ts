import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

function createClient(request: Request) {
  const cookie = request.headers.get("cookie");
  const transport = new StreamableHTTPClientTransport(
    new URL("/mcp", request.url),
    { requestInit: { headers: cookie ? { cookie } : undefined } },
  );
  const client = new Client(
    { name: "zynqo-web-client", version: "1.0.0" },
    { capabilities: {} },
  );
  return { client, transport };
}

export async function listMcpTools(request: Request) {
  const { client, transport } = createClient(request);
  try {
    await client.connect(transport);
    return await client.listTools();
  } finally {
    await client.close().catch(() => undefined);
  }
}

export async function callMcpTool(
  request: Request,
  name: string,
  args: Record<string, unknown>,
) {
  const { client, transport } = createClient(request);

  try {
    await client.connect(transport);
    const result = (await client.callTool({ name, arguments: args })) as {
      content?: Array<{ type?: string; text?: string }>;
    };
    const text = result.content?.find((item) => item.type === "text")?.text;
    return text || "MCP operation completed.";
  } finally {
    await client.close().catch(() => undefined);
  }
}
