"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store";
import {
  Search,
  X,
  CheckSquare,
  FileText,
  CalendarIcon,
  Zap,
  ChevronRight,
  MessageSquare,
} from "@/components/icons/Icons";

export default function CommandPalette() {
  const {
    searchOpen,
    setSearchOpen,
    tasks,
    documents,
    events,
    workflows,
    setActiveTab,
    setSelectedDoc,
    setAddTaskModalOpen,
  } = useApp();
  const [query, setQuery] = useState("");

  if (!searchOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredTasks = q
    ? tasks.filter((t) => t.title.toLowerCase().includes(q) || t.tags.some((tag) => tag.toLowerCase().includes(q)))
    : tasks.slice(0, 3);

  const filteredDocs = q
    ? documents.filter((d) => d.name.toLowerCase().includes(q) || d.summary.toLowerCase().includes(q))
    : documents.slice(0, 2);

  const filteredEvents = q
    ? events.filter((e) => e.title.toLowerCase().includes(q) || e.location?.toLowerCase().includes(q))
    : events.slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-[#E8EAF2] w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-[#F0F1F7] gap-3">
          <Search size={18} className="text-[#9DA1B2]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search tasks, docs, events..."
            className="flex-1 text-sm bg-transparent border-0 focus:outline-none text-[#292C40] placeholder-[#9DA1B2]"
          />
          <kbd className="text-[10px] bg-[#F6F7FB] border border-[#DCDFEA] text-[#70758B] px-1.5 py-0.5 rounded font-mono">
            ESC
          </kbd>
          <button
            onClick={() => setSearchOpen(false)}
            className="text-[#9DA1B2] hover:text-[#292C40]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-4">
          {/* Quick Actions */}
          {!q && (
            <div>
              <div className="px-3 py-1 text-[10px] font-semibold text-[#9DA1B2] uppercase tracking-wider">
                Quick Actions
              </div>
              <div className="space-y-0.5 mt-1">
                <button
                  onClick={() => {
                    setSearchOpen(false);
                    setAddTaskModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs hover:bg-[#EEEDFB] text-[#292C40] hover:text-[#655BDF] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckSquare size={14} className="text-[#655BDF]" />
                    <span>Create new task</span>
                  </div>
                  <span className="text-[10px] text-[#9DA1B2]">Action</span>
                </button>

                <button
                  onClick={() => {
                    setSearchOpen(false);
                    setActiveTab("Chat");
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs hover:bg-[#EEEDFB] text-[#292C40] hover:text-[#655BDF] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <MessageSquare size={14} className="text-[#655BDF]" />
                    <span>Ask Zynqo Agent to plan my day</span>
                  </div>
                  <span className="text-[10px] text-[#9DA1B2]">AI Tool</span>
                </button>
              </div>
            </div>
          )}

          {/* Tasks Results */}
          {filteredTasks.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-semibold text-[#9DA1B2] uppercase tracking-wider">
                Tasks ({filteredTasks.length})
              </div>
              <div className="space-y-0.5 mt-1">
                {filteredTasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => {
                      setSearchOpen(false);
                      setActiveTab("Tasks");
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs hover:bg-[#F6F7FB] text-left transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-2 h-2 rounded-full ${task.done ? "bg-emerald-500" : "bg-indigo-500"}`} />
                      <span className={`truncate ${task.done ? "line-through text-[#9DA1B2]" : "text-[#292C40]"}`}>
                        {task.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#85899F] ml-2 flex-shrink-0 font-medium">{task.dueDate}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Documents Results */}
          {filteredDocs.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-semibold text-[#9DA1B2] uppercase tracking-wider">
                Documents ({filteredDocs.length})
              </div>
              <div className="space-y-0.5 mt-1">
                {filteredDocs.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => {
                      setSelectedDoc(doc);
                      setActiveTab("Documents");
                      setSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs hover:bg-[#F6F7FB] text-left transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText size={14} className="text-[#85899F]" />
                      <span className="truncate text-[#292C40]">{doc.name}</span>
                    </div>
                    <span className="text-[10px] text-[#85899F] ml-2 flex-shrink-0">{doc.size}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Calendar Events */}
          {filteredEvents.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-semibold text-[#9DA1B2] uppercase tracking-wider">
                Calendar Events ({filteredEvents.length})
              </div>
              <div className="space-y-0.5 mt-1">
                {filteredEvents.map((ev) => (
                  <button
                    key={ev.id}
                    onClick={() => {
                      setActiveTab("Calendar");
                      setSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs hover:bg-[#F6F7FB] text-left transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CalendarIcon size={14} className="text-[#655BDF]" />
                      <span className="truncate text-[#292C40]">{ev.title}</span>
                    </div>
                    <span className="text-[10px] text-[#85899F] ml-2 flex-shrink-0">{ev.startTime}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-[#FBFBFE] border-t border-[#F0F1F7] flex items-center justify-between text-[11px] text-[#85899F]">
          <span>Navigation: Use arrow keys or click</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
}
