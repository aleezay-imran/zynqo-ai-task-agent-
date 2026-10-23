# Contributing to Zynqo AI

Thank you for your interest in contributing to Zynqo AI! This document provides guidelines and information for contributors.

---

## 🌟 Ways to Contribute

We welcome contributions in many forms:

- 🐛 **Bug Reports** - Found a bug? Let us know!
- ✨ **Feature Requests** - Have an idea? Share it!
- 📝 **Documentation** - Improve our docs
- 💻 **Code Contributions** - Fix bugs or add features
- 🧪 **Testing** - Help test new features
- 🎨 **Design** - Improve UI/UX
- 🔌 **MCP Servers** - Build new integrations
- 💬 **Community Support** - Help other users

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm
- Git
- A GitHub account
- Anthropic API key (for testing)

### Development Setup

1. **Fork the Repository**
   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/zynqo-ai.git
   cd zynqo-ai
   ```

3. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/zynqo-ai.git
   ```

4. **Install Dependencies**
   ```bash
   npm install
   ```

5. **Set Up Environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys
   ```

6. **Run Development Server**
   ```bash
   npm run dev
   ```

7. **Verify Setup**
   - Open http://localhost:3000
   - Try the chat interface
   - Check for console errors

---

## 📋 Contribution Workflow

### 1. Find or Create an Issue

- Check existing issues first
- For bugs, create a bug report
- For features, create a feature request
- Wait for approval before starting work on large features

### 2. Create a Branch

```bash
# Update your main branch
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

**Branch Naming Convention:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions/changes
- `chore/` - Maintenance tasks

### 3. Make Your Changes

- Write clean, readable code
- Follow our coding standards (see below)
- Add comments for complex logic
- Update documentation if needed
- Write/update tests

### 4. Test Your Changes

```bash
# Run linting
npm run lint

# Run type checking
npm run type-check

# Run tests (when available)
npm test

# Test in browser
npm run dev
```

### 5. Commit Your Changes

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git add .
git commit -m "type(scope): description"
```

**Commit Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Test changes
- `chore:` - Maintenance tasks

**Examples:**
```bash
git commit -m "feat(tasks): add priority sorting"
git commit -m "fix(chat): resolve streaming issue"
git commit -m "docs(readme): update installation steps"
```

### 6. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 7. Create a Pull Request

1. Go to your fork on GitHub
2. Click "Pull Request"
3. Select your branch
4. Fill out the PR template
5. Submit the PR

---

## 📝 Pull Request Guidelines

### PR Title

Use the same format as commit messages:
```
feat(tasks): add priority sorting
fix(chat): resolve streaming issue
```

### PR Description

Include:
- **What**: What changes you made
- **Why**: Why you made them
- **How**: How you implemented them
- **Testing**: How you tested them
- **Screenshots**: For UI changes

**Template:**
```markdown
## Description
Brief description of the change

## Motivation
Why is this change needed?

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
How was this tested?

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed the code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Added tests (if applicable)
- [ ] All tests pass
```

### Review Process

1. Maintainers will review your PR
2. Address any feedback
3. Make requested changes
4. Re-request review
5. Once approved, it will be merged

---

## 💻 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types/interfaces
- Avoid `any` when possible
- Export types for reusability

```typescript
// Good ✅
interface Task {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
}

function createTask(task: Task): Promise<Task> {
  // Implementation
}

// Bad ❌
function createTask(task: any): any {
  // Implementation
}
```

### React Components

- Use functional components
- Use hooks appropriately
- Keep components focused and small
- Extract reusable logic into hooks

```typescript
// Good ✅
export function TaskItem({ task }: { task: Task }) {
  const [isCompleted, setIsCompleted] = useState(task.completed);
  
  return (
    <div className="task-item">
      {/* Component JSX */}
    </div>
  );
}

// Bad ❌
export function TaskItem(props: any) {
  // 200 lines of code doing multiple things
}
```

### File Organization

```
app/
├── components/
│   ├── tasks/
│   │   ├── TaskItem.tsx        # Component
│   │   ├── TaskList.tsx
│   │   └── index.ts            # Barrel export
│   └── chat/
├── lib/
│   ├── utils.ts                # Utility functions
│   ├── types.ts                # Shared types
│   └── constants.ts            # Constants
└── api/
    └── tasks/
        └── route.ts            # API route
