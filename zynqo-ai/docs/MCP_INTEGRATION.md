# Model Context Protocol (MCP) Integration Guide

## What is MCP?

Model Context Protocol is Anthropic's open standard that enables AI models to securely interact with external data sources and tools. It creates a standardized way for AI assistants to:

- Access external data (files, databases, APIs)
- Execute actions (create tasks, send emails, schedule events)
- Maintain security through controlled permissions
- Enable agentic behavior beyond simple Q&A

---

## Why MCP for Zynqo AI?

Traditional chatbots can only provide information. With MCP, Zynqo AI becomes an **agent** that can:

✅ **Take action** instead of just suggesting  
✅ **Connect to real tools** (calendars, task managers, email)  
✅ **Maintain security** through granular permissions  
✅ **Scale easily** by adding new MCP servers  
✅ **Work locally** or with cloud services  

---

## MCP Architecture in Zynqo AI

```
┌─────────────────────────────────────────────────┐
│              Zynqo AI Application               │
│                                                 │
│  ┌───────────────────────────────────────┐    │
│  │         AI Agent (Claude)             │    │
│  │  - Understands user intent            │    │
│  │  - Plans actions                      │    │
│  │  - Calls MCP tools                    │    │
│  └───────────────┬───────────────────────┘    │
│                  │                              │
│  ┌───────────────▼───────────────────────┐    │
│  │         MCP Client                    │    │
│  │  - Manages server connections         │    │
│  │  - Routes tool calls                  │    │
│  │  - Handles permissions                │    │
│  └───────────────┬───────────────────────┘    │
└──────────────────┼──────────────────────────────┘
                   │
        ┌──────────┼──────────┐
        │          │          │
        ▼          ▼          ▼
   ┌────────┐ ┌────────┐ ┌────────┐
   │ Tasks  │ │Calendar│ │Document│
   │ Server │ │ Server │ │ Server │
   └────────┘ └────────┘ └────────┘
        │          │          │
        ▼          ▼          ▼
   [Local DB] [Google   [File
              Calendar] System]
```

---

## MCP Servers Implementation

### 1. Task Management Server

**Purpose:** Enable AI to manage user tasks

**Tools:**
```typescript
// Create a new task
createTask({
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string; // ISO format
  tags?: string[];
})

// Update existing task
updateTask({
  id: string;
  updates: Partial<Task>;
})

// Delete task
deleteTask({
  id: string;
})

// List tasks with filters
listTasks({
  status?: 'pending' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  tag?: string;
  limit?: number;
})

// Set reminder
setReminder({
  taskId: string;
  reminderTime: string; // ISO format
  reminderType: 'notification' | 'email';
})
```

**Resources:**
```typescript
// All tasks
tasks://list

// Task by ID
tasks://task/{id}

// Tasks by tag
tasks://tag/{tagName}
```

**Example Usage:**
```
User: "Create a task to review the project proposal by Friday"

AI Action:
1. Calls createTask({
     title: "Review project proposal",
     dueDate: "2026-10-27T17:00:00Z",
     priority: "high"
   })
2. Confirms: "I've created a high-priority task to review 
   the project proposal, due Friday at 5 PM."
```

---

### 2. Calendar Server

**Purpose:** Manage scheduling and calendar events

**Tools:**
```typescript
// Create calendar event
createEvent({
  title: string;
  startTime: string; // ISO format
  endTime: string;
  description?: string;
  attendees?: string[]; // email addresses
  location?: string;
})

// Check availability
checkAvailability({
  startDate: string;
  endDate: string;
  duration: number; // minutes
})

// List events
listEvents({
  startDate: string;
  endDate: string;
  calendarId?: string;
})

// Update event
updateEvent({
  eventId: string;
  updates: Partial<Event>;
})

// Delete event
deleteEvent({
  eventId: string;
})
```

**Resources:**
```typescript
// Today's events
calendar://today

// Events for date range
calendar://events?start={date}&end={date}

// Availability
calendar://availability
```

