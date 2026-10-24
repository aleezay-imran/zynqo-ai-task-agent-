"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

export type Priority = "HIGH" | "MEDIUM" | "LOW";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";

export type Task = {
  id: string;
  title: string;
  description?: string;
  done: boolean;
  priority: Priority;
  status: TaskStatus;
  dueDate: string;
  tags: string[];
  subtasks?: { id: string; title: string; done: boolean }[];
};

export type CalendarEvent = {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  dayIndex: number; // 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri, 5=Sat, 6=Sun
  dateStr: string;
  category: "WORK" | "MEETING" | "FOCUS" | "PERSONAL";
  attendees?: string[];
  location?: string;
};

export type DocumentItem = {
  id: string;
  name: string;
  size: string;
  type: "txt" | "pdf" | "docx" | "xlsx";
  uploadedAt: string;
  content: string;
  summary: string;
  keyPoints: string[];
  actionItems: string[];
};

export type EmailDraft = {
  id: string;
  to: string;
  subject: string;
  body: string;
  tone: "Professional" | "Friendly" | "Concise" | "Formal" | "Assertive";
  updatedAt: string;
};

export type Workflow = {
  id: string;
  name: string;
  description: string;
  trigger: string;
  action: string;
  active: boolean;
  lastRun: string;
  status: "success" | "idle" | "running";
  runCount: number;
};

export type ToolExecution = {
  toolName: string;
  params: Record<string, unknown>;
  status: "running" | "success" | "failed";
  output?: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
  toolExecution?: ToolExecution;
};

type AppContextType = {
  currentUserId: string;
  setCurrentUserId: (id: string) => void;
  users: Array<{ id: string; email: string; name: string | null }>;
  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Search & Modals
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  onboardingOpen: boolean;
  setOnboardingOpen: (open: boolean) => void;
  addTaskModalOpen: boolean;
  setAddTaskModalOpen: (open: boolean) => void;

  // Tasks
  tasks: Task[];
  addTask: (task: Partial<Task> & { title: string }) => void;
  toggleTask: (id: string) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  deleteTask: (id: string) => void;

  // Calendar
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, "id">) => void;

  // Documents
  documents: DocumentItem[];
  addDocument: (doc: Omit<DocumentItem, "id" | "uploadedAt">) => void;
  selectedDoc: DocumentItem | null;
  setSelectedDoc: (doc: DocumentItem | null) => void;

  // Email
  emailDrafts: EmailDraft[];
  activeDraft: EmailDraft;
  updateActiveDraft: (fields: Partial<EmailDraft>) => void;
  saveCurrentDraft: () => void;
  loadDraft: (draft: EmailDraft) => void;

  // Workflows
  workflows: Workflow[];
  toggleWorkflow: (id: string) => void;

  // Chat
  messages: ChatMessage[];
  sendMessage: (text: string) => Promise<void>;
  clearMessages: () => void;
};

const defaultTasks: Task[] = [
  {
    id: "task-1",
    title: "Review project proposal and submit feedback",
    description: "Go over section 3 and budget allocations before team sync.",
    done: false,
    priority: "HIGH",
    status: "TODO",
    dueDate: "Today, 5:00 PM",
    tags: ["work", "urgent"],
    subtasks: [
      { id: "st-1", title: "Read executive summary", done: true },
      { id: "st-2", title: "Check budget table", done: false },
    ],
  },
  {
    id: "task-2",
    title: "Team meeting preparation & slide sync",
    description: "Align with engineering on sprint milestones and MCP tool integrations.",
    done: false,
    priority: "MEDIUM",
    status: "IN_PROGRESS",
    dueDate: "Tomorrow, 2:00 PM",
    tags: ["team", "planning"],
    subtasks: [
      { id: "st-3", title: "Review Jira tickets", done: true },
      { id: "st-4", title: "Draft 3 discussion points", done: true },
      { id: "st-5", title: "Update timeline chart", done: false },
    ],
  },
  {
    id: "task-3",
    title: "Draft weekly client update email",
    description: "Summarize sprint deliverables and scheduled deployment window.",
    done: true,
    priority: "LOW",
    status: "DONE",
    dueDate: "Today, 3:45 PM",
    tags: ["client", "email"],
  },
  {
    id: "task-4",
    title: "Audit PostgreSQL schema and Prisma migrations",
    description: "Verify foreign keys for users, tasks, and mcp_actions tables.",
    done: false,
    priority: "HIGH",
    status: "REVIEW",
    dueDate: "Oct 26, 11:00 AM",
    tags: ["database", "backend"],
  },
  {
    id: "task-5",
    title: "Optimize calendar availability for focus hours",
    description: "Auto-decline conflicting invites on Tuesday mornings.",
    done: false,
    priority: "MEDIUM",
    status: "TODO",
    dueDate: "Oct 27, 4:00 PM",
    tags: ["automation", "calendar"],
  },
];

