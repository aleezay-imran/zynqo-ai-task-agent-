# Architecture Documentation

## System Overview

Zynqo AI is built as a modern web application with an agentic AI core that can take actions on behalf of users through the Model Context Protocol (MCP).

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     User Interface                      │
│            (Next.js App Router + React)                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│                   API Layer                             │
│              (Next.js API Routes)                       │
│  ┌──────────┬──────────┬──────────┬─────────────┐     │
│  │  Chat    │  Tasks   │Documents │ Automation  │     │
│  └──────────┴──────────┴──────────┴─────────────┘     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│                  AI Agent Core                          │
│  ┌──────────────────────────────────────────────┐     │
│  │  Intent Recognition & Context Management     │     │
│  └──────────────────────────────────────────────┘     │
│  ┌──────────────────────────────────────────────┐     │
│  │  Task Planning & Decomposition               │     │
│  └──────────────────────────────────────────────┘     │
│  ┌──────────────────────────────────────────────┐     │
│  │  Action Execution & Confirmation             │     │
│  └──────────────────────────────────────────────┘     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│            Model Context Protocol (MCP)                 │
│  ┌──────────┬──────────┬──────────┬─────────────┐     │
│  │  Tasks   │ Calendar │ Document │    Email    │     │
│  │  Server  │  Server  │  Server  │   Server    │     │
│  └──────────┴──────────┴──────────┴─────────────┘     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│              External Services & Storage                │
│    (File System, Databases, APIs, Calendars)           │
└─────────────────────────────────────────────────────────┘
```

---

## Component Details

### 1. User Interface Layer

**Technology:** Next.js 15 App Router, React 19, Tailwind CSS

**Key Components:**
- **Chat Interface**: Real-time streaming chat with action buttons
- **Task Dashboard**: Visual representation of tasks and schedules
- **Document Viewer**: Upload, view, and interact with documents
- **Settings Panel**: User preferences and permission management

**State Management:**
- React Context for global state
- Server Components for data fetching
- Client Components for interactivity

### 2. API Layer

**Technology:** Next.js API Routes

**Endpoints:**

#### `/api/chat`
- Handles chat messages
- Streams AI responses
- Manages conversation context
- Routes to appropriate handlers

#### `/api/tasks`
- CRUD operations for tasks
- Task prioritization
- Reminder management
- Progress tracking

#### `/api/documents`
- Document upload handling
- Text extraction
- Summarization requests
- Q&A processing

#### `/api/schedule`
- Calendar event management
- Schedule optimization
- Availability checking
- Planning assistance

#### `/api/automation`
- Workflow creation
- Action execution
- Permission verification
- Audit logging

### 3. AI Agent Core

**Technology:** Claude API, Custom orchestration logic

**Modules:**

#### Intent Recognition
- Parses user messages to identify intent
- Extracts entities and parameters
- Determines required actions
- Classifies request type (query vs action)

```typescript
interface Intent {
  type: 'query' | 'action' | 'hybrid';
  action?: ActionType;
  entities: Entity[];
  parameters: Record<string, any>;
  confidence: number;
}
```

#### Context Management
- Maintains conversation history
- Tracks user preferences
- Manages session state
- Stores document references

```typescript
interface Context {
  conversationId: string;
  messages: Message[];
  userPreferences: UserPreferences;
  activeDocuments: Document[];
  pendingActions: Action[];
}
```

#### Task Planning
- Breaks down complex requests
- Creates action sequences
- Handles dependencies
- Optimizes execution order

```typescript
interface TaskPlan {
  steps: TaskStep[];
  dependencies: Dependency[];
  estimatedTime: number;
  requiresPermission: boolean;
}
```

#### Action Execution
- Validates permissions
- Calls MCP servers
- Handles errors gracefully
- Confirms completion

```typescript
interface ActionResult {
  success: boolean;
  data?: any;
  error?: string;
  confirmationNeeded?: boolean;
}
```

### 4. Model Context Protocol (MCP)

**Purpose:** Standardized way for AI agents to interact with external tools

**MCP Client Configuration:**
```json
{
  "mcpServers": {
    "zynqo-server": {
      "url": "http://localhost:3000/mcp",
      "transport": "http"
    }
  }
}
```

The MCP server is integrated into the Next.js application at `/mcp`. All MCP tools (tasks, calendar, documents, email) are exposed through this single endpoint on the same port as the web application.

**MCP Server Structure:**
Each server implements:
- **Tools**: Available actions (e.g., createTask, scheduleEvent)
- **Resources**: Data sources (e.g., taskList, calendarEvents)
- **Prompts**: Pre-defined prompt templates

**Security Model:**
- Servers run in isolated processes
- User must grant permissions per server
- All actions logged for audit
- Permissions can be revoked anytime

---

## Data Flow

### Chat Message Flow

```
User Input
    ↓
