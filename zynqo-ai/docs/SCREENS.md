# UI Screens Documentation

This document outlines all the user interface screens required for Zynqo AI.

---

## 📊 Current Implementation Status

### ✅ Already Implemented (MVP Demo)
- **Home/Overview Page** (`app/page.tsx`) - Basic prototype with tabs
- **Chat Interface** - Simple chat component integrated
- **Task List** - Basic task management with local storage
- **Planner View** - Simple task ordering
- **Document Upload** - Basic .txt file upload
- **Email Drafts** - Simple email template generation

### 🔄 Needs Enhancement/Refactoring
All existing screens need to be:
- Separated into proper components
- Connected to PostgreSQL via Prisma
- Integrated with MCP for AI actions
- Enhanced with proper UI/UX
- Made responsive for all devices

---

## 🎨 Screen Requirements

### 1. Dashboard / Overview Screen

**Route:** `/` or `/dashboard`  
**Status:** ✅ Partially Implemented (needs refactoring)

**Purpose:** Main landing page showing user's day at a glance

**Components Needed:**
```
DashboardPage/
├── DashboardHeader.tsx       # Welcome message, date, quick stats
├── QuickStats.tsx            # Cards showing pending tasks, upcoming events
├── TodaysPriorities.tsx      # Top 5 tasks for today
├── UpcomingEvents.tsx        # Next 3 calendar events
├── RecentDocuments.tsx       # Last 3 uploaded documents
└── QuickActions.tsx          # Quick action buttons (Add Task, New Event, etc.)
```

**Layout:**
```
┌─────────────────────────────────────────────┐
│  Good morning, User! 🌅                     │
│  Friday, October 23, 2026                   │
├─────────────────────────────────────────────┤
│  ┌────────┐ ┌────────┐ ┌────────┐          │
│  │  5      │ │  2      │ │  1      │         │
│  │Pending  │ │Events   │ │Document │         │
│  │Tasks    │ │Today    │ │Uploaded │         │
│  └────────┘ └────────┘ └────────┘          │
├─────────────────────────────────────────────┤
│  Today's Priorities                          │
│  ✓ Review project proposal (High)           │
│  ○ Team meeting preparation (Medium)        │
│  ○ Reply to emails (Low)                    │
├─────────────────────────────────────────────┤
│  Upcoming Events                             │
│  2:00 PM - Team Standup                     │
│  4:00 PM - Client Call                      │
└─────────────────────────────────────────────┘
```

**Features:**
- Quick task completion toggle
- Click to jump to detailed views
- Real-time updates
- Keyboard shortcuts (J/K navigation)

---

### 2. Chat Interface (AI Assistant)

**Route:** `/chat` or integrated sidebar  
**Status:** ✅ Partially Implemented (needs MCP integration)

**Purpose:** Main conversational interface with AI agent

**Components Needed:**
```
ChatInterface/
├── ChatLayout.tsx            # Main chat container
├── MessageList.tsx           # Scrollable message feed
├── MessageBubble.tsx         # Individual message (user/assistant)
├── ChatInput.tsx             # Input with send button
├── TypingIndicator.tsx       # "AI is typing..." animation
├── ActionButtons.tsx         # Quick action suggestions
├── ToolExecutionCard.tsx     # Shows when AI executes a tool
└── ChatHistory.tsx           # Previous conversations (optional)
```

**Layout:**
```
┌─────────────────────────────────────────────┐
│  Zynqo AI Assistant                  [New] │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────────────────────────┐       │
│  │ YOU                              │       │
│  │ Create a task to review the     │       │
│  │ project proposal by Friday       │       │
│  └─────────────────────────────────┘       │
│                                             │
│       ┌─────────────────────────────┐      │
│       │ ZYNQO                        │      │
│       │ I've created the task for    │      │
│       │ you. Would you like me to    │      │
│       │ set a reminder?              │      │
│       │                              │      │
│       │ [Executing: createTask]      │      │
│       │ ✓ Task created successfully  │      │
│       └─────────────────────────────┘      │
│                                             │
│  Quick actions:                             │
│  [Plan my day] [Upload document] [Draft email]│
├─────────────────────────────────────────────┤
│  Type your message...             [Send →] │
└─────────────────────────────────────────────┘
```

**Features:**
- Streaming AI responses
- Tool execution feedback
- Code/text formatting support
- File attachments
- Voice input (future)
- Export conversation
- Clear conversation

---

### 3. Task Management Screen

