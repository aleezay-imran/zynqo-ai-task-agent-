"use client";

import React from "react";
import { useApp } from "@/lib/store";
import { Plus, Search, Bell, Sparkles } from "@/components/icons/Icons";

const subtitles: Record<string, string> = {
  Overview: "Daily productivity summary, priorities, and agent suggestions",
  Tasks: "Manage, prioritize, and complete your tasks with AI auto-organization",
  Calendar: "Interactive schedule, time blocking, and conflict detection",
  Documents: "Upload, summarize, and extract actionable insights from files",
  Email: "AI-assisted communication, tone tuning, and ready-to-send drafts",
  Automation: "Configure event-driven and scheduled agent workflows",
  Chat: "Conversational task orchestrator powered by Model Context Protocol",
  Settings: "Configure workspace preferences, accounts, and MCP server tools",
};

export default function Header() {
  const {
    activeTab,
    setSearchOpen,
    setAddTaskModalOpen,
    currentUserId,
    setCurrentUserId,
    users,
  } = useApp();

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(2026, 9, 23)); // 2026-10-23 per metadata

  return (
    <header className="h-16 px-6 bg-white border-b border-[#E8EAF2] flex items-center justify-between sticky top-0 z-10 select-none">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-[#292C40] tracking-tight">{activeTab}</h1>
          <span className="text-[11px] text-[#9DA1B2]">/</span>
          <span className="text-xs text-[#70758B] hidden md:inline">
            {subtitles[activeTab] || "Zynqo AI Assistant"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {users.length > 0 && (
          <select
            value={currentUserId}
            onChange={(event) => setCurrentUserId(event.target.value)}
            aria-label="Active workspace user"
            className="max-w-[160px] rounded-lg border border-[#E8EAF2] bg-white px-2 py-1.5 text-xs text-[#292C40] focus:border-[#655BDF] focus:outline-none"
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name || user.email}
              </option>
            ))}
          </select>
        )}

        {/* Date Display */}
        <div className="hidden lg:flex items-center text-xs text-[#70758B] font-medium px-2.5 py-1 rounded bg-[#F6F7FB] border border-[#E8EAF2]">
          {formattedDate}
        </div>

        {/* Global Search Button */}
        <button
          onClick={() => setSearchOpen(true)}
          className="p-2 text-[#70758B] hover:text-[#292C40] hover:bg-[#F6F7FB] rounded-lg border border-transparent hover:border-[#E8EAF2] transition-colors"
          title="Search (Ctrl+K)"
        >
          <Search size={16} />
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            className="p-2 text-[#70758B] hover:text-[#292C40] hover:bg-[#F6F7FB] rounded-lg border border-transparent hover:border-[#E8EAF2] transition-colors"
            title="Notifications"
          >
            <Bell size={16} />
          </button>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#655BDF]" />
        </div>

        {/* Quick Add Task Button */}
        <button
          onClick={() => setAddTaskModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#655BDF] hover:bg-[#5449cf] text-white text-xs font-medium rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus size={14} strokeWidth={2.5} />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
}