const defaultEvents: CalendarEvent[] = [
  {
    id: "ev-1",
    title: "Deep Work / Code Focus",
    startTime: "09:00 AM",
    endTime: "11:30 AM",
    dayIndex: 0, // Mon
    dateStr: "Mon, Oct 20",
    category: "FOCUS",
    location: "Desk / Do Not Disturb",
  },
  {
    id: "ev-2",
    title: "Engineering Team Standup",
    startTime: "02:00 PM",
    endTime: "02:45 PM",
    dayIndex: 2, // Wed
    dateStr: "Wed, Oct 22",
    category: "MEETING",
    attendees: ["Sarah (Lead)", "Alex (Product)", "Dev Team"],
    location: "Google Meet",
  },
  {
    id: "ev-3",
    title: "Client Architecture Review Call",
    startTime: "04:00 PM",
    endTime: "05:00 PM",
    dayIndex: 4, // Fri (Today)
    dateStr: "Fri, Oct 24",
    category: "WORK",
    attendees: ["Marcus Vance", "Engineering Council"],
    location: "Zoom #928-110",
  },
  {
    id: "ev-4",
    title: "Product Sprint Planning",
    startTime: "10:00 AM",
    endTime: "11:30 AM",
    dayIndex: 3, // Thu
    dateStr: "Thu, Oct 23",
    category: "MEETING",
    attendees: ["Design & Product Org"],
    location: "Room 4B",
  },
];

const defaultDocuments: DocumentItem[] = [
  {
    id: "doc-1",
    name: "Q3_Performance_Report.pdf",
    size: "2.1 MB",
    type: "pdf",
    uploadedAt: "Oct 20, 2026",
    content: "Q3 Performance Overview: Key results showed a 38% improvement in task completion turnaround after deploying MCP agent workflows. Infrastructure costs decreased by 14% with localized rule optimization.",
    summary: "Comprehensive breakdown of Q3 operational and engineering milestones with a 38% task turnaround boost.",
    keyPoints: [
      "Task completion turnaround improved by 38% following agent deployment.",
      "Infrastructure operational costs reduced by 14%.",
      "Model Context Protocol integration achieved 99.4% uptime in local tests.",
    ],
    actionItems: [
      "Finalize Q4 budget projections by end of month.",
      "Expand MCP tool whitelist for Google Calendar & Gmail endpoints.",
    ],
  },
  {
    id: "doc-2",
    name: "Project_Proposal_Zynqo_v2.docx",
    size: "856 KB",
    type: "docx",
    uploadedAt: "Oct 18, 2026",
    content: "Project Proposal Zynqo AI 2.0: Transitioning from monolithic client mockups to modular production UI with persistent Prisma PostgreSQL schema and MCP tool routing.",
    summary: "Architecture and design proposal for Zynqo AI v2.0 enterprise task orchestration platform.",
    keyPoints: [
      "Replace unstructured inline prototypes with high-density clean component architecture.",
      "Enforce deterministic tool execution states with real-time audit logs.",
    ],
    actionItems: [
      "Review section 4 on permissions and token verification.",
      "Conduct UX review for mobile drawer navigation.",
    ],
  },
  {
    id: "doc-3",
    name: "FY2026_Q4_Budget_Plan.xlsx",
    size: "1.4 MB",
    type: "xlsx",
    uploadedAt: "Oct 15, 2026",
    content: "Financial spreadsheet model outlining compute allocations, API token budgets, and developer tooling licenses.",
    summary: "Financial model allocating $42,000 across cloud compute, MCP server instances, and testing infra.",
    keyPoints: [
      "Total allocated budget: $42,000 for Q4.",
      "Buffer contingency of $6,500 reserved for surge testing.",
    ],
    actionItems: [
      "Confirm sign-off from finance before November 1st.",
    ],
  },
];

