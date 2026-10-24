"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store";
import {
  CheckSquare,
  CalendarIcon,
  FileText,
  Zap,
  Plus,
  ArrowRight,
  Clock,
  Sparkles,
  ChevronRight,
  Check,
  Mail,
} from "@/components/icons/Icons";

export default function DashboardScreen() {
  const {
    tasks,
    events,
    documents,
    workflows,
    toggleTask,
    addTask,
    setActiveTab,
    setAddTaskModalOpen,
    setSelectedDoc,
  } = useApp();

  const [inlineTaskInput, setInlineTaskInput] = useState("");

  const pendingTasks = tasks.filter((t) => !t.done);
  const completedTasks = tasks.filter((t) => t.done);
  const todaysPriorities = tasks.slice(0, 5);

  function handleAddInlineTask(e: React.FormEvent) {
    e.preventDefault();
    if (!inlineTaskInput.trim()) return;
    addTask({
      title: inlineTaskInput.trim(),
      priority: "MEDIUM",
      dueDate: "Today, 5:00 PM",
      tags: ["quick-add"],
    });
    setInlineTaskInput("");
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Welcome Banner - Restrained, clean product card */}
      <div className="bg-white border border-[#E8EAF2] rounded-xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#655BDF] uppercase tracking-wider">
              DAILY INTELLIGENCE BRIEFING
            </span>
            <span className="text-xs text-[#9DA1B2]">·</span>
            <span className="text-xs text-[#70758B]">Friday, October 23, 2026</span>
          </div>
          <h2 className="text-xl font-bold text-[#292C40] mt-1 tracking-tight">
            Good morning, Alex. You have {pendingTasks.length} pending tasks today.
          </h2>
          <p className="text-xs text-[#70758B] mt-1 max-w-2xl leading-relaxed">
            Your earliest calendar event begins at 02:00 PM (Team Standup). Zynqo has scheduled focus blocks for your highest-priority tasks this morning.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setActiveTab("Chat")}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#EEEDFB] hover:bg-[#E5E2FF] text-[#655BDF] text-xs font-semibold rounded-lg transition-colors"
          >
            <Sparkles size={14} />
            <span>AI Day Planner</span>
          </button>
          <button
            onClick={() => setAddTaskModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#655BDF] hover:bg-[#5449cf] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Plus size={14} />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveTab("Tasks")}
          className="bg-white border border-[#E8EAF2] hover:border-[#655BDF] rounded-xl p-4 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#85899F] mb-2">
            <span className="text-xs font-medium">Pending Tasks</span>
            <CheckSquare size={16} className="text-[#655BDF] group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-[#292C40]">{pendingTasks.length}</div>
          <div className="text-[11px] text-[#70758B] mt-1">
            <span className="text-emerald-600 font-medium">{completedTasks.length} completed</span> so far
          </div>
        </div>

        <div
          onClick={() => setActiveTab("Calendar")}
          className="bg-white border border-[#E8EAF2] hover:border-[#655BDF] rounded-xl p-4 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#85899F] mb-2">
            <span className="text-xs font-medium">Events Today</span>
            <CalendarIcon size={16} className="text-[#655BDF] group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-[#292C40]">{events.length}</div>
          <div className="text-[11px] text-[#70758B] mt-1">Next up: 02:00 PM Standup</div>
        </div>

        <div
          onClick={() => setActiveTab("Documents")}
          className="bg-white border border-[#E8EAF2] hover:border-[#655BDF] rounded-xl p-4 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#85899F] mb-2">
            <span className="text-xs font-medium">Indexed Documents</span>
            <FileText size={16} className="text-[#655BDF] group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-[#292C40]">{documents.length}</div>
          <div className="text-[11px] text-[#70758B] mt-1">All summaries active</div>
        </div>

        <div
          onClick={() => setActiveTab("Automation")}
          className="bg-white border border-[#E8EAF2] hover:border-[#655BDF] rounded-xl p-4 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#85899F] mb-2">
            <span className="text-xs font-medium">Active Automations</span>
            <Zap size={16} className="text-[#E5A445] group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-[#292C40]">
            {workflows.filter((w) => w.active).length}
          </div>
          <div className="text-[11px] text-[#70758B] mt-1">Last run: 8:00 AM briefing</div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Priorities & Upcoming Events */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Priorities */}
          <div className="bg-white border border-[#E8EAF2] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-sm text-[#292C40]">Today&apos;s Priorities</h3>
                <p className="text-xs text-[#70758B]">Critical tasks ordered by urgency</p>
              </div>
              <button
                onClick={() => setActiveTab("Tasks")}
                className="text-xs text-[#655BDF] hover:underline font-medium flex items-center gap-1"
              >
                <span>View all ({tasks.length})</span>
                <ChevronRight size={13} />
              </button>
            </div>

            {/* Task Item Rows */}
            <div className="divide-y divide-[#F0F1F7]">
              {todaysPriorities.map((task) => (
                <div
                  key={task.id}
                  className="py-3 flex items-start justify-between gap-3 group hover:bg-[#FBFBFE] px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
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
                      <div
                        className={`text-xs font-medium tracking-tight ${
                          task.done ? "line-through text-[#9DA1B2]" : "text-[#292C40]"
                        }`}
                      >
                        {task.title}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-[#70758B] flex items-center gap-1">
                          <Clock size={10} />
                          {task.dueDate}
                        </span>
                        {task.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] bg-[#F0F1F7] text-[#70758B] px-1.5 py-0.2 rounded font-medium"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Priority Badge */}
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded flex-shrink-0 ${
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
              ))}
            </div>

            {/* Quick Inline Fast Add Form */}
            <form onSubmit={handleAddInlineTask} className="mt-4 pt-3 border-t border-[#F0F1F7] flex gap-2">
              <input
                type="text"
                value={inlineTaskInput}
                onChange={(e) => setInlineTaskInput(e.target.value)}
                placeholder="Add priority task (e.g., Follow up with designer)..."
                className="flex-1 px-3 py-1.5 text-xs border border-[#E3E5EF] rounded-lg focus:outline-none focus:border-[#655BDF]"
              />
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-medium bg-[#655BDF] text-white hover:bg-[#5449cf] rounded-lg transition-colors cursor-pointer"
              >
                Add
              </button>
            </form>
          </div>

          {/* Upcoming Events / Schedule */}
          <div className="bg-white border border-[#E8EAF2] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-sm text-[#292C40]">Upcoming Events & Meetings</h3>
                <p className="text-xs text-[#70758B]">Today&apos;s scheduled timeline</p>
              </div>
              <button
                onClick={() => setActiveTab("Calendar")}
                className="text-xs text-[#655BDF] hover:underline font-medium flex items-center gap-1"
              >
                <span>Full Calendar</span>
                <ChevronRight size={13} />
              </button>
            </div>

            <div className="space-y-3">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-[#E8EAF2] bg-[#FBFBFE] hover:border-[#655BDF] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-center px-2 py-1 bg-[#EEEDFB] text-[#655BDF] rounded font-mono text-[11px] font-bold">
                      {ev.startTime}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#292C40]">{ev.title}</div>
                      <div className="text-[11px] text-[#70758B] flex items-center gap-2 mt-0.5">
                        <span>{ev.location || "Online"}</span>
                        {ev.attendees && (
                          <span>· {ev.attendees.length} participants</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                      ev.category === "FOCUS"
                        ? "bg-purple-100 text-purple-700"
                        : ev.category === "MEETING"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {ev.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick Assistant & Recent Documents */}
        <div className="space-y-6">
          {/* Quick Assistant Actions Card */}
          <div className="bg-white border border-[#E8EAF2] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-md bg-[#655BDF] text-white flex items-center justify-center font-bold text-xs">
                Z
              </span>
              <h3 className="font-semibold text-sm text-[#292C40]">Ask Zynqo Agent</h3>
            </div>
            <p className="text-xs text-[#70758B] leading-relaxed mb-4">
              Execute agentic workflows or trigger quick actions via Model Context Protocol:
            </p>

            <div className="space-y-2">
              <button
                onClick={() => setActiveTab("Chat")}
                className="w-full text-left p-2.5 rounded-lg border border-[#E8EAF2] hover:border-[#655BDF] hover:bg-[#EEEDFB]/40 transition-colors flex items-center justify-between text-xs text-[#292C40] group"
              >
                <span>&quot;Plan my morning focus blocks&quot;</span>
                <ChevronRight size={13} className="text-[#9DA1B2] group-hover:text-[#655BDF]" />
              </button>

              <button
                onClick={() => setActiveTab("Email")}
                className="w-full text-left p-2.5 rounded-lg border border-[#E8EAF2] hover:border-[#655BDF] hover:bg-[#EEEDFB]/40 transition-colors flex items-center justify-between text-xs text-[#292C40] group"
              >
                <span>&quot;Draft sprint follow-up email&quot;</span>
                <ChevronRight size={13} className="text-[#9DA1B2] group-hover:text-[#655BDF]" />
              </button>

              <button
                onClick={() => setActiveTab("Documents")}
                className="w-full text-left p-2.5 rounded-lg border border-[#E8EAF2] hover:border-[#655BDF] hover:bg-[#EEEDFB]/40 transition-colors flex items-center justify-between text-xs text-[#292C40] group"
              >
                <span>&quot;Summarize Q3 Performance Report&quot;</span>
                <ChevronRight size={13} className="text-[#9DA1B2] group-hover:text-[#655BDF]" />
              </button>
            </div>
          </div>

          {/* Recent Documents */}
          <div className="bg-white border border-[#E8EAF2] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-sm text-[#292C40]">Knowledge Docs</h3>
                <p className="text-xs text-[#70758B]">Files analyzed by agent</p>
              </div>
              <button
                onClick={() => setActiveTab("Documents")}
                className="text-xs text-[#655BDF] hover:underline font-medium"
              >
                All docs
              </button>
            </div>

            <div className="space-y-2.5">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => {
                    setSelectedDoc(doc);
                    setActiveTab("Documents");
                  }}
                  className="p-3 rounded-lg border border-[#E8EAF2] hover:border-[#655BDF] bg-[#FBFBFE] cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#292C40] truncate max-w-[190px]">
                      {doc.name}
                    </span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded font-semibold">
                      {doc.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#70758B] mt-1 line-clamp-2 leading-relaxed">
                    {doc.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