```

### Naming Conventions

- **Components**: PascalCase (`TaskItem.tsx`)
- **Functions**: camelCase (`createTask()`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_TASKS`)
- **Types/Interfaces**: PascalCase (`interface Task`)
- **Files**: kebab-case or PascalCase for components

### Code Style

- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Max line length: 100 characters
- Use trailing commas

```typescript
// Good ✅
const task = {
  id: '1',
  title: 'Review PR',
  completed: false,
};

// Bad ❌
const task = {
  id: "1",
  title: "Review PR",
  completed: false
}
```

### Comments

- Write self-documenting code
- Add comments for complex logic
- Use JSDoc for functions

```typescript
/**
 * Creates a new task with the given parameters
 * @param title - The task title
 * @param priority - Task priority level
 * @returns Promise resolving to the created task
 */
async function createTask(
  title: string,
  priority: Priority
): Promise<Task> {
  // Implementation
}
```

---

## 🧪 Testing Guidelines

### Test Structure

```typescript
describe('TaskItem', () => {
  it('should render task title', () => {
    // Test implementation
  });

  it('should handle completion toggle', () => {
    // Test implementation
  });
});
```

### What to Test

- ✅ Component rendering
- ✅ User interactions
- ✅ API endpoints
- ✅ Utility functions
- ✅ Error handling
- ✅ Edge cases

### What Not to Test

- ❌ Third-party libraries
- ❌ Next.js internals
- ❌ External APIs (use mocks)

---

## 🔌 Creating MCP Servers

If you're contributing a new MCP server:

### Structure

```
mcp-servers/
└── your-server/
    ├── index.ts            # Main server file
    ├── tools.ts            # Tool definitions
    ├── resources.ts        # Resource definitions
    ├── types.ts            # TypeScript types
    ├── README.md           # Server documentation
    └── package.json        # Dependencies
```

### Documentation

Each MCP server should have:
- Clear README with purpose
- List of all tools
- Usage examples
- Configuration instructions
- Security considerations

### Security

- Never expose credentials
- Validate all inputs
- Handle errors gracefully
- Log security events
- Follow least privilege principle

---

## 📖 Documentation

### When to Update Docs

Update documentation when you:
- Add a new feature
- Change existing behavior
- Fix a bug that users might encounter
- Add a new MCP server
- Change configuration

### Documentation Locations

- **README.md** - Project overview
- **docs/** - Detailed documentation
- **Code comments** - Inline documentation
- **API docs** - API route documentation

### Writing Style

- Clear and concise
- Use examples
- Include screenshots for UI changes
- Link to related docs
- Keep it up to date

---

## 🐛 Bug Reports

### Before Reporting

1. Search existing issues
2. Check if it's already fixed
3. Verify it's reproducible
4. Gather relevant information

### Bug Report Template

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Node version: [e.g., 18.17.0]
- Zynqo AI version: [e.g., 1.0.0]

## Screenshots
If applicable

## Additional Context
Any other relevant information
```

---

## ✨ Feature Requests

### Feature Request Template

```markdown
## Feature Description
Clear description of the feature

## Motivation
Why is this feature needed?

## Proposed Solution
How should it work?

## Alternatives Considered
Other approaches you thought about

## Additional Context
Any other relevant information
```

---

## 🎨 UI/UX Contributions

### Design Principles

- **Simple**: Easy to understand and use
- **Consistent**: Follow established patterns
- **Accessible**: WCAG 2.1 AA compliance
- **Responsive**: Works on all screen sizes
- **Fast**: Minimal loading times

### UI Changes

For UI changes, include:
- Before/after screenshots
- Mobile screenshots
- Dark mode screenshots (if applicable)
- Accessibility considerations

---

## ⚖️ Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone.

### Our Standards

**Positive behavior:**
- Using welcoming language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards others

**Unacceptable behavior:**
- Trolling, insulting comments, personal attacks
- Public or private harassment
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

### Enforcement

Project maintainers are responsible for enforcing the Code of Conduct. They have the right to:
- Remove, edit, or reject comments, commits, code, issues, and other contributions
- Ban temporarily or permanently any contributor for inappropriate behavior

---

## 🏆 Recognition

Contributors will be:
- Listed in our README
- Credited in release notes
- Recognized in our community

---

## 📧 Contact

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Security**: [Add security email]

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## 🙏 Thank You!

Every contribution, no matter how small, helps make Zynqo AI better. We appreciate your time and effort!

**Happy contributing! 🚀**
