import { GoogleGenAI, type Content, type FunctionDeclaration } from "@google/genai";
import { getSessionUser } from "@/lib/auth";
import { callMcpTool, listMcpTools } from "@/lib/mcp/client";

const MAX_TOOL_ROUNDS = 5;

function toGeminiTools(
  tools: Array<{ name: string; description?: string; inputSchema?: Record<string, unknown> }>,
): FunctionDeclaration[] {
  return tools.map((tool) => {
    const schema = { ...(tool.inputSchema || {}) } as Record<string, unknown>;
    const properties = { ...(schema.properties || {}) } as Record<string, unknown>;
    const required = Array.isArray(schema.required) ? schema.required.filter((field) => field !== "userId") : [];
    delete properties.userId;
    return {
      name: tool.name,
      description: tool.description,
      parametersJsonSchema: {
        ...schema,
        properties,
        required,
      },
    };
  });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Authentication required" }, { status: 401 });

  try {
    const body = await request.json();
    if (typeof body?.message !== "string" || !body.message.trim()) {
      return Response.json({ error: "Please enter a message." }, { status: 400 });
    }
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return Response.json({ error: "Gemini API key is not configured." }, { status: 500 });

    const { tools } = await listMcpTools(request);
    const ai = new GoogleGenAI({ apiKey });
    const contents: Content[] = [{ role: "user", parts: [{ text: body.message.trim() }] }];
    const executions: Array<{ toolName: string; params: Record<string, unknown>; output: string }> = [];

    for (let round = 0; round < MAX_TOOL_ROUNDS; round += 1) {
      const response = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
        contents,
        config: {
          systemInstruction:
            `You are the Zynqo personal productivity agent for user ${user.email}. ` +
            "Use MCP tools for tasks, events, and documents whenever an action or lookup is requested. " +
            "Never invent tool results. Ask a concise clarification when required information is missing.",
          tools: [{ functionDeclarations: toGeminiTools(tools) }],
        },
      });
      const functionCalls = response.functionCalls;
      if (!functionCalls?.length) {
        return Response.json({
          reply: response.text || "I couldn't generate a response.",
          toolExecutions: executions,
        });
      }

      const modelContent = response.candidates?.[0]?.content;
      if (modelContent) contents.push(modelContent);
      const functionResponses = [];
      for (const call of functionCalls) {
        if (!call.name) continue;
        const args = (call.args || {}) as Record<string, unknown>;
        const output = await callMcpTool(request, call.name, args);
        executions.push({ toolName: call.name, params: args, output });
        functionResponses.push({
          functionResponse: { name: call.name, response: { result: output } },
        });
      }
      contents.push({ role: "user", parts: functionResponses });
    }

    return Response.json({ error: "The agent reached its tool execution limit." }, { status: 502 });
  } catch (error) {
    console.error("Agent error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Agent request failed" },
      { status: 500 },
    );
  }
}
