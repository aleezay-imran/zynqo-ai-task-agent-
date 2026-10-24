// MCP Tool Schemas using Zod
import { z } from "zod";

// Task Tools
export const createTaskSchema = z.object({
  title: z.string().describe("Title of the task"),
  description: z.string().optional().describe("Detailed description of the task"),
  priority: z.enum(["low", "medium", "high"]).default("medium").describe("Task priority level"),
  status: z.enum(["todo", "in-progress", "done"]).default("todo").describe("Current task status"),
  dueDate: z.string().optional().describe("Due date in ISO 8601 format"),
  userId: z.string().describe("User ID who owns this task"),
});

export const updateTaskSchema = z.object({
  id: z.string().describe("Task ID to update"),
  userId: z.string().describe("Authenticated user ID"),
  title: z.string().optional().describe("New title"),
  description: z.string().optional().describe("New description"),
  priority: z.enum(["low", "medium", "high"]).optional().describe("New priority"),
  status: z.enum(["todo", "in-progress", "done"]).optional().describe("New status"),
  dueDate: z.string().optional().describe("New due date in ISO 8601 format"),
});

export const listTasksSchema = z.object({
  userId: z.string().describe("User ID to filter tasks"),
  status: z.enum(["todo", "in-progress", "done"]).optional().describe("Filter by status"),
  priority: z.enum(["low", "medium", "high"]).optional().describe("Filter by priority"),
});

export const deleteTaskSchema = z.object({
  id: z.string().describe("Task ID to delete"),
  userId: z.string().describe("Authenticated user ID"),
});

// Event Tools
export const createEventSchema = z.object({
  title: z.string().describe("Title of the event"),
  description: z.string().optional().describe("Event description"),
  startTime: z.string().describe("Start time in ISO 8601 format"),
  endTime: z.string().describe("End time in ISO 8601 format"),
  location: z.string().optional().describe("Event location"),
  userId: z.string().describe("User ID who owns this event"),
});

export const listEventsSchema = z.object({
  userId: z.string().describe("User ID to filter events"),
  startDate: z.string().optional().describe("Filter events starting from this date (ISO 8601)"),
  endDate: z.string().optional().describe("Filter events ending before this date (ISO 8601)"),
});

// Document Tools
export const createDocumentSchema = z.object({
  title: z.string().describe("Title of the document"),
  content: z.string().describe("Document content"),
  summary: z.string().optional().describe("Document summary"),
  userId: z.string().describe("User ID who owns this document"),
});

export const searchDocumentsSchema = z.object({
  userId: z.string().describe("User ID to filter documents"),
  query: z.string().describe("Search query to match in title or content"),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type ListTasksInput = z.infer<typeof listTasksSchema>;
export type DeleteTaskInput = z.infer<typeof deleteTaskSchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type ListEventsInput = z.infer<typeof listEventsSchema>;
export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type SearchDocumentsInput = z.infer<typeof searchDocumentsSchema>;

export const toolDefinitions = [
  {
    name: "create-task",
    description: "Create a task for a user.",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string" },
        description: { type: "string" },
        priority: { type: "string", enum: ["low", "medium", "high"] },
        status: { type: "string", enum: ["todo", "in-progress", "done"] },
        dueDate: { type: "string" },
        userId: { type: "string" },
      },
      required: ["title", "userId"],
    },
  },
  {
    name: "update-task",
    description: "Update an existing task.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string" },
        title: { type: "string" },
        description: { type: "string" },
        priority: { type: "string", enum: ["low", "medium", "high"] },
        status: { type: "string", enum: ["todo", "in-progress", "done"] },
        dueDate: { type: "string" },
      },
      required: ["id"],
    },
  },
  {
    name: "list-tasks",
    description: "List a user's tasks.",
    inputSchema: {
      type: "object",
      properties: {
        userId: { type: "string" },
        status: { type: "string", enum: ["todo", "in-progress", "done"] },
        priority: { type: "string", enum: ["low", "medium", "high"] },
      },
      required: ["userId"],
    },
  },
  {
    name: "delete-task",
    description: "Delete a task.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string" } },
      required: ["id"],
    },
  },
  {
    name: "create-event",
    description: "Create a calendar event.",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string" },
        description: { type: "string" },
        startTime: { type: "string" },
        endTime: { type: "string" },
        location: { type: "string" },
        userId: { type: "string" },
      },
      required: ["title", "startTime", "endTime", "userId"],
    },
  },
  {
    name: "list-events",
    description: "List a user's calendar events.",
    inputSchema: {
      type: "object",
      properties: {
        userId: { type: "string" },
        startDate: { type: "string" },
        endDate: { type: "string" },
      },
      required: ["userId"],
    },
  },
  {
    name: "create-document",
    description: "Create a document.",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string" },
        content: { type: "string" },
        summary: { type: "string" },
        userId: { type: "string" },
      },
      required: ["title", "content", "userId"],
    },
  },
  {
    name: "search-documents",
    description: "Search a user's documents.",
    inputSchema: {
      type: "object",
      properties: {
        userId: { type: "string" },
        query: { type: "string" },
      },
      required: ["userId", "query"],
    },
  },
] as const;