**Example Usage:**
```
User: "Schedule a meeting with John next Tuesday at 2 PM"

AI Action:
1. Calls checkAvailability for Tuesday 2 PM
2. If available, calls createEvent({
     title: "Meeting with John",
     startTime: "2026-10-28T14:00:00Z",
     endTime: "2026-10-28T15:00:00Z"
   })
3. Confirms: "I've scheduled a meeting with John for 
   Tuesday, October 28 at 2 PM."
```

---

### 3. Document Server

**Purpose:** Process and extract information from documents

**Tools:**
```typescript
// Read document
readDocument({
  filePath: string;
  format?: 'text' | 'json' | 'markdown';
})

// Summarize document
summarizeDocument({
  filePath: string;
  maxLength?: number; // words
  focusAreas?: string[]; // specific topics to focus on
})

// Extract information
extractInformation({
  filePath: string;
  query: string; // what to extract
})

// Search documents
searchDocuments({
  query: string;
  directory?: string;
  fileTypes?: string[]; // ['pdf', 'docx', 'txt']
})

// Create note
createNote({
  title: string;
  content: string;
  tags?: string[];
})
```

**Resources:**
```typescript
// Document content
documents://{filePath}

// Document metadata
documents://metadata/{filePath}

// All notes
documents://notes
```

**Example Usage:**
```
User: "Summarize the Q3 report and extract key metrics"

AI Action:
1. Calls summarizeDocument({
     filePath: "reports/Q3-2026.pdf",
     focusAreas: ["revenue", "growth", "challenges"]
   })
2. Calls extractInformation({
     filePath: "reports/Q3-2026.pdf",
     query: "key metrics, KPIs, revenue figures"
   })
3. Returns structured summary with extracted data
```

---

### 4. Email Server

**Purpose:** Draft and manage email communications

**Tools:**
```typescript
// Draft email
draftEmail({
  to: string[];
  subject: string;
  body: string;
  cc?: string[];
  attachments?: string[]; // file paths
})

// Send email (requires confirmation)
sendEmail({
  draftId: string;
})

// Read recent emails
getRecentEmails({
  count?: number;
  folder?: 'inbox' | 'sent' | 'drafts';
  unreadOnly?: boolean;
})

// Reply to email
replyToEmail({
  emailId: string;
  body: string;
  replyAll?: boolean;
})
```

**Resources:**
```typescript
// Inbox
email://inbox

// Sent items
email://sent

// Drafts
email://drafts
```

**Example Usage:**
```
User: "Draft a follow-up email to Sarah about the meeting"

AI Action:
1. Calls draftEmail({
     to: ["sarah@example.com"],
     subject: "Follow-up: Project Meeting",
     body: "Hi Sarah,\n\nThank you for..."
   })
2. Shows draft to user for approval
3. On approval, calls sendEmail({ draftId: "..." })
```

---

## Configuration

### MCP Client Setup

**File:** `.kiro/settings/mcp.json`

```json
{
  "mcpServers": {
    "zynqo-server": {
      "url": "http://localhost:3000/mcp",
      "transport": "http",
      "disabled": false
    }
  }
}
```

**Integrated Architecture:** 
The MCP server is built directly into the Next.js application as an API route at `/mcp`. This means:
- No separate server process to manage
- Same port (3000) as the main application
- Direct access to Prisma database
- Shared authentication and session management

**How it works:**
1. User sends message in chat
2. AI determines which tools to call
3. AI makes HTTP POST to `http://localhost:3000/mcp`
4. MCP endpoint executes the tool
5. Result returned to AI
6. AI incorporates result in response

**Request Example:**
```http
POST /mcp HTTP/1.1
Host: localhost:3000
Content-Type: application/json
MCP-Protocol-Version: 2026-07-28
Mcp-Method: tools/call
Mcp-Name: createTask

{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "createTask",
    "arguments": {
      "title": "Review proposal",
      "priority": "high",
      "dueDate": "2026-10-30"
    }
  }
}
```

---

## Permission Management

### Permission Levels

