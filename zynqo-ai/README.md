# Zynqo AI - Personal Assistant Agent

An AI-powered personal assistant that goes beyond chatbots by taking **action** on your behalf. Built with Next.js, TypeScript, and Model Context Protocol (MCP), Zynqo AI helps you complete daily tasks, manage your schedule, and automate repetitive workflows.

---

## 🎯 Vision

Create an agentic AI assistant that:
- **Takes action** instead of just providing instructions
- **Saves time** by automating tasks with user permission
- **Learns** user preferences for personalized assistance
- **Integrates** with external tools via Model Context Protocol
- Acts as a customized Alexa+ for the modern productivity workflow

---

## ✨ Core Features

### 1. Smart Task Management
- Automatically organize and categorize tasks
- Create intelligent to-do lists with priority detection
- Set reminders based on context and deadlines
- Track task progress and completion
- Suggest task breakdowns for complex projects

### 2. AI-Powered Planning
- Analyze user priorities and create daily schedules
- Suggest optimal time blocks for different task types
- Balance workload across days/weeks
- Adapt schedules based on completion rates
- Integrate with calendar systems

### 3. Document Assistance
- Summarize long documents (PDFs, Word, text files)
- Extract key information and action items
- Answer questions about uploaded documents
- Generate reports from multiple documents
- Create structured notes from unstructured content

### 4. Smart Communication
- Draft emails with appropriate tone and context
- Generate professional replies to messages
- Suggest communication improvements
- Create meeting agendas and follow-ups
- Compose social media posts and content

### 5. Task Automation
- Execute actions with explicit user permission
- Connect to external services via MCP
- Automate repetitive workflows
- Chain multiple actions together
- Learn from user feedback to improve automation

### 6. Personalized Assistance
- Learn user preferences over time
- Adapt communication style to user needs
- Remember context from previous interactions
- Provide proactive suggestions
- Customize workflows based on user patterns

---

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- Next.js 15 (App Router)
- TypeScript
- React 19
- Tailwind CSS
- shadcn/ui components

**Backend:**
- Next.js API Routes
- Model Context Protocol (MCP)
- Streaming responses
- Prisma ORM

**Database:**
- PostgreSQL
- pgvector extension for embeddings
- Prisma for database management

**AI & Integration:**
- Claude API (Anthropic)
- OpenAI API (optional)
- MCP Servers for tool integration
- pgvector for document embeddings and RAG

### Core Components

```
zynqo-ai/
├── app/
│   ├── api/
│   │   └── chat/          # Main chat endpoint with AI
│   ├── mcp/               # MCP server endpoint
│   │   └── route.ts       # Unified /mcp endpoint
│   ├── components/
│   │   ├── chat/          # Chat interface
│   │   ├── tasks/         # Task UI components
│   │   ├── documents/     # Document viewer
│   │   └── settings/      # User preferences
│   └── lib/
│       ├── mcp/           
│       │   ├── client.ts  # MCP client for AI to call tools
│       │   ├── server.ts  # MCP server implementation
│       │   └── tools/     # All tool implementations
│       │       ├── tasks.ts
│       │       ├── calendar.ts
│       │       ├── documents.ts
│       │       └── email.ts
│       ├── ai/            # AI utilities
│       ├── db/            # Prisma database layer
│       └── utils/         # Helpers
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Database migrations
└── docs/                 # Documentation
```

---

## 🔌 Model Context Protocol (MCP) Integration

MCP enables the assistant to interact with external tools and services securely.

### Planned MCP Servers

1. **Task Management Server**
   - Create, update, delete tasks
   - Set reminders and deadlines
   - Query task status

2. **Calendar Server**
   - Read/write calendar events
   - Check availability
   - Schedule meetings

3. **Document Server**
   - Read file contents
   - Extract text from PDFs
   - Summarize documents

4. **Email Server**
   - Draft emails
   - Send with confirmation
   - Read recent emails (with permission)

5. **Note-Taking Server**
   - Create structured notes
   - Search existing notes
   - Tag and organize

6. **Web Search Server**
   - Query current information
   - Fetch specific URLs
   - Extract relevant data

### Security & Permissions

- All actions require explicit user permission
- Granular permission controls per MCP server
- Audit log of all automated actions
- Ability to revoke permissions anytime
- Secure credential storage

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm
- Anthropic API key (for Claude)
- Optional: OpenAI API key

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd zynqo-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Add your API keys to .env.local
ANTHROPIC_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here (optional)
```

### Running Development Server

```bash
npm run dev
```

### Running Development Server

Just start the Next.js application - MCP server is integrated:

```bash
npm run dev
```

The application will start on `http://localhost:3000` with the MCP endpoint available at `http://localhost:3000/mcp`.

---

## 📋 Roadmap

### Phase 1: Foundation (Current)
- [x] Project setup with Next.js + TypeScript
- [ ] Basic chat interface
- [ ] Claude API integration
- [ ] MCP client setup
- [ ] Task management UI

### Phase 2: Core Features
- [ ] Smart task management system
- [ ] Document upload & summarization
- [ ] AI-powered schedule planning
- [ ] Email/message drafting
- [ ] User preferences storage

### Phase 3: Automation
- [ ] MCP server implementations
- [ ] Permission system
- [ ] Workflow automation engine
- [ ] Action execution framework
- [ ] Audit logging

### Phase 4: Intelligence
- [ ] Context memory across sessions
- [ ] User preference learning
- [ ] Proactive suggestions
- [ ] Multi-step task planning
- [ ] RAG for document Q&A

### Phase 5: Advanced Features
- [ ] Voice interface integration
- [ ] Mobile app (React Native)
- [ ] Team collaboration features
- [ ] Advanced analytics
- [ ] Plugin marketplace

---

## 🎨 User Experience

### Chat Interface
- Clean, modern design
- Real-time streaming responses
- Action buttons for quick tasks
- File upload support
- Voice input (planned)

### Task Dashboard
- Visual task boards (Kanban-style)
- Calendar integration
- Priority indicators
- Progress tracking
- Quick actions

### Settings & Preferences
- Privacy controls
- Permission management
- Notification preferences
- Custom workflows
- Theme customization

---

## 🔐 Privacy & Security

- **Local-first approach**: Sensitive data stored locally when possible
- **Encrypted storage**: User data encrypted at rest
- **Permission-based actions**: No action without explicit consent
- **Transparent logging**: Full audit trail of AI actions
- **Data deletion**: Users can delete all their data anytime

---

## 🤝 Contributing

Contributions are welcome! We appreciate all forms of contribution - from bug reports to new features.

Please read our **[Contributing Guidelines](./CONTRIBUTING.md)** before submitting PRs.

### Quick Contribution Guide

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

### What This Means

- ✅ You can use this project for personal or commercial purposes
- ✅ You can modify and distribute the code
- ✅ You can create derivative works
- ✅ No warranty or liability from contributors

---

## 📚 Documentation

- **[Quick Start Guide](./docs/QUICK_START.md)** - Get running in 5 minutes
- **[Architecture](./docs/ARCHITECTURE.md)** - System design and technical details
- **[Features](./docs/FEATURES.md)** - Detailed feature specifications
- **[Screens](./docs/SCREENS.md)** - Complete UI/UX documentation
- **[MCP Integration](./docs/MCP_INTEGRATION.md)** - Model Context Protocol guide
- **[Roadmap](./docs/ROADMAP.md)** - Development phases and timeline

---

## 📞 Support

For questions, issues, or feature requests, please open an issue on GitHub.

---

**Built with ❤️ to make AI truly helpful in daily life**
