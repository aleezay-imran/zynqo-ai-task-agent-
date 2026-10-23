// MCP Server Route - Model Context Protocol HTTP endpoint at /mcp
import { toolDefinitions } from "@/lib/mcp/tools";
import {
  createTaskSchema,
  updateTaskSchema,
  listTasksSchema,
  deleteTaskSchema,
  createEventSchema,
  listEventsSchema,
  createDocumentSchema,
  searchDocumentsSchema,
} from "@/lib/mcp/tools";
import {
  handleCreateTask,
  handleUpdateTask,
  handleListTasks,
  handleDeleteTask,
  handleCreateEvent,
  handleListEvents,
  handleCreateDocument,
  handleSearchDocuments,
} from "@/lib/mcp/handlers";

// HTTP POST handler for MCP endpoint
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Handle MCP protocol methods
    if (body.method === "initialize") {
      return Response.json({
        jsonrpc: "2.0",
        id: body.id,
        result: {
          protocolVersion: "0.1.0",
          serverInfo: {
            name: "zynqo-mcp-server",
            version: "1.0.0",
          },
          capabilities: {
            tools: {},
          },
        },
      });
    }

    if (body.method === "tools/list") {
      return Response.json({
        jsonrpc: "2.0",
        id: body.id,
        result: { tools: toolDefinitions },
      });
    }

    if (body.method === "tools/call") {
      const { name, arguments: args } = body.params;

      let result;
      switch (name) {
        case "create-task":
          result = await handleCreateTask(createTaskSchema.parse(args));
          break;
        case "update-task":
          result = await handleUpdateTask(updateTaskSchema.parse(args));
          break;
        case "list-tasks":
          result = await handleListTasks(listTasksSchema.parse(args));
          break;
        case "delete-task":
          result = await handleDeleteTask(deleteTaskSchema.parse(args));
          break;
        case "create-event":
          result = await handleCreateEvent(createEventSchema.parse(args));
          break;
        case "list-events":
          result = await handleListEvents(listEventsSchema.parse(args));
          break;
        case "create-document":
          result = await handleCreateDocument(createDocumentSchema.parse(args));
          break;
        case "search-documents":
          result = await handleSearchDocuments(searchDocumentsSchema.parse(args));
          break;
        default:
          return Response.json({
            jsonrpc: "2.0",
            id: body.id,
            error: {
              code: -32601,
              message: `Unknown tool: ${name}`,
            },
          });
      }

      return Response.json({
        jsonrpc: "2.0",
        id: body.id,
        result: {
          content: [result],
        },
      });
    }

    return Response.json({
      jsonrpc: "2.0",
      id: body.id,
      error: {
        code: -32601,
        message: "Method not found",
      },
    });
  } catch (error) {
    console.error("MCP Error:", error);
    return Response.json({
      jsonrpc: "2.0",
      id: null,
      error: {
        code: -32603,
        message: error instanceof Error ? error.message : "Internal error",
      },
    });
  }
}