```typescript
type PermissionLevel = 
  | 'none'           // AI cannot use this tool
  | 'ask-always'     // Ask before every action
  | 'ask-once'       // Ask once per session
  | 'trusted';       // Execute without asking

interface Permission {
  server: string;
  tool: string;
  level: PermissionLevel;
  grantedAt?: Date;
  expiresAt?: Date; // Optional time limit
}
```

### Permission UI

User can manage permissions in Settings:

```
Task Management Server          [Enabled]
  ├─ createTask                 [Ask Once]
  ├─ updateTask                 [Trusted]
  ├─ deleteTask                 [Ask Always]
  └─ setReminder                [Trusted]

Calendar Server                 [Enabled]
  ├─ createEvent                [Ask Once]
  ├─ checkAvailability          [Trusted]
  └─ deleteEvent                [Ask Always]

Email Server                    [Disabled]
  ├─ draftEmail                 [Ask Always]
  └─ sendEmail                  [Ask Always]
```

---

## Security Best Practices

### 1. Principle of Least Privilege
- Grant only necessary permissions
- Start with restrictive permissions
- Require confirmation for destructive actions

### 2. Action Logging
```typescript
interface ActionLog {
  timestamp: Date;
  server: string;
  tool: string;
  parameters: Record<string, any>;
  result: 'success' | 'failure';
  userId: string;
}
```

### 3. Credential Protection
- Never expose credentials to client
- Store in environment variables
- Use secure credential managers
- Rotate credentials regularly

### 4. Input Validation
```typescript
// Validate all inputs before MCP calls
function validateTaskInput(input: unknown): Task {
  // Sanitize and validate
  // Throw errors for invalid data
}
```

---

## Testing MCP Servers

### Unit Testing
```typescript
// Test individual tools
describe('Task Server', () => {
  it('should create task with valid input', async () => {
    const result = await taskServer.createTask({
      title: 'Test task',
      priority: 'high'
    });
    expect(result.success).toBe(true);
  });
});
```

### Integration Testing
```typescript
// Test MCP client → server communication
describe('MCP Integration', () => {
  it('should route task creation through client', async () => {
    const client = new MCPClient(config);
    const result = await client.callTool('tasks', 'createTask', {
      title: 'Integration test'
    });
    expect(result.success).toBe(true);
  });
});
```

---

## Adding New MCP Servers

### Step-by-Step Guide

1. **Create MCP Library Structure**
```bash
mkdir -p app/lib/mcp/tools
```

2. **Implement MCP Server** (`app/lib/mcp/server.ts`)
```typescript
// app/lib/mcp/server.ts
import { MCPServer } from '@modelcontextprotocol/sdk';
import { createTaskTool } from './tools/tasks';
import { createEventTool } from './tools/calendar';
import { readDocumentTool } from './tools/documents';
import { draftEmailTool } from './tools/email';

export const mcpServer = new MCPServer({
  name: 'zynqo-server',
  version: '1.0.0'
});

// Register all tools
mcpServer.tool('createTask', createTaskTool.schema, createTaskTool.handler);
mcpServer.tool('createEvent', createEventTool.schema, createEventTool.handler);
mcpServer.tool('readDocument', readDocumentTool.schema, readDocumentTool.handler);
mcpServer.tool('draftEmail', draftEmailTool.schema, draftEmailTool.handler);

export default mcpServer;
```

3. **Implement Tool** (`app/lib/mcp/tools/tasks.ts`)
```typescript
// app/lib/mcp/tools/tasks.ts
import { prisma } from '@/lib/db';

export const createTaskTool = {
  schema: {
    description: 'Create a new task',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Task title' },
        priority: { 
          type: 'string', 
          enum: ['low', 'medium', 'high'],
          description: 'Task priority'
        },
        dueDate: { 
          type: 'string', 
          format: 'date-time',
          description: 'Due date in ISO format'
        }
      },
      required: ['title']
    }
  },
  handler: async (params: any) => {
    const task = await prisma.task.create({
      data: {
        title: params.title,
        priority: params.priority || 'medium',
        dueDate: params.dueDate ? new Date(params.dueDate) : null,
        status: 'pending'
      }
    });
    
    return {
      success: true,
      taskId: task.id,
      message: `Task "${task.title}" created successfully`
    };
  }
};
```

