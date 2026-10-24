import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/password";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@zynqo.ai" },
    update: { name: "Zynqo Demo User", passwordHash: hashPassword("DemoPass123!") },
    create: {
      email: "demo@zynqo.ai",
      name: "Zynqo Demo User",
      passwordHash: hashPassword("DemoPass123!"),
    },
  });

  await prisma.task.deleteMany({ where: { userId: user.id } });
  await prisma.event.deleteMany({ where: { userId: user.id } });
  await prisma.document.deleteMany({ where: { userId: user.id } });
  await prisma.email.deleteMany({ where: { userId: user.id } });
  await prisma.workflow.deleteMany({ where: { userId: user.id } });

  await prisma.task.createMany({
    data: [
      {
        title: "Review Q3 performance report",
        description: "Summarize the operational improvements for the team review.",
        status: "todo",
        priority: "high",
        dueDate: new Date("2026-10-25T17:00:00.000Z"),
        userId: user.id,
      },
      {
        title: "Prepare sprint planning notes",
        description: "Collect open questions and assign owners before the planning meeting.",
        status: "in-progress",
        priority: "medium",
        dueDate: new Date("2026-10-27T14:00:00.000Z"),
        userId: user.id,
      },
      {
        title: "Archive completed project documents",
        status: "done",
        priority: "low",
        userId: user.id,
      },
    ],
  });

  await prisma.event.createMany({
    data: [
      {
        title: "Engineering team standup",
        description: "Daily progress and blockers.",
        startTime: new Date("2026-10-26T09:00:00.000Z"),
        endTime: new Date("2026-10-26T09:30:00.000Z"),
        location: "Google Meet",
        userId: user.id,
      },
      {
        title: "Q3 performance review",
        startTime: new Date("2026-10-27T15:00:00.000Z"),
        endTime: new Date("2026-10-27T16:00:00.000Z"),
        location: "Conference Room 4B",
        userId: user.id,
      },
    ],
  });

  await prisma.document.createMany({
    data: [
      {
        title: "Q3 Performance Report",
        content:
          "Task completion turnaround improved by 38 percent after MCP workflows were introduced. Infrastructure costs decreased by 14 percent.",
        summary: "Q3 operational and engineering performance summary.",
        userId: user.id,
      },
      {
        title: "Sprint 42 Proposal",
        content:
          "Sprint 42 focuses on persistent task storage, calendar coordination, and reliable MCP tool execution.",
        summary: "Proposal for the next product sprint.",
        userId: user.id,
      },
    ],
  });

  await prisma.email.create({
    data: {
      from: "team@zynqo.ai",
      to: user.email,
      subject: "Welcome to your Zynqo workspace",
      body: "Your demo workspace is ready with tasks, events, and documents.",
      userId: user.id,
    },
  });

  await prisma.workflow.create({
    data: {
      name: "Morning Focus Briefing",
      description: "Review calendar conflicts and surface the top priorities.",
      trigger: { type: "schedule", config: { time: "08:00", weekdays: true } },
      actions: [{ type: "task", config: { operation: "prioritize" } }],
      userId: user.id,
    },
  });

  const additionalUsers = [
    {
      email: "sarah@zynqo.ai",
      name: "Sarah Khan",
      task: "Prepare product roadmap",
      document: "Product Roadmap",
    },
    {
      email: "marcus@zynqo.ai",
      name: "Marcus Lee",
      task: "Review client architecture",
      document: "Client Architecture Notes",
    },
  ];

  for (const profile of additionalUsers) {
    const additionalUser = await prisma.user.upsert({
      where: { email: profile.email },
      update: { name: profile.name, passwordHash: hashPassword("DemoPass123!") },
      create: { email: profile.email, name: profile.name, passwordHash: hashPassword("DemoPass123!") },
    });

    await prisma.task.deleteMany({ where: { userId: additionalUser.id } });
    await prisma.event.deleteMany({ where: { userId: additionalUser.id } });
    await prisma.document.deleteMany({ where: { userId: additionalUser.id } });
    await prisma.email.deleteMany({ where: { userId: additionalUser.id } });
    await prisma.workflow.deleteMany({ where: { userId: additionalUser.id } });

    await prisma.task.create({
      data: {
        title: profile.task,
        description: `Workspace task for ${profile.name}.`,
        priority: "high",
        status: "todo",
        userId: additionalUser.id,
      },
    });
    await prisma.event.create({
      data: {
        title: `${profile.name}'s planning session`,
        startTime: new Date("2026-10-28T10:00:00.000Z"),
        endTime: new Date("2026-10-28T11:00:00.000Z"),
        location: "Google Meet",
        userId: additionalUser.id,
      },
    });
    await prisma.document.create({
      data: {
        title: profile.document,
        content: `Private workspace notes belonging to ${profile.name}.`,
        summary: `Document for ${profile.name}.`,
        userId: additionalUser.id,
      },
    });
    await prisma.email.create({
      data: {
        from: "team@zynqo.ai",
        to: profile.email,
        subject: "Workspace update",
        body: `Hello ${profile.name}, your workspace is ready.`,
        userId: additionalUser.id,
      },
    });
    await prisma.workflow.create({
      data: {
        name: "Daily workspace briefing",
        description: "Summarize priorities for the day.",
        trigger: { type: "schedule", config: { time: "08:00" } },
        actions: [{ type: "task", config: { operation: "summarize" } }],
        userId: additionalUser.id,
      },
    });
  }

  const [taskCount, eventCount, documentCount] = await Promise.all([
    prisma.task.count({ where: { userId: user.id } }),
    prisma.event.count({ where: { userId: user.id } }),
    prisma.document.count({ where: { userId: user.id } }),
  ]);

  console.log(
    JSON.stringify(
      {
        userId: user.id,
        email: user.email,
        counts: { tasks: taskCount, events: eventCount, documents: documentCount },
      },
      null,
      2,
    ),
  );
}

try {
  await main();
} finally {
  await prisma.$disconnect();
}
