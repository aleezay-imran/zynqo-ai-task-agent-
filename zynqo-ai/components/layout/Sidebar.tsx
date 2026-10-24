"use client";

import React from "react";
import { useApp } from "@/lib/store";
import {
  LayoutDashboard,
  CheckSquare,
  CalendarIcon,
  FileText,
  Mail,
  Zap,
  MessageSquare,
  SettingsIcon,
  Search,
  Sparkles,
  Server,
  HelpCircle,
} from "@/components/icons/Icons";

export default function Sidebar() {
  const { activeTab, setActiveTab, tasks, documents, workflows, setSearchOpen, setOnboardingOpen } = useApp();

  const pendingTasks = tasks.filter((t) => !t.done).length;
  const activeWorkflows = workflows.filter((w) => w.active).length;

  const navItems = [
    {
      id: "Overview",
      label: "Overview",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "Tasks",
      label: "Tasks",
      icon: CheckSquare,
      badge: pendingTasks > 0 ? String(pendingTasks) : null,
    },
    {
      id: "Calendar",
      label: "Calendar",
      icon: CalendarIcon,
      badge: "2",
    },
    {
      id: "Documents",
      label: "Documents",
      icon: FileText,
      badge: String(documents.length),
    },
    {
      id: "Email",
      label: "Email Drafts",
      icon: Mail,
      badge: null,
    },
    {
      id: "Automation",
      label: "Automations",
      icon: Zap,
      badge: activeWorkflows > 0 ? `${activeWorkflows} on` : null,
    },
    {
      id: "Chat",
      label: "AI Assistant",
      icon: MessageSquare,
      badge: "MCP",
    },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-[#E8EAF2] flex flex-col justify-between h-screen sticky top-0 select-none">
      {/* Brand & Workspace */}
      <div className="p-4 border-b border-[#F0F1F7]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#655BDF] text-white flex items-center justify-center font-bold text-base shadow-sm">
              Z
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm tracking-tight text-[#292C40]">zynqo</span>
                <span className="text-[10px] font-medium bg-[#EEEDFB] text-[#655BDF] px-1.5 py-0.5 rounded">v0.2</span>
              </div>
              <div className="text-[11px] text-[#70758B] leading-none mt-0.5">Task Agent Workspace</div>
            </div>
          </div>
          <button
            onClick={() => setOnboardingOpen(true)}
            className="p-1 text-[#9DA1B2] hover:text-[#292C40] hover:bg-[#F6F7FB] rounded transition-colors"
            title="Help & Tour"
          >
            <HelpCircle size={16} />
          </button>
        </div>

        {/* Global Search Shortcut Pill */}
        <button
          onClick={() => setSearchOpen(true)}
          className="mt-3.5 w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-[#70758B] bg-[#F6F7FB] hover:bg-[#EEEDFB] hover:text-[#655BDF] rounded-md border border-[#E8EAF2] transition-colors"
        >
          <div className="flex items-center gap-2">
            <Search size={13} className="text-[#9DA1B2]" />
            <span>Search or jump...</span>
          </div>
          <kbd className="text-[10px] bg-white border border-[#DCDFEA] text-[#70758B] px-1 py-0.2 rounded font-mono shadow-xs">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Primary Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        <div className="px-2 pb-1 text-[10px] font-semibold tracking-wider text-[#9DA1B2] uppercase">
          WORKSPACE
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? "bg-[#EEEDFB] text-[#655BDF] font-semibold shadow-xs"
                  : "text-[#70758B] hover:text-[#292C40] hover:bg-[#F6F7FB]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon size={16} className={isActive ? "text-[#655BDF]" : "text-[#85899F]"} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-medium px-1.5 py-0.2 rounded ${
                    isActive
                      ? "bg-[#655BDF] text-white"
                      : "bg-[#F0F1F7] text-[#70758B]"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-4 px-2 pb-1 text-[10px] font-semibold tracking-wider text-[#9DA1B2] uppercase">
          AGENT STATUS
        </div>

        {/* MCP Server Live Status */}
        <div className="px-2.5 py-2 bg-[#FBFBFE] border border-[#E8EAF2] rounded-lg text-[11px] space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[#292C40] font-medium">
              <Server size={12} className="text-[#655BDF]" />
              <span>MCP Protocol</span>
            </div>
            <span className="flex items-center gap-1 text-[10px] font-medium text-[#16A34A] bg-[#EDFDF2] px-1.5 py-0.2 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
              Connected
            </span>
          </div>
          <div className="text-[10px] text-[#70758B] flex items-center justify-between">
            <span>Active Tool Servers:</span>
            <span className="font-mono font-medium text-[#292C40]">4 / 4</span>
          </div>
          <div className="text-[10px] text-[#70758B] flex items-center justify-between">
            <span>Agent Engine:</span>
            <span className="font-medium text-[#655BDF]">Local MCP Runner</span>
          </div>
        </div>
      </div>

      {/* Footer Profile & Settings */}
      <div className="p-3 border-t border-[#F0F1F7] space-y-1">
        <button
          onClick={() => setActiveTab("Settings")}
          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
            activeTab === "Settings"
              ? "bg-[#EEEDFB] text-[#655BDF] font-semibold"
              : "text-[#70758B] hover:text-[#292C40] hover:bg-[#F6F7FB]"
          }`}
        >
          <SettingsIcon size={16} className={activeTab === "Settings" ? "text-[#655BDF]" : "text-[#85899F]"} />
          <span>Settings & MCP</span>
        </button>

        <div className="pt-1.5 flex items-center gap-2.5 px-2 py-1.5 rounded-lg bg-[#F8F9FC] border border-[#EAEBF3]">
          <div className="w-7 h-7 rounded-full bg-[#655BDF] text-white flex items-center justify-center text-xs font-semibold">
            AC
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-[#292C40] truncate">Alex Chen</div>
            <div className="text-[10px] text-[#70758B] truncate">alex.chen@work.io</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
