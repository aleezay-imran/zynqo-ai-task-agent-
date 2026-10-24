import { getSessionUser } from "@/lib/auth";
import { callMcpTool } from "@/lib/mcp/client";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return Response.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (typeof body?.name !== "string" || !body.name) {
      return Response.json({ error: "MCP tool name is required" }, { status: 400 });
    }

    const text = await callMcpTool(
      request,
      body.name,
      body.arguments && typeof body.arguments === "object" ? body.arguments : {},
    );
    return Response.json({ text });
  } catch (error) {
    console.error("MCP client error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "MCP client request failed" },
      { status: 502 },
    );
  }
}