**Route:** `/tasks`  
**Status:** ✅ Basic implementation exists (needs database integration)

**Purpose:** Full task management with filters and organization

**Components Needed:**
```
TasksPage/
├── TasksHeader.tsx           # Title, add task button, view toggles
├── TaskFilters.tsx           # Filter by status, priority, tags
├── TaskListView.tsx          # List view of tasks
├── TaskKanbanView.tsx        # Kanban board view
├── TaskCalendarView.tsx      # Calendar view of tasks
├── TaskItem.tsx              # Individual task card
├── TaskDetail.tsx            # Task detail modal/sidebar
├── AddTaskModal.tsx          # Quick add task form
├── BulkActions.tsx           # Bulk select and actions
└── TaskStats.tsx             # Progress charts
```

**Layout (List View):**
```
┌─────────────────────────────────────────────┐
│  Tasks                           [+ Add Task]│
│                                              │
│  [All] [Today] [Week] [Overdue]             │
│  Filter: [Status ▼] [Priority ▼] [Tags ▼]  │
├─────────────────────────────────────────────┤
│  ┌──────────────────────────────────────┐  │
│  │ ☐ Review project proposal      [HIGH]│  │
│  │   Due: Oct 27, 5:00 PM              │  │
│  │   Tags: work, urgent                │  │
│  └──────────────────────────────────────┘  │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │ ☐ Team meeting prep          [MEDIUM]│  │
│  │   Due: Oct 24, 2:00 PM              │  │
│  │   Subtasks: 2/5 completed           │  │
│  └──────────────────────────────────────┘  │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │ ✓ Reply to client emails        [LOW]│  │
│  │   Completed: Oct 23, 3:45 PM        │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

**Layout (Kanban View):**
```
┌─────────────────────────────────────────────┐
│  Tasks - Board View                          │
├───────────┬───────────┬───────────┬──────────┤
│  To Do    │ In Progress│ Review    │ Done    │
│  (5)      │ (3)       │ (2)       │ (12)    │
├───────────┼───────────┼───────────┼──────────┤
│ ┌───────┐ │ ┌───────┐ │ ┌───────┐ │┌───────┐│
│ │Task 1 │ │ │Task 4 │ │ │Task 7 │ ││Task 9 ││
│ │ HIGH  │ │ │ MED   │ │ │ LOW   │ ││ HIGH ││
│ └───────┘ │ └───────┘ │ └───────┘ │└───────┘│
│ ┌───────┐ │ ┌───────┐ │           │┌───────┐│
│ │Task 2 │ │ │Task 5 │ │           ││Task 10││
│ │ MED   │ │ │ HIGH  │ │           ││ MED  ││
│ └───────┘ │ └───────┘ │           │└───────┘│
└───────────┴───────────┴───────────┴──────────┘
```

**Features:**
- Drag and drop between statuses
- Quick edit inline
- Natural language add ("Review proposal by Friday")
- Recurring tasks
- Subtasks
- Task dependencies
- Priority auto-detection
- Smart due date parsing
- Bulk operations (complete, delete, move)

---

### 4. Calendar & Schedule Planner

**Route:** `/calendar` or `/planner`  
**Status:** ⚠️ Basic planner exists (needs full calendar integration)

**Purpose:** Visual schedule and time management

**Components Needed:**
```
CalendarPage/
├── CalendarHeader.tsx        # Date navigation, view switchers
├── DayView.tsx               # Hour-by-hour schedule
├── WeekView.tsx              # 7-day overview
├── MonthView.tsx             # Traditional calendar
├── EventCard.tsx             # Individual event display
├── TimeBlocker.tsx           # Drag-to-create time blocks
├── AddEventModal.tsx         # Quick event creation
├── ScheduleSuggestions.tsx   # AI-suggested schedule
├── AvailabilityChecker.tsx   # Check free times
└── CalendarIntegrations.tsx  # Google Calendar sync
```

**Layout (Week View):**
```
┌─────────────────────────────────────────────┐
│  Oct 21 - Oct 27, 2026    [Day][Week][Month]│
│  ← Today →                      [+ Add Event]│
├───┬─────┬─────┬─────┬─────┬─────┬─────┬─────┤
│   │ Mon │ Tue │ Wed │ Thu │ Fri │ Sat │ Sun │
│   │  21 │  22 │  23 │  24 │  25 │  26 │  27 │
├───┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│8AM│     │     │     │┌────┐     │     │     │
│   │     │     │     ││Mtng││     │     │     │
│   │     │     │     │└────┘     │     │     │
├───┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│9AM│┌─────────┐│     │     │     │     │     │
│   ││Deep Work││     │     │     │     │     │
│   │└─────────┘│     │     │     │     │     │
├───┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│2PM│     │     │     │┌─────────┐│     │     │
│   │     │     │     ││Client   ││     │     │
│   │     │     │     ││Call     ││     │     │
│   │     │     │     │└─────────┘│     │     │
└───┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘
```

**Features:**
- Drag to create events
- Drag to reschedule
- Color-coded by category
- Task-to-event conversion
- AI schedule optimization
- Conflict detection
- Time zone support
- Recurring events
- Availability sharing

---

### 5. Document Management Screen

**Route:** `/documents`  
**Status:** ⚠️ Basic upload exists (needs full document management)

**Purpose:** Upload, organize, and interact with documents

**Components Needed:**
```
DocumentsPage/
├── DocumentsHeader.tsx       # Upload button, search, filters
├── DocumentGrid.tsx          # Grid view of documents
├── DocumentList.tsx          # List view of documents
├── DocumentCard.tsx          # Individual document preview
├── DocumentViewer.tsx        # Full document viewer
├── DocumentUpload.tsx        # Drag-and-drop upload
├── DocumentFilters.tsx       # Filter by type, date, tags
├── DocumentSearch.tsx        # Full-text search
├── DocumentQA.tsx            # Ask questions about document
└── DocumentSummary.tsx       # AI-generated summary
```

**Layout:**
```
┌─────────────────────────────────────────────┐
│  Documents                      [+ Upload]   │
│  [Search documents...]         [Grid][List] │
├─────────────────────────────────────────────┤
│  Recent                                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ 📄       │ │ 📄       │ │ 📊       │   │
│  │ Q3       │ │ Project  │ │ Budget   │   │
│  │ Report   │ │ Proposal │ │ 2026     │   │
│  │          │ │          │ │          │   │
│  │ 2 MB     │ │ 856 KB   │ │ 1.2 MB   │   │
│  │ Oct 20   │ │ Oct 18   │ │ Oct 15   │   │
│  └──────────┘ └──────────┘ └──────────┘   │
├─────────────────────────────────────────────┤
│  All Documents (24)          Sort: [Date ▼] │
│  Filter: [Type ▼] [Tags ▼]                 │
│                                             │
│  📄 Annual Review 2025.pdf        Oct 10   │
│  📊 Sales Data Q2.xlsx            Oct 08   │
│  📝 Meeting Notes.docx            Oct 05   │
│  📄 Contract Draft.pdf            Sep 28   │
└─────────────────────────────────────────────┘
```

**Features:**
- Drag-and-drop upload
- Multiple file types (PDF, Word, Excel, TXT)
- OCR for scanned documents
- Full-text search
- AI-powered Q&A
- Auto-summarization
- Extract action items
- Tag and organize
- Share documents
- Version history

---

### 6. Email & Communication Screen

**Route:** `/email` or `/communication`  
**Status:** ⚠️ Basic draft generator exists (needs full implementation)

**Purpose:** Draft, manage, and send emails with AI assistance

**Components Needed:**
```
EmailPage/
├── EmailHeader.tsx           # Navigation, compose button
├── EmailComposer.tsx         # Rich text editor
├── EmailDraftsList.tsx       # Saved drafts
├── EmailTemplates.tsx        # Pre-made templates
├── ToneSelector.tsx          # Adjust email tone
├── AIAssist.tsx              # AI writing suggestions
├── RecipientInput.tsx        # Smart recipient selection
├── AttachmentUpload.tsx      # File attachments
└── EmailPreview.tsx          # Preview before sending
```

**Layout:**
```
┌─────────────────────────────────────────────┐
│  Email Assistant               [+ Compose]   │
├─────────────────────────────────────────────┤
│  New Email                                   │
│  ┌──────────────────────────────────────┐  │
│  │ To: [                              ] │  │
│  │ Subject: [                         ] │  │
│  │                                      │  │
│  │ ┌──────────────────────────────┐    │  │
│  │ │ Hi Professor,                │    │  │
│  │ │                              │    │  │
│  │ │ I hope this email finds you  │    │  │
│  │ │ well...                      │    │  │
│  │ │                              │    │  │
│  │ │ [AI writing here...]         │    │  │
│  │ │                              │    │  │
│  │ └──────────────────────────────┘    │  │
│  │                                      │  │
│  │ Tone: [Professional ▼]              │  │
│  │ Style: [Formal ▼]                   │  │
│  │                                      │  │
│  │ [Improve writing] [Check grammar]   │  │
│  │ [📎 Attach files]                   │  │
│  │                                      │  │
│  │ [Copy draft] [Save draft] [Send ✉] │  │
│  └──────────────────────────────────────┘  │
├─────────────────────────────────────────────┤
│  Saved Drafts (3)                           │
│  • Follow-up: Project discussion            │
│  • Thank you note: Interview                │
│  • Request: Meeting reschedule              │
└─────────────────────────────────────────────┘
```

**Features:**
- AI-powered drafting
- Tone adjustment (formal, casual, friendly, assertive)
- Grammar and style checking
- Template library
- Smart recipient suggestions
- Attachment support
- Schedule send
- Read receipts (future)
- Email tracking (future)

---

### 7. Automation & Workflows Screen

**Route:** `/automation` or `/workflows`  
**Status:** ❌ Not implemented

**Purpose:** Create and manage automated workflows

**Components Needed:**
```
AutomationPage/
├── WorkflowsHeader.tsx       # Create workflow button
├── WorkflowsList.tsx         # Active workflows
├── WorkflowBuilder.tsx       # Visual workflow editor
├── TriggerSelector.tsx       # Choose trigger event
├── ActionSelector.tsx        # Choose actions
├── ConditionBuilder.tsx      # If-then logic
├── WorkflowPreview.tsx       # Test workflow
├── WorkflowHistory.tsx       # Execution history
└── WorkflowTemplates.tsx     # Pre-built workflows
```

**Layout:**
```
┌─────────────────────────────────────────────┐
│  Automation                  [+ New Workflow]│
├─────────────────────────────────────────────┤
│  Active Workflows (5)                        │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │ 🔄 Morning Routine            [ON]  │  │
│  │                                      │  │
│  │ When: Every day at 8:00 AM           │  │
│  │ Then: Check calendar, list tasks     │  │
│  │                                      │  │
│  │ Last run: Today at 8:00 AM ✓        │  │
│  │ [Edit] [Logs] [Disable]            │  │
│  └──────────────────────────────────────┘  │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │ 📧 Email Project Updates     [ON]  │  │
│  │                                      │  │
│  │ When: Task marked complete (Project) │  │
│  │ Then: Draft summary email            │  │
│  │                                      │  │
│  │ Last run: Oct 22, 4:30 PM ✓         │  │
│  │ [Edit] [Logs] [Disable]            │  │
│  └──────────────────────────────────────┘  │
├─────────────────────────────────────────────┤
│  Templates                                   │
│  • Daily planning routine                   │
│  • Weekly review automation                 │
│  • Meeting follow-up workflow               │
└─────────────────────────────────────────────┘
```

**Features:**
- Visual workflow builder
- Trigger options (time, event, manual)
- Multiple actions per workflow
- Conditional logic
- Error handling
- Test mode
- Execution logs
- Enable/disable workflows
- Template library

---

### 8. Settings & Preferences Screen

**Route:** `/settings`  
**Status:** ❌ Not implemented

**Purpose:** User preferences, integrations, and account settings

**Components Needed:**
```
SettingsPage/
├── SettingsTabs.tsx          # Navigation tabs
├── ProfileSettings.tsx       # User profile
├── PreferencesSettings.tsx   # App preferences
├── IntegrationSettings.tsx   # External services
├── NotificationSettings.tsx  # Notification preferences
├── PrivacySettings.tsx       # Privacy and data
├── MCPSettings.tsx           # MCP server configuration
├── ThemeSettings.tsx         # Appearance
└── AboutSettings.tsx         # Version, support
```

**Layout:**
```
┌─────────────────────────────────────────────┐
│  Settings                                    │
├───────┬─────────────────────────────────────┤
│Profile│  Profile                             │
│Prefs  │  ┌────────────────────────────────┐ │
│Integr │  │ Name: [User Name            ] │ │
│Notif  │  │ Email: [user@example.com    ] │ │
│Privacy│  │                                │ │
│Theme  │  │ [Change password]              │ │
│MCP    │  │ [Update profile picture]       │ │
│About  │  └────────────────────────────────┘ │
│       │                                     │
│       │  Preferences                        │
│       │  ┌────────────────────────────────┐ │
│       │  │ Working hours:                 │ │
│       │  │ Start: [9:00 AM ▼]            │ │
│       │  │ End: [5:00 PM ▼]              │ │
│       │  │                                │ │
│       │  │ Time zone: [EST ▼]            │ │
│       │  │ Date format: [MM/DD/YYYY ▼]   │ │
│       │  │                                │ │
│       │  │ ☑ Enable AI suggestions       │ │
│       │  │ ☑ Auto-organize tasks         │ │
│       │  │ ☐ Voice input                 │ │
│       │  └────────────────────────────────┘ │
│       │                                     │
│       │  [Save changes]                     │
└───────┴─────────────────────────────────────┘
```

**Tabs & Features:**

**Profile:**
- Name, email, avatar
- Password management
- Account security

**Preferences:**
- Working hours
- Time zone
- Language
- Date/time format
- Keyboard shortcuts

**Integrations:**
- Google Calendar sync
- Gmail connection
- Microsoft 365
- Notion sync
- Slack integration

**Notifications:**
- Email notifications
- Push notifications
- Reminder settings
- Notification quiet hours

**Privacy:**
- Data export
- Data deletion
- Privacy policy
- Terms of service

**MCP Configuration:**
- MCP server status
- Tool permissions
- Action logs
- Debug mode

**Theme:**
- Light/dark mode
- Accent color
- Font size
- Compact/comfortable view

---

### 9. Onboarding / Welcome Screen

**Route:** `/welcome` or `/onboarding`  
**Status:** ❌ Not implemented

**Purpose:** First-time user setup and introduction

**Components Needed:**
```
OnboardingPage/
├── WelcomeSlide.tsx          # Introduction
├── SetupProfile.tsx          # Basic profile setup
├── ConnectServices.tsx       # Optional integrations
├── TourComponent.tsx         # Feature tour
├── PreferencesSetup.tsx      # Initial preferences
└── GetStartedCTA.tsx         # Final CTA
```

**Layout (Slide 1):**
```
┌─────────────────────────────────────────────┐
│                                             │
│              Welcome to Zynqo AI            │
│                                             │
│          Your Personal AI Assistant         │
│                                             │
│     [Illustration: AI Assistant helping]    │
│                                             │
│  Get more done with less effort. Zynqo AI  │
│  helps you manage tasks, plan your day,    │
│  understand documents, and automate your   │
│  workflows.                                 │
│                                             │
│                                             │
│         [Skip tour] [Get started →]         │
│                                             │
│                 ● ○ ○ ○                     │
└─────────────────────────────────────────────┘
```

**Features:**
- Multi-step wizard
- Skip option
- Profile setup
- Service connections
- Interactive tour
- Sample data option

---

### 10. Search / Global Search Screen

**Route:** Overlay (Cmd/Ctrl + K)  
**Status:** ❌ Not implemented

**Purpose:** Universal search across all content

**Components Needed:**
```
SearchOverlay/
├── SearchModal.tsx           # Modal container
├── SearchInput.tsx           # Search field with shortcuts
├── SearchResults.tsx         # Grouped results
├── ResultItem.tsx            # Individual result
├── RecentSearches.tsx        # Quick access to recent
├── SearchFilters.tsx         # Filter by type
└── QuickActions.tsx          # Quick action shortcuts
```

**Layout:**
```
┌─────────────────────────────────────────────┐
│  [🔍 Search or type a command...       ⌘K] │
├─────────────────────────────────────────────┤
│  Tasks (3)                                   │
│  • Review project proposal                  │
│  • Team meeting prep                        │
│  • Reply to emails                          │
│                                             │
│  Documents (2)                              │
│  • Q3 Report.pdf                           │
│  • Project Proposal.docx                   │
│                                             │
│  Events (1)                                 │
│  • Client call - Oct 24, 4:00 PM          │
│                                             │
│  Quick Actions                              │
│  • Add task                                │
│  • New event                               │
│  • Upload document                         │
└─────────────────────────────────────────────┘
```

**Features:**
- Fuzzy search
- Keyboard navigation
- Search history
- Quick actions
- Jump to results
- Filter by type
- Command palette

---

## 📱 Responsive Design Requirements

All screens must be responsive and work on:

### Desktop (1920x1080+)
- Full sidebar navigation
- Multi-column layouts
- Expanded views

### Tablet (768px - 1024px)
- Collapsible sidebar
- 2-column layouts
- Touch-optimized controls

### Mobile (320px - 767px)
- Bottom navigation
- Single-column layouts
- Drawer menus
- Swipe gestures
- Mobile-optimized inputs

---

## 🎨 Design System Components

### Core UI Components Needed

**Layout:**
- `Sidebar` - Main navigation
- `Header` - Page headers
- `Container` - Content wrapper
- `Grid` - Responsive grid
- `Stack` - Vertical/horizontal stack

**Navigation:**
- `NavItem` - Sidebar navigation item
- `Tabs` - Tab navigation
- `Breadcrumbs` - Navigation trail
- `Pagination` - Page navigation

**Forms:**
- `Input` - Text input
- `TextArea` - Multi-line input
- `Select` - Dropdown selector
- `Checkbox` - Checkbox input
- `Radio` - Radio button
- `DatePicker` - Date selector
- `TimePicker` - Time selector
- `FileUpload` - File upload component

**Feedback:**
- `Button` - Primary/secondary buttons
- `Badge` - Status badges
- `Tag` - Category tags
- `Alert` - Alert messages
- `Toast` - Toast notifications
- `Modal` - Modal dialogs
- `Tooltip` - Hover tooltips
- `Spinner` - Loading indicators
- `Progress` - Progress bars

**Data Display:**
- `Card` - Content cards
- `Table` - Data tables
- `List` - Item lists
- `Avatar` - User avatars
- `Icon` - Icon components
- `Stat` - Statistic display
- `Timeline` - Event timeline
- `Chart` - Data visualization

**Interactive:**
- `Dropdown` - Dropdown menus
- `Menu` - Context menus
- `Popover` - Popover content
- `Drawer` - Side drawer
- `Accordion` - Collapsible sections
- `DragDrop` - Drag and drop zones

---

## 🎯 Priority Order for Implementation

### Phase 1: Core Screens (MVP)
1. **Dashboard** - Central hub
2. **Chat Interface** - AI interaction
3. **Task Management** - Core functionality
4. **Settings** - Basic configuration

### Phase 2: Extended Features
5. **Calendar/Planner** - Schedule management
6. **Documents** - Document handling
7. **Email** - Communication assistant

### Phase 3: Advanced Features
8. **Automation** - Workflow builder
9. **Search** - Universal search
10. **Onboarding** - User introduction

---

## 🔗 Navigation Structure

```
Zynqo AI
├── Dashboard (/)
├── Chat (/chat) - Can be sidebar
├── Tasks (/tasks)
│   ├── List view
│   ├── Kanban view
│   └── Calendar view
├── Calendar (/calendar)
│   ├── Day view
│   ├── Week view
│   └── Month view
├── Documents (/documents)
│   ├── All documents
│   └── Document viewer
├── Email (/email)
│   ├── Compose
│   ├── Drafts
│   └── Templates
├── Automation (/automation)
│   ├── Workflows
│   └── Templates
└── Settings (/settings)
    ├── Profile
    ├── Preferences
    ├── Integrations
    ├── Notifications
    ├── Privacy
    ├── MCP
    └── Theme