const defaultDrafts: EmailDraft[] = [
  {
    id: "draft-1",
    to: "marcus.vance@acmecorp.com",
    subject: "Follow-up: Architecture & MCP Integration Review",
    body: "Hi Marcus,\n\nThank you for taking the time to speak today. I've documented our discussion regarding the Model Context Protocol integration and local task orchestration.\n\nPlease find the revised timeline and deliverable milestones attached for your review. Let me know if you would like to make any adjustments prior to Friday's sprint lock.\n\nBest regards,\nAlex Chen",
    tone: "Professional",
    updatedAt: "Today, 4:15 PM",
  },
  {
    id: "draft-2",
    to: "team@zynqo.internal",
    subject: "Status Update: Sprint 42 Deliverables & Next Steps",
    body: "Hi everyone,\n\nQuick progress update on Sprint 42:\n• All core screen layouts have been modularized and styled.\n• Task management now features dual List and Kanban views.\n• Prisma 8 database client schema is prepared for migration.\n\nPlease test your local environments and file issues under #frontend.\n\nThanks,\nEngineering Team",
    tone: "Concise",
    updatedAt: "Yesterday, 6:00 PM",
  },
];

const defaultWorkflows: Workflow[] = [
  {
    id: "wf-1",
    name: "Morning Focus & Briefing",
    description: "At 8:00 AM daily, checks calendar for conflicts and generates top 3 priority task checklist.",
    trigger: "Schedule (Weekdays 08:00 AM)",
    action: "Run calendar conflict check -> Pin top 3 priorities",
    active: true,
    lastRun: "Today, 8:00 AM",
    status: "success",
    runCount: 48,
  },
  {
    id: "wf-2",
    name: "Auto-Draft Meeting Follow-ups",
    description: "When a calendar event finishes with tagged client, creates a draft email with meeting notes.",
    trigger: "Calendar Event Completed (Client tag)",
    action: "Extract notes -> Draft follow-up email",
    active: true,
    lastRun: "Yesterday, 5:10 PM",
    status: "success",
    runCount: 19,
  },
  {
    id: "wf-3",
    name: "Document Action Items Extractor",
    description: "Automatically parses uploaded documents and converts bulleted action items into tasks.",
    trigger: "New Document Upload",
    action: "OCR & Extract action items -> Add to Tasks (Inbox)",
    active: false,
    lastRun: "Oct 20, 2:30 PM",
    status: "idle",
    runCount: 12,
  },
  {
    id: "wf-4",
    name: "End-of-Day Task Reconciliation",
    description: "At 5:30 PM, moves unfinished tasks to tomorrow's queue and compiles a daily achievement summary.",
    trigger: "Schedule (Daily 05:30 PM)",
    action: "Reorganize queue -> Generate progress report",
    active: true,
    lastRun: "Yesterday, 5:30 PM",
    status: "success",
    runCount: 52,
  },
];

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUserId, setCurrentUserId] = useState("");
  const [users, setUsers] = useState<Array<{ id: string; email: string; name: string | null }>>([]);
  const [activeTab, setActiveTab] = useState<string>("Overview");
  const [searchOpen, setSearchOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);

  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [events, setEvents] = useState<CalendarEvent[]>(defaultEvents);
  const [documents, setDocuments] = useState<DocumentItem[]>(defaultDocuments);
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);

  const [emailDrafts, setEmailDrafts] = useState<EmailDraft[]>(defaultDrafts);
  const [activeDraft, setActiveDraft] = useState<EmailDraft>(defaultDrafts[0]);

  const [workflows, setWorkflows] = useState<Workflow[]>(defaultWorkflows);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      role: "assistant",
      text: "Hello! I am Zynqo, your personal AI agent. I can organize your priorities, schedule calendar time blocks, analyze documents, and draft communications via Model Context Protocol.",
      timestamp: "10:00 AM",
    },
    {
      id: "msg-2",
      role: "user",
      text: "Can you create a high priority task to review the Q3 budget plan before 5pm?",
      timestamp: "10:02 AM",
    },
    {
      id: "msg-3",
      role: "assistant",
      text: "I have added that task to your schedule and flagged it as High Priority. Would you like me to block 45 minutes on your calendar for it as well?",
      timestamp: "10:02 AM",
      toolExecution: {
        toolName: "tasks_createTask",
        params: {
          title: "Review Q3 budget plan",
          priority: "HIGH",
          dueDate: "Today, 5:00 PM",
        },
        status: "success",
        output: "Created task #task-1 in database with priority: HIGH",
      },
    },
  ]);

  useEffect(() => {
    let cancelled = false;
    async function loadWorkspace() {
      try {
        const availableUsers = await api.users.list();
        if (cancelled || availableUsers.length === 0) return;
        const savedUserId = localStorage.getItem("zynqo_current_user");
        const selectedUser = availableUsers.find((user) => user.id === savedUserId) || availableUsers[0];
        setUsers(availableUsers);
        setCurrentUserId(selectedUser.id);
      } catch (error) {
        console.error("Unable to load users:", error);
      }
    }
    void loadWorkspace();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!currentUserId) return;
    localStorage.setItem("zynqo_current_user", currentUserId);
    let cancelled = false;
    async function loadUserData() {
      try {
        const [remoteTasks, remoteEvents, remoteDocuments] = await Promise.all([
          api.tasks.list(currentUserId),
          api.events.list(currentUserId),
          api.documents.list(currentUserId),
        ]);
        if (cancelled) return;
        setTasks(remoteTasks.map((task) => ({
          id: task.id,
          title: task.title,
          description: task.description || "",
          done: task.status === "done",
          priority: task.priority.toUpperCase() as Priority,
          status: task.status === "in-progress" ? "IN_PROGRESS" : task.status.toUpperCase() as TaskStatus,
          dueDate: task.dueDate ? new Date(task.dueDate).toLocaleString() : "",
          tags: [],
        })));
        setEvents(remoteEvents.map((event) => {
          const start = new Date(event.startTime);
          const end = new Date(event.endTime);
          return {
            id: event.id,
            title: event.title,
            startTime: start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            endTime: end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            dayIndex: (start.getDay() + 6) % 7,
            dateStr: start.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" }),
            category: "MEETING" as const,
            location: event.location || undefined,
          };
        }));
        setDocuments(remoteDocuments.map((document) => ({
          id: document.id,
          name: document.title,
          size: "Indexed",
          type: "txt" as const,
          uploadedAt: new Date(document.createdAt).toLocaleDateString(),
          content: document.content,
          summary: document.summary || "",
          keyPoints: [],
          actionItems: [],
        })));
      } catch (error) {
        console.error("Unable to load workspace data:", error);
      }
    }
    void loadUserData();
    return () => {
      cancelled = true;
    };
  }, [currentUserId]);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem("zynqo_tasks");
      if (storedTasks) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTasks(JSON.parse(storedTasks));
      }

      const storedDrafts = localStorage.getItem("zynqo_drafts");
      if (storedDrafts) {
        const parsed = JSON.parse(storedDrafts);
        setEmailDrafts(parsed);
        if (parsed[0]) setActiveDraft(parsed[0]);
      }

      const hasSeenTour = localStorage.getItem("zynqo_has_seen_tour");
      if (!hasSeenTour) {
        // Only trigger once
        localStorage.setItem("zynqo_has_seen_tour", "true");
      }
    } catch {
      // LocalStorage fallback
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("zynqo_tasks", JSON.stringify(tasks));
    } catch {}
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem("zynqo_drafts", JSON.stringify(emailDrafts));
    } catch {}
  }, [emailDrafts]);

  // Global keyboard shortcuts (Ctrl+K or Cmd+K)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Task Actions
  function addTask(newTask: Partial<Task> & { title: string }) {
    const task: Task = {
      id: `task-${Date.now()}`,
      title: newTask.title.trim(),
      description: newTask.description || "",
      done: false,
      priority: newTask.priority || "MEDIUM",
      status: newTask.status || "TODO",
      dueDate: newTask.dueDate || "Today, 5:00 PM",
      tags: newTask.tags && newTask.tags.length > 0 ? newTask.tags : ["general"],
      subtasks: newTask.subtasks || [],
    };
    setTasks((prev) => [task, ...prev]);
    if (currentUserId) {
      void api.tasks.create({
        title: task.title,
        description: task.description,
        status: task.status === "IN_PROGRESS" ? "in-progress" : task.status.toLowerCase(),
        priority: task.priority.toLowerCase(),
        userId: currentUserId,
      }).then((saved) => {
        setTasks((prev) => prev.map((item) => item.id === task.id ? { ...item, id: saved.id } : item));
      }).catch((error) => console.error("Unable to save task:", error));
    }
  }

  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              done: !t.done,
              status: !t.done ? "DONE" : "TODO",
            }
          : t
      )
    );
    if (currentUserId) {
      const task = tasks.find((item) => item.id === id);
      if (task) void api.tasks.update(id, { status: task.done ? "todo" : "done" }).catch((error) => console.error("Unable to update task:", error));
    }
  }

  function updateTaskStatus(id: string, status: TaskStatus) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status,
              done: status === "DONE",
            }
          : t
      )
    );
    if (currentUserId) void api.tasks.update(id, {
      status: status === "IN_PROGRESS" ? "in-progress" : status.toLowerCase(),
    }).catch((error) => console.error("Unable to update task:", error));
  }

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (currentUserId) void api.tasks.remove(id).catch((error) => console.error("Unable to delete task:", error));
  }

  // API Functions for backend integration
  async function fetchTasksFromAPI(userId: string) {
    try {
      const response = await fetch(`/api/tasks?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        return data.data || [];
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
    return [];
  }

  async function createTaskAPI(taskData: {
    title: string;
    description?: string;
    priority?: string;
    status?: string;
    dueDate?: string;
    userId: string;
  }) {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      if (response.ok) {
        const data = await response.json();
        return data.data;
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
    return null;
  }

  async function fetchEventsFromAPI(userId: string) {
    try {
      const response = await fetch(`/api/events?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        return data.data || [];
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
    return [];
  }

  async function createEventAPI(eventData: {
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    location?: string;
    userId: string;
  }) {
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });
      if (response.ok) {
        const data = await response.json();
        return data.data;
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }
    return null;
  }

  async function fetchDocumentsFromAPI(userId: string) {
    try {
      const response = await fetch(`/api/documents?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        return data.data || [];
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
    return [];
  }

  async function createDocumentAPI(docData: {
    title: string;
    content: string;
    summary?: string;
    userId: string;
  }) {
    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(docData),
      });
      if (response.ok) {
        const data = await response.json();
        return data.data;
      }
    } catch (error) {
      console.error("Error creating document:", error);
    }
    return null;
  }

  // Calendar Actions
  function addEvent(ev: Omit<CalendarEvent, "id">) {
    const newEvent: CalendarEvent = {
      ...ev,
      id: `ev-${Date.now()}`,
    };
    setEvents((prev) => [...prev, newEvent]);
    if (currentUserId) void api.events.create({
      title: ev.title,
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      location: ev.location,
      userId: currentUserId,
    }).catch((error) => console.error("Unable to save event:", error));
  }

  // Document Actions
  function addDocument(doc: Omit<DocumentItem, "id" | "uploadedAt">) {
    const newDoc: DocumentItem = {
      ...doc,
      id: `doc-${Date.now()}`,
      uploadedAt: "Today, just now",
    };
    setDocuments((prev) => [newDoc, ...prev]);
    setSelectedDoc(newDoc);
    if (currentUserId) void api.documents.create({
      title: doc.name,
      content: doc.content,
      summary: doc.summary,
      userId: currentUserId,
    }).catch((error) => console.error("Unable to save document:", error));
  }

  // Email Actions
  function updateActiveDraft(fields: Partial<EmailDraft>) {
    setActiveDraft((prev) => ({ ...prev, ...fields }));
  }

  function saveCurrentDraft() {
    setEmailDrafts((prev) => {
      const exists = prev.some((d) => d.id === activeDraft.id);
      if (exists) {
        return prev.map((d) => (d.id === activeDraft.id ? activeDraft : d));
      }
      return [activeDraft, ...prev];
    });
  }

  function loadDraft(draft: EmailDraft) {
    setActiveDraft(draft);
  }

  // Workflow Actions
  function toggleWorkflow(id: string) {
    setWorkflows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, active: !w.active } : w))
    );
  }

  // Chat Actions
  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);

    const lower = trimmed.toLowerCase();

    if (currentUserId) {
      try {
        const response = await fetch("/api/agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ message: trimmed }),
        });
        const data = (await response.json()) as {
          reply?: string;
          error?: string;
          toolExecutions?: Array<{ toolName: string; params: Record<string, unknown>; output: string }>;
        };
        if (!response.ok) throw new Error(data.error || "Agent request failed.");
        const execution = data.toolExecutions?.[0];
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now() + 1}`,
            role: "assistant",
            text: data.reply || "Action completed.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            ...(execution ? {
              toolExecution: {
                toolName: execution.toolName,
                params: execution.params,
                status: "success" as const,
                output: execution.output,
              },
            } : {}),
          },
        ]);
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now() + 1}`,
            role: "assistant",
            text: error instanceof Error ? error.message : "The agent request failed.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
      return;
    }

    // Natural Language Tool Execution Simulation
    if (lower.startsWith("add task") || lower.startsWith("create task") || lower.includes("remind me to")) {
      const cleanTitle = trimmed
        .replace(/^(please\s+)?(add|create|make)\s+(a\s+)?(task|todo|to-do)(\s+to)?/i, "")
        .replace(/^remind me to\s+/i, "")
        .trim();

      const priority: Priority = lower.includes("urgent") || lower.includes("high") ? "HIGH" : "MEDIUM";
      const due = lower.includes("tomorrow") ? "Tomorrow, 2:00 PM" : "Today, 5:00 PM";

      const createdTitle = cleanTitle || "New AI Scheduled Task";
      if (currentUserId) {
        try {
          const output = await api.mcp.call("create-task", {
            title: createdTitle,
            priority: priority.toLowerCase(),
            status: "todo",
            userId: currentUserId,
          });
          const taskId = output.match(/ID:\s*([^\s]+)/i)?.[1] || `mcp-task-${Date.now()}`;
          setTasks((prev) => [
            {
              id: taskId,
              title: createdTitle,
              description: "",
              done: false,
              priority,
              status: "TODO",
              dueDate: due,
              tags: ["agent", priority.toLowerCase()],
              subtasks: [],
            },
            ...prev,
          ]);
          setMessages((prev) => [
            ...prev,
            {
              id: `msg-${Date.now() + 1}`,
              role: "assistant",
              text: `I've created the task "${createdTitle}" with ${priority} priority through MCP.`,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              toolExecution: {
                toolName: "create-task",
                params: { title: createdTitle, priority: priority.toLowerCase(), status: "todo" },
                status: "success",
                output,
              },
            },
          ]);
        } catch (error) {
          setMessages((prev) => [
            ...prev,
            {
              id: `msg-${Date.now() + 1}`,
              role: "assistant",
              text: error instanceof Error ? error.message : "The MCP task operation failed.",
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              toolExecution: {
                toolName: "create-task",
                params: { title: createdTitle },
                status: "failed",
                output: "MCP operation failed.",
              },
            },
          ]);
        }
        return;
      }

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now() + 1}`,
            role: "assistant",
            text: `I've created the task "${createdTitle}" with ${priority} priority for you.`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            toolExecution: {
              toolName: "tasks_createTask",
              params: { title: createdTitle, priority, dueDate: due },
              status: "success",
              output: `Task created and indexed into local workspace.`,
            },
          },
        ]);
      }, 500);
      return;
    }

    if (currentUserId && (lower.includes("list my tasks") || lower.includes("show my tasks") || lower === "list tasks")) {
      try {
        const output = await api.mcp.call("list-tasks", { userId: currentUserId });
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now() + 1}`,
            role: "assistant",
            text: output === "[]" ? "You have no tasks." : `Here are your tasks:\n\n${output}`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            toolExecution: {
              toolName: "list-tasks",
              params: {},
              status: "success",
              output: "Tasks loaded from the authenticated MCP workspace.",
            },
          },
        ]);
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now() + 1}`,
            role: "assistant",
            text: error instanceof Error ? error.message : "The MCP task query failed.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
      return;
    }

    if (lower.includes("plan") || lower.includes("organize my day") || lower.includes("schedule")) {
      const pendingCount = tasks.filter((t) => !t.done).length;
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now() + 1}`,
            role: "assistant",
            text: `Here is your optimized daily schedule based on ${pendingCount} open tasks and 2 scheduled calendar meetings:\n\n1. 09:00 AM - 11:30 AM: Deep Work (Focus on "${tasks[0]?.title || 'Core task'}")\n2. 02:00 PM: Team Standup\n3. 03:00 PM: Task Review & Client follow-up\n4. 04:00 PM: Client Architecture Call\n\nWould you like me to reserve time blocks on your calendar?`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            toolExecution: {
              toolName: "calendar_optimizeSchedule",
              params: { openTasksCount: pendingCount, targetDate: "2026-10-23" },
              status: "success",
              output: "Generated conflict-free 4-slot day plan.",
            },
          },
        ]);
      }, 500);
      return;
    }

    if (lower.includes("summar") || lower.includes("document")) {
      const doc = documents[0];
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now() + 1}`,
            role: "assistant",
            text: doc
              ? `Summary for "${doc.name}":\n\n${doc.summary}\n\nTop Key Points:\n${doc.keyPoints.map((p) => `• ${p}`).join("\n")}`
              : "No documents currently uploaded. Go to the Documents tab to add text or PDF files.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            toolExecution: {
              toolName: "docs_extractSummary",
              params: { documentId: doc ? doc.id : "none" },
              status: doc ? "success" : "failed",
              output: doc ? `Extracted 3 insights from ${doc.name}` : "No file found",
            },
          },
        ]);
      }, 500);
      return;
    }

    if (lower.includes("draft") || lower.includes("email")) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now() + 1}`,
            role: "assistant",
            text: `I've prepared a draft in the Email Assistant for your review: "Follow-up: Architecture & MCP Integration Review". You can switch to the Email tab to polish and send it.`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            toolExecution: {
              toolName: "email_composeDraft",
              params: { recipient: "marcus.vance@acmecorp.com", tone: "Professional" },
              status: "success",
              output: "Draft prepared in queue.",
            },
          },
        ]);
      }, 500);
      return;
    }

    // Default API call fallback
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now() + 1}`,
            role: "assistant",
            text: data.reply || "Action processed successfully.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        return;
      }
    } catch {
      // Fallback response
    }

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          role: "assistant",
          text: `I've registered your request: "${trimmed}". You can also use the workspace screens to review tasks, plan calendar time blocks, analyze documents, and configure automations.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 400);
  }

  function clearMessages() {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        role: "assistant",
        text: "Conversation cleared. What would you like to work on next?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }

  return (
    <AppContext.Provider
      value={{
        currentUserId,
        setCurrentUserId,
        users,
        activeTab,
        setActiveTab,
        searchOpen,
        setSearchOpen,
        onboardingOpen,
        setOnboardingOpen,
        addTaskModalOpen,
        setAddTaskModalOpen,
        tasks,
        addTask,
        toggleTask,
        updateTaskStatus,
        deleteTask,
        events,
        addEvent,
        documents,
        addDocument,
        selectedDoc,
        setSelectedDoc,
        emailDrafts,
        activeDraft,
        updateActiveDraft,
        saveCurrentDraft,
        loadDraft,
        workflows,
        toggleWorkflow,
        messages,
        sendMessage,
        clearMessages,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
