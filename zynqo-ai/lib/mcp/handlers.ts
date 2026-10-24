// MCP Tool Handlers - Business logic for each MCP tool
import prisma from "@/lib/prisma";
import type {
  CreateTaskInput,
  UpdateTaskInput,
  ListTasksInput,
  DeleteTaskInput,
  CreateEventInput,
  ListEventsInput,
  CreateDocumentInput,
  SearchDocumentsInput,
} from "./tools";

// Task Handlers
export async function handleCreateTask(input: CreateTaskInput) {
  const task = await prisma.task.create({
    data: {
      title: input.title,
      description: input.description || null,
      status: input.status,
      priority: input.priority,
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
      userId: input.userId,
    },
  });

  return {
    type: "text" as const,
    text: `Task created successfully with ID: ${task.id}`,
  };
}

export async function handleUpdateTask(input: UpdateTaskInput) {
  const updateData: {
    title?: string;
    description?: string | null;
    status?: string;
    priority?: string;
    dueDate?: Date | null;
  } = {};

  if (input.title !== undefined) updateData.title = input.title;
  if (input.description !== undefined) updateData.description = input.description || null;
  if (input.status !== undefined) updateData.status = input.status;
  if (input.priority !== undefined) updateData.priority = input.priority;
  if (input.dueDate !== undefined) updateData.dueDate = input.dueDate ? new Date(input.dueDate) : null;

  const existingTask = await prisma.task.findFirst({
    where: { id: input.id, userId: input.userId },
  });
  if (!existingTask) throw new Error("Task not found");

  const task = await prisma.task.update({
    where: { id: input.id },
    data: updateData,
  });

  return {
    type: "text" as const,
    text: `Task ${task.id} updated successfully`,
  };
}

export async function handleListTasks(input: ListTasksInput) {
  const where: {
    userId: string;
    status?: string;
    priority?: string;
  } = { userId: input.userId };

  if (input.status) where.status = input.status;
  if (input.priority) where.priority = input.priority;

  const tasks = await prisma.task.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return {
    type: "text" as const,
    text: JSON.stringify(tasks, null, 2),
  };
}

export async function handleDeleteTask(input: DeleteTaskInput) {
  await prisma.task.deleteMany({
    where: { id: input.id, userId: input.userId },
  });

  return {
    type: "text" as const,
    text: `Task ${input.id} deleted successfully`,
  };
}

// Event Handlers
export async function handleCreateEvent(input: CreateEventInput) {
  const event = await prisma.event.create({
    data: {
      title: input.title,
      description: input.description || null,
      startTime: new Date(input.startTime),
      endTime: new Date(input.endTime),
      location: input.location || null,
      userId: input.userId,
    },
  });

  return {
    type: "text" as const,
    text: `Event created successfully with ID: ${event.id}`,
  };
}

export async function handleListEvents(input: ListEventsInput) {
  const where: {
    userId: string;
    startTime?: { gte?: Date; lte?: Date };
  } = { userId: input.userId };

  if (input.startDate || input.endDate) {
    where.startTime = {};
    if (input.startDate) where.startTime.gte = new Date(input.startDate);
    if (input.endDate) where.startTime.lte = new Date(input.endDate);
  }

  const events = await prisma.event.findMany({
    where,
    orderBy: { startTime: "asc" },
  });

  return {
    type: "text" as const,
    text: JSON.stringify(events, null, 2),
  };
}

// Document Handlers
export async function handleCreateDocument(input: CreateDocumentInput) {
  const document = await prisma.document.create({
    data: {
      title: input.title,
      content: input.content,
      summary: input.summary || null,
      userId: input.userId,
    },
  });

  return {
    type: "text" as const,
    text: `Document created successfully with ID: ${document.id}`,
  };
}

export async function handleSearchDocuments(input: SearchDocumentsInput) {
  const documents = await prisma.document.findMany({
    where: {
      userId: input.userId,
      OR: [
        { title: { contains: input.query, mode: "insensitive" } },
        { content: { contains: input.query, mode: "insensitive" } },
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  return {
    type: "text" as const,
    text: JSON.stringify(documents, null, 2),
  };
}
