import type {
  DocumentCreateRequest,
  EventCreateRequest,
  TaskCreateRequest,
  TaskUpdateRequest,
  ApiResponse,
} from "@/lib/types";

type RemoteTask = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
};
type RemoteEvent = {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  location: string | null;
};
type RemoteDocument = {
  id: string;
  title: string;
  content: string;
  summary: string | null;
  createdAt: string;
};

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  const body = (await response.json()) as ApiResponse<T>;

  if (!response.ok || body.error || body.data === undefined) {
    throw new Error(body.error || `Request failed with status ${response.status}`);
  }

  return body.data;
}

export const api = {
  mcp: {
    call: async (name: string, args: Record<string, unknown>) => {
      const response = await fetch("/api/mcp-client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, arguments: args }),
      });
      const body = (await response.json()) as { text?: string; error?: string };
      if (!response.ok || body.error) {
        throw new Error(body.error || `MCP request failed with status ${response.status}`);
      }
      return body.text || "MCP operation completed.";
    },
  },
  auth: {
    logout: () => request<{ success: true }>("/api/auth/sign-out", { method: "POST" }),
  },
  users: {
    list: () => request<Array<{ id: string; email: string; name: string | null }>>("/api/users"),
  },
  tasks: {
    list: (userId: string) => request<RemoteTask[]>("/api/tasks?userId=" + encodeURIComponent(userId)),
    create: (data: TaskCreateRequest) =>
      request<RemoteTask>("/api/tasks", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: TaskUpdateRequest) =>
      request<RemoteTask>(`/api/tasks/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    remove: (id: string) =>
      request<{ success: true }>(`/api/tasks/${id}`, { method: "DELETE" }),
  },
  events: {
    list: (userId: string) => request<RemoteEvent[]>(`/api/events?userId=${encodeURIComponent(userId)}`),
    create: (data: EventCreateRequest) =>
      request<RemoteEvent>("/api/events", { method: "POST", body: JSON.stringify(data) }),
  },
  documents: {
    list: (userId: string) =>
      request<RemoteDocument[]>(`/api/documents?userId=${encodeURIComponent(userId)}`),
    create: (data: DocumentCreateRequest) =>
      request<RemoteDocument>("/api/documents", { method: "POST", body: JSON.stringify(data) }),
  },
};
