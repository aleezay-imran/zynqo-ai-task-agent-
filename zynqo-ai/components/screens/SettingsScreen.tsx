"use client";

import React, { useState } from "react";
import {
  User,
  Sliders,
  Server,
  Bell,
  Shield,
  Check,
  Zap,
} from "@/components/icons/Icons";

export default function SettingsScreen() {
  type SettingsTab = "profile" | "preferences" | "integrations" | "mcp" | "privacy";
  const [activeSubTab, setActiveSubTab] = useState<SettingsTab>("mcp");

  const [savedNotice, setSavedNotice] = useState(false);

  // Form states
  const [userName, setUserName] = useState("Alex Chen");
  const [userEmail, setUserEmail] = useState("alex.chen@work.io");
  const [workStart, setWorkStart] = useState("09:00 AM");
  const [workEnd, setWorkEnd] = useState("05:00 PM");
  const [autoOrganize, setAutoOrganize] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState(true);

  // MCP Servers State
  const [mcpServers, setMcpServers] = useState([
    {
      id: "srv-1",
      name: "Tasks MCP Server",
      url: "http://localhost:3001/mcp",
      toolsCount: 4,
      status: "CONNECTED",
      tools: ["tasks_createTask", "tasks_listTasks", "tasks_updateStatus", "tasks_deleteTask"],
      policy: "Always Allow",
    },
    {
      id: "srv-2",
      name: "Calendar MCP Server",
      url: "http://localhost:3002/mcp",
      toolsCount: 3,
      status: "CONNECTED",
      tools: ["calendar_getEvents", "calendar_scheduleSlot", "calendar_checkAvailability"],
      policy: "Ask Confirmation",
    },
    {
      id: "srv-3",
      name: "Documents MCP Server",
      url: "http://localhost:3003/mcp",
      toolsCount: 2,
      status: "CONNECTED",
      tools: ["docs_readDocument", "docs_extractSummary"],
      policy: "Always Allow",
    },
    {
      id: "srv-4",
      name: "Filesystem MCP Server",
      url: "stdio://local-fs",
      toolsCount: 2,
      status: "CONNECTED",
      tools: ["fs_readFile", "fs_listDirectory"],
      policy: "Ask Confirmation",
    },
  ]);

  // Integrations State
  const [integrations, setIntegrations] = useState([
    { name: "Google Calendar", desc: "Two-way event sync and conflict resolution", connected: true },
    { name: "Gmail & Email Relay", desc: "Draft email generation and scheduled sending", connected: true },
    { name: "Slack Workspace", desc: "Daily briefing delivery and task reminders", connected: false },
    { name: "Notion Knowledgebase", desc: "Sync project roadmaps and documentation", connected: true },
  ]);

  function handleSave() {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white border border-[#E8EAF2] rounded-xl p-5 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-[#292C40]">Settings & Preferences</h2>
          <p className="text-xs text-[#70758B] mt-0.5">
            Manage your agent behavior, Model Context Protocol servers, and integrations
          </p>
        </div>

        {savedNotice && (
          <span className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
            <Check size={14} />
            <span>Preferences saved!</span>
          </span>
        )}
      </div>

      {/* Main Grid: Sub-navigation & Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Navigation Tabs (3 cols) */}
        <div className="md:col-span-3 space-y-1">
          {[
            { id: "mcp", label: "MCP Protocol", icon: Server },
            { id: "profile", label: "Profile", icon: User },
            { id: "preferences", label: "Preferences", icon: Sliders },
            { id: "integrations", label: "Integrations", icon: Zap },
            { id: "privacy", label: "Privacy & Data", icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as SettingsTab)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                  isActive
                    ? "bg-[#EEEDFB] text-[#655BDF] font-semibold"
                    : "text-[#70758B] hover:bg-white hover:text-[#292C40]"
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Pane (9 cols) */}
        <div className="md:col-span-9 bg-white border border-[#E8EAF2] rounded-xl p-6 space-y-6">
          {/* MCP Protocol Settings */}
          {activeSubTab === "mcp" && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xs font-semibold text-[#292C40] uppercase tracking-wider">
                  Model Context Protocol (MCP) Configuration
                </h3>
                <p className="text-xs text-[#70758B] mt-1 leading-relaxed">
                  Zynqo connects to local and remote MCP tool servers to execute tasks, query documents, and organize schedules securely.
                </p>
              </div>

              <div className="space-y-3">
                {mcpServers.map((srv) => (
                  <div
                    key={srv.id}
                    className="p-4 border border-[#E8EAF2] rounded-xl bg-[#FBFBFE] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Server size={16} className="text-[#655BDF]" />
                        <span className="text-xs font-semibold text-[#292C40]">{srv.name}</span>
                        <span className="text-[10px] font-mono text-[#70758B] bg-white border border-[#E8EAF2] px-1.5 py-0.2 rounded">
                          {srv.url}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        ● {srv.status}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[10px] font-semibold text-[#9DA1B2] uppercase tracking-wider">
                        Registered Tools ({srv.tools.length}):
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {srv.tools.map((tool) => (
                          <span
                            key={tool}
                            className="text-[10px] font-mono bg-white border border-[#E8EAF2] text-[#292C40] px-2 py-0.5 rounded"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#F0F1F7] text-xs">
                      <span className="text-[11px] text-[#70758B]">Execution Security Policy:</span>
                      <select
                        value={srv.policy}
                        onChange={(e) => {
                          const val = e.target.value;
                          setMcpServers((prev) =>
                            prev.map((s) => (s.id === srv.id ? { ...s, policy: val } : s))
                          );
                        }}
                        className="text-[11px] px-2 py-1 border border-[#E3E5EF] rounded bg-white"
                      >
                        <option value="Always Allow">Always Allow (Deterministic)</option>
                        <option value="Ask Confirmation">Ask Confirmation</option>
                        <option value="Read Only">Read Only</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeSubTab === "profile" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-[#292C40] uppercase tracking-wider">
                  User Profile
                </h3>
                <p className="text-xs text-[#70758B] mt-1">
                  Manage your personal identity across the workspace
                </p>
              </div>

              <div className="space-y-3 max-w-md">
                <div>
                  <label className="block text-xs font-medium text-[#292C40] mb-1">Full Name</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E3E5EF] rounded-lg focus:outline-none focus:border-[#655BDF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#292C40] mb-1">Email Address</label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E3E5EF] rounded-lg focus:outline-none focus:border-[#655BDF]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeSubTab === "preferences" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-[#292C40] uppercase tracking-wider">
                  Daily Working Preferences
                </h3>
                <p className="text-xs text-[#70758B] mt-1">
                  Configure working hours and AI automation habits
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-md">
                <div>
                  <label className="block text-xs font-medium text-[#292C40] mb-1">Work Start</label>
                  <input
                    type="text"
                    value={workStart}
                    onChange={(e) => setWorkStart(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E3E5EF] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#292C40] mb-1">Work End</label>
                  <input
                    type="text"
                    value={workEnd}
                    onChange={(e) => setWorkEnd(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E3E5EF] rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2.5 text-xs text-[#292C40] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoOrganize}
                    onChange={(e) => setAutoOrganize(e.target.checked)}
                    className="rounded border-[#DCDFEA] text-[#655BDF]"
                  />
                  <span>Automatically organize tasks by priority and due date</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-[#292C40] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={aiSuggestions}
                    onChange={(e) => setAiSuggestions(e.target.checked)}
                    className="rounded border-[#DCDFEA] text-[#655BDF]"
                  />
                  <span>Show proactive schedule optimization suggestions</span>
                </label>
              </div>
            </div>
          )}

          {/* Integrations Tab */}
          {activeSubTab === "integrations" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-[#292C40] uppercase tracking-wider">
                  Connected Third-Party Services
                </h3>
                <p className="text-xs text-[#70758B] mt-1">
                  Connect external systems for seamless agent task routing
                </p>
              </div>

              <div className="space-y-3">
                {integrations.map((item, idx) => (
                  <div
                    key={item.name}
                    className="p-3.5 border border-[#E8EAF2] rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#292C40]">{item.name}</div>
                      <div className="text-[11px] text-[#70758B] mt-0.5">{item.desc}</div>
                    </div>
                    <button
                      onClick={() => {
                        setIntegrations((prev) =>
                          prev.map((it, i) => (i === idx ? { ...it, connected: !it.connected } : it))
                        );
                      }}
                      className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                        item.connected
                          ? "bg-[#EDFDF2] text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {item.connected ? "Connected" : "Connect"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeSubTab === "privacy" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-[#292C40] uppercase tracking-wider">
                  Privacy & Data Ownership
                </h3>
                <p className="text-xs text-[#70758B] mt-1">
                  Your tasks, documents, and MCP actions remain on your local database
                </p>
              </div>

              <div className="p-3.5 bg-[#F8F9FC] border border-[#E8EAF2] rounded-lg text-xs space-y-2 text-[#292C40]">
                <div>• Zero telemetry or prompt logging outside your configured MCP endpoints.</div>
                <div>• Local SQLite / PostgreSQL storage with Prisma ORM.</div>
                <div>• Audit logs for every tool executed by the assistant.</div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="pt-4 border-t border-[#F0F1F7] flex justify-end">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#655BDF] hover:bg-[#5449cf] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