Chat UI Component
    ↓
POST /api/chat
    ↓
Intent Recognition
    ↓
Context Retrieval
    ↓
[Is Action Required?]
    ├─ No → Generate Response → Stream to UI
    └─ Yes → Action Flow
```

### Action Execution Flow

```
Action Identified
    ↓
[Permission Granted?]
    ├─ No → Request Permission → [Approved?]
    │                              ├─ No → Abort
    │                              └─ Yes → Continue
    └─ Yes → Continue
    ↓
Plan Task Steps
    ↓
Execute via MCP
    ↓
Log Action
    ↓
Generate Confirmation
    ↓
Update UI
```

---

## Security Architecture

### Permission System

**Levels:**
1. **None**: AI suggests but doesn't act
2. **Ask Always**: Confirm each action
3. **Ask Once**: Confirm first time per session
4. **Automatic**: Execute without asking (for trusted actions)

**Scope:**
- Per MCP server
- Per tool within server
- Time-limited grants
- Revocable at any time

### Data Protection

- **Encryption at Rest**: User data encrypted in PostgreSQL
- **API Key Security**: Keys stored in environment variables, never exposed to client
- **Audit Logging**: All actions logged with timestamps in database
- **Data Minimization**: Only necessary data sent to AI models
- **User Control**: Users can view and delete all their data

---

## Scalability Considerations

### Database Architecture

**PostgreSQL with Prisma:**
- PostgreSQL as primary database
- Prisma ORM for type-safe database access
- pgvector extension for embeddings
- Connection pooling for performance
- Database migrations with Prisma Migrate

**Schema Design:**
- Users table for authentication
- Tasks, documents, schedules tables
- Embeddings table with vector storage
- Audit logs table
- User preferences table

### Current (MVP)
- Single PostgreSQL instance
- Prisma for database operations
- pgvector for document embeddings
- Connection pooling
- Stateless API routes

### Future (Multi-user)
- PostgreSQL read replicas
- Redis for session management
- Horizontal API scaling
- Message queue for async actions
- CDN for static assets

---

## Development Workflow

### Local Development
```bash
# Run Next.js dev server
npm run dev

# Run MCP servers (auto-started)
# Configured in .kiro/settings/mcp.json

# Run tests
npm test

# Type checking
npm run type-check

# Linting
npm run lint
```

### Testing Strategy
- Unit tests for utilities and helpers
- Integration tests for API routes
- E2E tests for critical user flows
- MCP server testing with mock data

---

## Performance Optimization

### AI Response Optimization
- Streaming responses for immediate feedback
- Context window management
- Prompt caching where possible
- Parallel MCP calls for independent actions

### UI Optimization
- Server Components for static content
- Client Components only when needed
- Code splitting by route
- Image optimization with next/image
- Font optimization with next/font

---

## Monitoring & Observability

### Planned Metrics
- Response time (AI generation)
- Action success/failure rates
- MCP server health
- User engagement metrics
- Error rates by component

### Logging
- Structured JSON logs
- Separate logs for AI, actions, errors
- User action audit trail
- Performance metrics

---

## Future Enhancements

### Multi-Agent System
- Specialized agents for different domains
- Agent orchestration layer
- Inter-agent communication
- Distributed task execution

### Advanced AI Features
- Long-term memory with vector storage
- Multi-modal inputs (voice, images)
- Proactive suggestions
- Predictive task creation

### Integration Ecosystem
- Plugin marketplace
- Third-party MCP servers
- OAuth integrations
- Webhook support

---

This architecture is designed to be modular, secure, and scalable while maintaining simplicity for the MVP phase.