```

---

## 🎨 Color Scheme (Current Implementation)

```css
Primary: #655BDF (Purple)
Secondary: #6258DB
Background: #F6F7FB (Light gray)
Surface: #FFFFFF (White)
Text Primary: #292C40 (Dark gray)
Text Secondary: #85899F (Medium gray)
Text Muted: #9DA1B2 (Light gray)
Accent: #E5A445 (Orange/Yellow)
Success: #4CAF50
Warning: #FFC107
Error: #F44336
```

---

## ✅ Implementation Checklist

### Immediate Actions
- [ ] Separate existing code into components
- [ ] Set up Prisma database schema
- [ ] Implement MCP `/mcp` endpoint
- [ ] Create MCP client library
- [ ] Build reusable UI component library

### Screen Implementation
- [ ] Refactor Dashboard
- [ ] Enhance Chat Interface with MCP
- [ ] Build proper Task Management
- [ ] Create Calendar/Planner
- [ ] Build Document Management
- [ ] Implement Email Assistant
- [ ] Create Automation Builder
- [ ] Build Settings page
- [ ] Create Onboarding flow
- [ ] Implement Global Search

### Integration
- [ ] Connect all screens to PostgreSQL
- [ ] Integrate MCP tools in chat
- [ ] Add authentication
- [ ] Implement real-time updates
- [ ] Add error handling
- [ ] Add loading states
- [ ] Add empty states

---

This document serves as the complete UI specification for Zynqo AI. All screens should follow these designs while adapting to user needs and feedback.
