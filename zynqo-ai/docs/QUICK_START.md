# Quick Start Guide

Get Zynqo AI running on your local machine in 5 minutes.

---

## Prerequisites

Before you begin, ensure you have:
- **Node.js 18+** installed ([Download](https://nodejs.org/))
- **npm** or **yarn** or **pnpm**
- **Anthropic API key** ([Get one here](https://console.anthropic.com/))
- A code editor (VS Code recommended)

---

## Installation Steps

### 1. Clone or Navigate to Project

```bash
cd d:\Hackthons\zynqo-ai-task-agent\zynqo-ai
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your configuration:

```env
# AI API Key
ANTHROPIC_API_KEY=your_actual_api_key_here

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/zynqo_ai?schema=public"
```

### 4. Set Up Database

Create PostgreSQL database and run migrations:

```bash
# Create database
createdb zynqo_ai

# Or using psql
psql -U postgres -c "CREATE DATABASE zynqo_ai;"

# Install pgvector extension
psql -U postgres -d zynqo_ai -c "CREATE EXTENSION vector;"

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

### 5. Run Development Server

```bash
npm run dev
```

### 5. Open Application

Open your browser and navigate to:
```
http://localhost:3000
```

---

## First Steps with Zynqo AI

### Try These Commands:

#### 1. Basic Chat
```
Hello! What can you help me with?
```

#### 2. Task Management (Once implemented)
```
Create a task to review project proposal by Friday
Add "buy groceries" to my to-do list
Show me all my tasks for today
```

#### 3. Document Processing (Once implemented)
```
[Upload a PDF document]
Summarize this document
What are the key takeaways from this report?
```

#### 4. Schedule Planning (Once implemented)
```
Plan my day tomorrow
When am I free for a meeting on Tuesday?
Schedule a meeting with John at 2 PM
```

---

## Project Structure

```
zynqo-ai/
├── app/
│   ├── api/              # API routes
│   │   ├── chat/         # Chat endpoint
│   │   │   └── route.ts
│   │   └── mcp/          # MCP server endpoint
│   │       └── route.ts  # Integrated MCP server
│   ├── components/       # React components
│   ├── lib/              # Utilities and helpers
│   │   ├── mcp/          # MCP implementation
│   │   │   ├── server.ts # MCP server
│   │   │   ├── client.ts # MCP client
│   │   │   └── tools/    # Tool implementations
│   │   │       ├── tasks.ts
│   │   │       ├── calendar.ts
│   │   │       ├── documents.ts
│   │   │       └── email.ts
│   │   ├── ai/           # AI utilities
│   │   ├── db/           # Prisma client
│   │   └── utils/        # Helpers
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── docs/                 # Documentation
│   ├── ARCHITECTURE.md
│   ├── FEATURES.md
│   ├── MCP_INTEGRATION.md
│   ├── QUICK_START.md
│   └── ROADMAP.md
├── prisma/               # Database
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Database migrations
├── public/               # Static assets
├── .env.example          # Environment template
├── .env.local            # Your environment (create this)
├── CONTRIBUTING.md       # Contribution guidelines
├── LICENSE               # MIT License
├── next.config.ts        # Next.js config
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
└── README.md            # This file
```

---

## Configuration

### API Keys

**Anthropic Claude API:**
1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new key
5. Copy to `.env.local`

**Optional - OpenAI API:**
1. Go to [platform.openai.com](https://platform.openai.com/)
2. Create an API key
3. Add to `.env.local`

### Feature Flags

Enable or disable features in `.env.local`:

```env
NEXT_PUBLIC_ENABLE_TASKS=true
NEXT_PUBLIC_ENABLE_DOCUMENTS=true
NEXT_PUBLIC_ENABLE_CALENDAR=false
NEXT_PUBLIC_ENABLE_EMAIL=false
```

---

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint

# Type checking
npm run type-check

# Database commands
npx prisma studio          # Open Prisma Studio (database GUI)
npx prisma migrate dev     # Create and apply migrations
npx prisma generate        # Generate Prisma Client
npx prisma db push         # Push schema changes (development)
npx prisma db seed         # Seed database with test data

# Run tests (once implemented)
npm test
```

---

## MCP Configuration

MCP server is integrated into the Next.js application at `/mcp`.

**Configuration file:** `.kiro/settings/mcp.json`

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

**No separate server needed!** The MCP endpoint is part of your Next.js application:

```bash
# Just start the Next.js app
npm run dev
```

The MCP server will be available at `http://localhost:3000/mcp` and handles all tool calls (tasks, calendar, documents, email) through this single endpoint using JSON-RPC protocol.

---

## Troubleshooting

### Issue: Port 3000 already in use

**Solution:** Use a different port
```bash
PORT=3001 npm run dev
```

### Issue: API key not working

**Solution:** 
- Check `.env.local` exists (not `.env.example`)
- Verify no extra spaces in API key
- Restart development server after changing env vars

### Issue: Module not found errors

**Solution:** Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeScript errors

**Solution:** Clear Next.js cache
```bash
rm -rf .next
npm run dev
```

---

## Next Steps

### For Users:
1. Explore the chat interface
2. Try creating tasks via natural language
3. Upload documents (once implemented)
4. Customize settings and preferences

### For Developers:
1. Read [ARCHITECTURE.md](./ARCHITECTURE.md) for system overview
2. Check [ROADMAP.md](./ROADMAP.md) for implementation plan
3. Review [FEATURES.md](./FEATURES.md) for detailed specs
4. Study [MCP_INTEGRATION.md](./MCP_INTEGRATION.md) for MCP details

---

## Getting Help

### Documentation
- [Full README](../README.md)
- [Architecture Documentation](./ARCHITECTURE.md)
- [Feature Specifications](./FEATURES.md)
- [MCP Integration Guide](./MCP_INTEGRATION.md)

### Common Questions

**Q: Can I use a different AI model?**  
A: Yes, you can integrate OpenAI or other models. See `app/api/chat/route.ts` for the implementation.

**Q: How do I add a new MCP server?**  
A: Follow the guide in [MCP_INTEGRATION.md](./MCP_INTEGRATION.md) under "Adding New MCP Servers".

**Q: Is my data secure?**  
A: Yes, all data is stored locally. API keys are never exposed to the client. See security section in [ARCHITECTURE.md](./ARCHITECTURE.md).

**Q: Can I use this for my team?**  
A: The MVP is single-user. Multi-user support is planned for Phase 10+.

---

## Development Workflow

### Making Changes

1. **Create a branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**
```bash
# Edit files
# Test locally
```

3. **Commit changes**
```bash
git add .
git commit -m "feat: add your feature description"
```

4. **Push and create PR**
```bash
git push origin feature/your-feature-name
```

### Testing

Before committing:
- [ ] Run `npm run lint` - no errors
- [ ] Run `npm run type-check` - no errors
- [ ] Test in browser - works as expected
- [ ] Check console - no errors

---

## Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

See [CONTRIBUTING.md](./CONTRIBUTING.md) (coming soon) for detailed guidelines.

---

## Support

- **Issues**: Open an issue on GitHub
- **Discussions**: Join our discussions
- **Email**: [Add support email]

---

**Ready to build an AI agent that actually takes action? Let's go! 🚀**
