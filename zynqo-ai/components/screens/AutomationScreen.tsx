"use client";

import React, { useState } from "react";
import { useApp, Workflow } from "@/lib/store";
import {
  Zap,
  Plus,
  Play,
  Check,
  Clock,
  Server,
  ArrowRight,
  Sliders,
} from "@/components/icons/Icons";

export default function AutomationScreen() {
  const { workflows, toggleWorkflow } = useApp();
  const [selectedTab, setSelectedTab] = useState<"workflows" | "history">("workflows");
  const [newModalOpen, setNewModalOpen] = useState(false);

  const activeCount = workflows.filter((w) => w.active).length;

  const executionHistory = [
    {
      id: "log-1",
      workflow: "Morning Focus & Briefing",
      tool: "calendar_checkAvailability + tasks_getPinned",
      timestamp: "Today, 08:00 AM",
      status: "SUCCESS",
      duration: "1.2s",
    },
    {
      id: "log-2",
      workflow: "Auto-Draft Meeting Follow-ups",
      tool: "email_composeDraft",
      timestamp: "Yesterday, 05:10 PM",
      status: "SUCCESS",
      duration: "2.4s",
    },
    {
      id: "log-3",
      workflow: "End-of-Day Task Reconciliation",
      tool: "tasks_reconcileSchedule",
      timestamp: "Yesterday, 05:30 PM",
      status: "SUCCESS",
      duration: "0.8s",
    },
    {
      id: "log-4",
      workflow: "Document Action Items Extractor",
      tool: "docs_extractSummary",
      timestamp: "Oct 20, 02:30 PM",
      status: "SUCCESS",
      duration: "3.1s",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E8EAF2] rounded-xl p-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-[#292C40]">Agent Automation Engine</h2>
            <span className="text-[10px] font-semibold bg-[#EDFDF2] text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
              {activeCount} Active Workflows
            </span>
          </div>
          <p className="text-xs text-[#70758B] mt-0.5">
            Event-driven and recurring routines managed through Model Context Protocol
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#F6F7FB] p-1 rounded-lg border border-[#E8EAF2]">
            <button
              onClick={() => setSelectedTab("workflows")}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                selectedTab === "workflows"
                  ? "bg-white text-[#292C40] font-semibold shadow-xs"
                  : "text-[#70758B]"
              }`}
            >
              Active Workflows
            </button>
            <button
              onClick={() => setSelectedTab("history")}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                selectedTab === "history"
                  ? "bg-white text-[#292C40] font-semibold shadow-xs"
                  : "text-[#70758B]"
              }`}
            >
              Execution Logs
            </button>
          </div>

          <button
            onClick={() => setNewModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#655BDF] hover:bg-[#5449cf] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>New Workflow</span>
          </button>
        </div>
      </div>

      {selectedTab === "workflows" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workflows.map((wf) => (
            <div
              key={wf.id}
              className={`bg-white border rounded-xl p-5 space-y-4 transition-all ${
                wf.active ? "border-[#E8EAF2] shadow-xs" : "border-[#E8EAF2] opacity-75 bg-[#FBFBFE]"
              }`}
            >
              {/* Header with Title and Toggle */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      wf.active
                        ? "bg-[#EEEDFB] text-[#655BDF]"
                        : "bg-slate-100 text-[#9DA1B2]"
                    }`}
                  >
                    <Zap size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs text-[#292C40]">{wf.name}</h3>
                    <p className="text-[11px] text-[#70758B] mt-0.5 leading-relaxed">
                      {wf.description}
                    </p>
                  </div>
                </div>

                {/* Switch Toggle */}
                <button
                  onClick={() => toggleWorkflow(wf.id)}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer flex-shrink-0 ${
                    wf.active ? "bg-[#655BDF]" : "bg-[#DCDFEA]"
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                      wf.active ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Trigger & Action Sequence */}
              <div className="p-3 bg-[#F8F9FC] border border-[#E8EAF2] rounded-lg space-y-2 text-xs">
                <div className="flex items-center gap-2 text-[#70758B]">
                  <span className="text-[10px] font-bold text-[#655BDF] uppercase tracking-wider w-14 flex-shrink-0">
                    WHEN
                  </span>
                  <span className="font-medium text-[#292C40] bg-white border border-[#E8EAF2] px-2 py-0.5 rounded text-[11px]">
                    {wf.trigger}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#70758B]">
                  <span className="text-[10px] font-bold text-[#E5A445] uppercase tracking-wider w-14 flex-shrink-0">
                    THEN
                  </span>
                  <span className="font-medium text-[#292C40] bg-white border border-[#E8EAF2] px-2 py-0.5 rounded text-[11px]">
                    {wf.action}
                  </span>
                </div>
              </div>

              {/* Status and Last Run Metadata */}
              <div className="flex items-center justify-between text-[11px] text-[#70758B] pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Last run: {wf.lastRun}</span>
                </div>
                <div className="font-mono text-[10px]">
                  Runs: {wf.runCount}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTab === "history" && (
        <div className="bg-white border border-[#E8EAF2] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#F0F1F7] text-xs font-semibold text-[#292C40]">
            Audit Trail & Execution Logs
          </div>
          <div className="divide-y divide-[#F0F1F7] text-xs">
            <div className="grid grid-cols-12 px-4 py-2 bg-[#FBFBFE] font-semibold text-[#70758B] text-[11px]">
              <div className="col-span-4">Workflow Name</div>
              <div className="col-span-4">Executed MCP Tools</div>
              <div className="col-span-2">Timestamp</div>
              <div className="col-span-2 text-right">Status</div>
            </div>

            {executionHistory.map((log) => (
              <div key={log.id} className="grid grid-cols-12 px-4 py-3 items-center hover:bg-[#FBFBFE]">
                <div className="col-span-4 font-medium text-[#292C40]">{log.workflow}</div>
                <div className="col-span-4 font-mono text-[11px] text-[#655BDF] truncate">
                  {log.tool}
                </div>
                <div className="col-span-2 text-[#70758B] text-[11px]">{log.timestamp}</div>
                <div className="col-span-2 text-right">
                  <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                    ✓ {log.status} ({log.duration})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Workflow Template Modal */}
      {newModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-[#E8EAF2] w-full max-w-md p-5 space-y-4">
            <h3 className="font-semibold text-sm text-[#292C40]">Add Workflow from Template</h3>
            <p className="text-xs text-[#70758B]">
              Choose a pre-configured automation or connect to a custom MCP tool trigger.
            </p>

            <div className="space-y-2">
              {[
                {
                  title: "Slack Notification on High Priority Task",
                  desc: "Sends instant ping to team channel whenever an urgent task is created.",
                },
                {
                  title: "Daily Calendar Digest to Email",
                  desc: "Summarizes the day's agenda and dispatches it at 7:30 AM.",
                },
                {
                  title: "Weekly Project Retrospective Generator",
                  desc: "Aggregates all completed tasks on Friday at 5:00 PM.",
                },
              ].map((tpl, i) => (
                <div
                  key={i}
                  className="p-3 border border-[#E8EAF2] hover:border-[#655BDF] rounded-lg cursor-pointer bg-[#FBFBFE] text-xs space-y-1"
                  onClick={() => setNewModalOpen(false)}
                >
                  <div className="font-semibold text-[#292C40]">{tpl.title}</div>
                  <div className="text-[#70758B] text-[11px]">{tpl.desc}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setNewModalOpen(false)}
                className="px-3.5 py-1.5 text-xs text-[#70758B] hover:bg-[#F6F7FB] border border-[#E8EAF2] rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