4. **Create API Route** (`app/mcp/route.ts`)
```typescript
// app/mcp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { mcpServer } from '@/lib/mcp/server';

export async function POST(request: NextRequest) {
  try {
    // Validate required headers
    const protocolVersion = request.headers.get('mcp-protocol-version');
    const method = request.headers.get('mcp-method');
    
    if (!protocolVersion || !method) {
      return NextResponse.json(
        { error: 'Missing required MCP headers' },
        { status: 400 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    
    // Handle JSON-RPC request
    const result = await mcpServer.handleRequest(body);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('MCP request error:', error);
    return NextResponse.json(
      { 
        jsonrpc: '2.0',
        error: { 
          code: -32603,
          message: 'Internal error',
          data: error instanceof Error ? error.message : 'Unknown error'
        },
        id: null
      },
      { status: 500 }
    );
  }
}

// Optional: Handle tool discovery
export async function GET() {
  const tools = await mcpServer.listTools();
  return NextResponse.json({
    server: 'zynqo-server',
    version: '1.0.0',
    tools
  });
}
```

5. **Create MCP Client** (`app/lib/mcp/client.ts`)
```typescript
// app/lib/mcp/client.ts
import { MCPClient } from '@modelcontextprotocol/sdk';

export class ZynqoMCPClient {
  private client: MCPClient;
  private baseUrl: string;

  constructor(baseUrl = 'http://localhost:3000/mcp') {
    this.baseUrl = baseUrl;
    this.client = new MCPClient({
      url: baseUrl,
      transport: 'http'
    });
  }

  async callTool(toolName: string, args: Record<string, any>) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'MCP-Protocol-Version': '2026-07-28',
          'Mcp-Method': 'tools/call',
          'Mcp-Name': toolName
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'tools/call',
          params: {
            name: toolName,
            arguments: args
          }
        })
      });

      if (!response.ok) {
        throw new Error(`MCP request failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error(`MCP tool call failed: ${toolName}`, error);
      throw error;
    }
  }

  async listTools() {
    const response = await fetch(this.baseUrl, {
      method: 'GET'
    });
    return response.json();
  }
}

export const mcpClient = new ZynqoMCPClient();
```

6. **Use in Chat API** (`app/api/chat/route.ts`)
```typescript
// app/api/chat/route.ts
import { mcpClient } from '@/lib/mcp/client';

// When AI wants to call a tool
const toolResult = await mcpClient.callTool('createTask', {
  title: 'Review proposal',
  priority: 'high',
  dueDate: '2026-10-30'
});
```

7. **Test the MCP Endpoint**
```bash
# Start the Next.js app
npm run dev

# Test MCP endpoint
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "MCP-Protocol-Version: 2026-07-28" \
  -H "Mcp-Method: tools/call" \
  -H "Mcp-Name: createTask" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "createTask",
      "arguments": {"title": "Test task", "priority": "high"}
    }
  }'

# List available tools
curl http://localhost:3000/mcp
```

---

## Troubleshooting

### Server Not Connecting
- Check MCP config syntax
- Verify server command and args
- Check server logs for errors
- Ensure dependencies installed

### Permission Denied
- Check permission settings in UI
- Verify user has granted necessary permissions
- Check permission expiration dates

### Tool Call Failures
- Validate input parameters
- Check server logs for detailed errors
- Test server independently
- Verify external service credentials

---

## Future Enhancements

### Planned MCP Servers
- **Web Search Server**: Search and fetch web content
- **Note-Taking Server**: Advanced note management
- **File Operations Server**: File system management
- **Automation Server**: Workflow automation
- **Communication Server**: Slack, Teams integration

### Advanced Features
- Multi-step action orchestration
- Conditional action execution
- Rollback mechanisms for failed actions
- Cross-server transactions

---

MCP makes Zynqo AI truly agentic. Instead of being a passive chatbot, it becomes an active assistant that takes action on your behalf—safely and with your permission.
