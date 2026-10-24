"use client";

import React, { useState } from "react";
import { useApp, Priority, TaskStatus } from "@/lib/store";
import {
  Plus,
  Search,
  ListIcon,
  Kanban,
  Check,
  Clock,
  Trash2,
  Tag,
  Filter,
} from "@/components/icons/Icons";

export default function TasksScreen() {
  const {
    tasks,
    toggleTask,
    updateTaskStatus,
    deleteTask,
    addTask,
    setAddTaskModalOpen,
  } = useApp();

  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [naturalInput, setNaturalInput] = useState("");

  // Natural Language Task Quick Adder
  function handleNaturalAdd(e: React.FormEvent) {
    e.preventDefault();
    const clean = naturalInput.trim();
    if (!clean) return;

    const lower = clean.toLowerCase();
    const isHigh = lower.includes("urgent") || lower.includes("!high") || lower.includes("asap");
    const priority: Priority = isHigh ? "HIGH" : "MEDIUM";

    addTask({
      title: clean.replace(/!high|urgent|asap/gi, "").trim(),
      priority,
      dueDate: lower.includes("tomorrow") ? "Tomorrow, 2:00 PM" : "Today, 5:00 PM",
      tags: ["quick"],
    });

    setNaturalInput("");
  }

  // Filter logic
  const filteredTasks = tasks.filter((task) => {
    if (filterStatus === "pending" && task.done) return false;
    if (filterStatus === "completed" && !task.done) return false;
    if (filterPriority !== "all" && task.priority !== filterPriority) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = task.title.toLowerCase().includes(q);
      const matchesTag = task.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchesTitle && !matchesTag) return false;
    }
    return true;
  });

  const columns: { status: TaskStatus; title: string; count: number }[] = [
    {
      status: "TODO",
      title: "To Do",
      count: tasks.filter((t) => t.status === "TODO").length,
    },
    {
      status: "IN_PROGRESS",
      title: "In Progress",
      count: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    },
    {
      status: "REVIEW",
      title: "Review",
      count: tasks.filter((t) => t.status === "REVIEW").length,
    },
    {
      status: "DONE",
      title: "Done",
      count: tasks.filter((t) => t.status === "DONE").length,
    },
  ];

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-12">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E8EAF2] rounded-xl p-4">
        <div className="flex items-center gap-3">
          {/* View Mode Switcher */}
          <div className="flex items-center bg-[#F6F7FB] p-1 rounded-lg border border-[#E8EAF2]">
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === "list"
                  ? "bg-white text-[#292C40] shadow-xs font-semibold"
                  : "text-[#70758B] hover:text-[#292C40]"
              }`}
            >
              <ListIcon size={14} />
              <span>List View</span>
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === "kanban"
                  ? "bg-white text-[#292C40] shadow-xs font-semibold"
                  : "text-[#70758B] hover:text-[#292C40]"
              }`}
            >
              <Kanban size={14} />
              <span>Kanban Board</span>
            </button>
          </div>

          <div className="h-4 w-[1px] bg-[#E8EAF2] hidden sm:block" />

          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-1 text-xs">
            {["all", "pending", "completed"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded-md capitalize transition-colors ${
                  filterStatus === st
                    ? "bg-[#EEEDFB] text-[#655BDF] font-semibold"
                    : "text-[#70758B] hover:bg-[#F6F7FB]"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Priority Dropdown */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="text-xs px-2.5 py-1.5 border border-[#E3E5EF] rounded-lg bg-white text-[#292C40] focus:outline-none focus:border-[#655BDF]"
          >
            <option value="all">All Priorities</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* New Task Button */}
          <button
            onClick={() => setAddTaskModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#655BDF] hover:bg-[#5449cf] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Natural Language Task Input Bar */}
      <form
        onSubmit={handleNaturalAdd}
        className="bg-white border border-[#E8EAF2] rounded-xl p-3 flex items-center gap-3 shadow-xs"
      >
        <span className="text-xs font-semibold text-[#655BDF] pl-2 uppercase tracking-wider hidden sm:inline">
          Natural Input:
        </span>
        <input
          type="text"
          value={naturalInput}
          onChange={(e) => setNaturalInput(e.target.value)}
          placeholder="Type in plain English: 'Audit security logs by tomorrow 4pm !high' and press Enter..."
          className="flex-1 text-xs border-0 focus:outline-none text-[#292C40] placeholder-[#9DA1B2]"
        />
        <button
          type="submit"
          className="px-3 py-1.5 bg-[#655BDF] hover:bg-[#5449cf] text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
        >
          Add Task
        </button>
      </form>

      {/* LIST VIEW */}
      {viewMode === "list" && (
        <div className="bg-white border border-[#E8EAF2] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#F0F1F7] flex items-center justify-between">
            <div className="text-xs font-semibold text-[#292C40]">
              Showing {filteredTasks.length} {filteredTasks.length === 1 ? "task" : "tasks"}
            </div>
            <div className="flex items-center gap-2">
              <Search size={14} className="text-[#9DA1B2]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="text-xs border border-[#E3E5EF] rounded-md px-2 py-1 focus:outline-none focus:border-[#655BDF]"
              />
            </div>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#9DA1B2]">
              No tasks match your current filters. Add a task above or reset filters.
            </div>
          ) : (
            <div className="divide-y divide-[#F0F1F7]">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 hover:bg-[#FBFBFE] flex items-start justify-between gap-4 transition-colors group"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        task.done
                          ? "bg-[#16A34A] border-[#16A34A] text-white"
                          : "border-[#D1D5DB] hover:border-[#655BDF] bg-white"
                      }`}
                    >
                      {task.done && <Check size={11} strokeWidth={3} />}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-semibold tracking-tight ${
                            task.done ? "line-through text-[#9DA1B2]" : "text-[#292C40]"
                          }`}
                        >
                          {task.title}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                            task.priority === "HIGH"
                              ? "bg-rose-50 text-rose-600 border border-rose-200"
                              : task.priority === "MEDIUM"
                              ? "bg-amber-50 text-amber-600 border border-amber-200"
                              : "bg-slate-50 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>

                      {task.description && (
                        <p className="text-[11px] text-[#70758B] mt-0.5 leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center gap-3 mt-2 text-[11px] text-[#70758B]">
                        <span className="flex items-center gap-1 font-medium">
                          <Clock size={11} />
                          {task.dueDate}
                        </span>
                        <div className="flex items-center gap-1">
                          {task.tags.map((t) => (
                            <span
                              key={t}
                              className="bg-[#F0F1F7] text-[#70758B] px-1.5 py-0.2 rounded text-[10px]"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                        {task.subtasks && task.subtasks.length > 0 && (
                          <span className="text-[10px] text-[#655BDF] bg-[#EEEDFB] px-1.5 py-0.2 rounded font-medium">
                            {task.subtasks.filter((s) => s.done).length}/{task.subtasks.length} subtasks
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <select
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                      className="text-[11px] px-2 py-1 border border-[#E3E5EF] rounded bg-white text-[#292C40] focus:outline-none"
                    >
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="REVIEW">Review</option>
                      <option value="DONE">Done</option>
                    </select>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1 text-[#9DA1B2] hover:text-rose-500 rounded transition-colors"
                      title="Delete task"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* KANBAN BOARD VIEW */}
      {viewMode === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.status);

            return (
              <div
                key={col.status}
                className="bg-[#F8F9FC] border border-[#E8EAF2] rounded-xl p-3 flex flex-col min-h-[500px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#E8EAF2]">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-[#292C40]">{col.title}</span>
                    <span className="text-[11px] font-mono font-medium bg-white text-[#70758B] border border-[#E8EAF2] px-1.5 py-0.2 rounded-full">
                      {colTasks.length}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      addTask({
                        title: `New ${col.title} task`,
                        status: col.status,
                        priority: "MEDIUM",
                      });
                    }}
                    className="p-1 text-[#70758B] hover:text-[#655BDF] rounded"
                    title={`Add task to ${col.title}`}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Column Card Stack */}
                <div className="space-y-2.5 flex-1 overflow-y-auto">
                  {colTasks.length === 0 ? (
                    <div className="h-28 border border-dashed border-[#DCDFEA] rounded-lg flex items-center justify-center text-xs text-[#9DA1B2]">
                      No items in {col.title}
                    </div>
                  ) : (
                    colTasks.map((task) => (
                      <div
                        key={task.id}
                        className="bg-white border border-[#E8EAF2] hover:border-[#655BDF] rounded-lg p-3 shadow-xs space-y-2 transition-all"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span
                            className={`text-xs font-semibold leading-snug ${
                              task.done ? "line-through text-[#9DA1B2]" : "text-[#292C40]"
                            }`}
                          >
                            {task.title}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase flex-shrink-0 ${
                              task.priority === "HIGH"
                                ? "bg-rose-50 text-rose-600"
                                : task.priority === "MEDIUM"
                                ? "bg-amber-50 text-amber-600"
                                : "bg-slate-50 text-slate-600"
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>

                        {task.description && (
                          <p className="text-[11px] text-[#70758B] line-clamp-2 leading-relaxed">
                            {task.description}
                          </p>
                        )}

                        <div className="pt-2 border-t border-[#F0F1F7] flex items-center justify-between text-[10px] text-[#70758B]">
                          <span className="flex items-center gap-1">
                            <Clock size={10} />
                            {task.dueDate}
                          </span>

                          {/* Quick Move Status Button */}
                          <select
                            value={task.status}
                            onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                            className="bg-[#F6F7FB] border border-[#E3E5EF] rounded px-1.5 py-0.5 text-[10px] text-[#292C40] focus:outline-none"
                          >
                            <option value="TODO">To Do</option>
                            <option value="IN_PROGRESS">In Prog</option>
                            <option value="REVIEW">Review</option>
                            <option value="DONE">Done</option>
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
