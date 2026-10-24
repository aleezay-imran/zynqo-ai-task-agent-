"use client";

import React, { useState } from "react";
import { useApp, CalendarEvent } from "@/lib/store";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Sparkles,
  CalendarIcon,
  Check,
} from "@/components/icons/Icons";

const days = ["Mon 20", "Tue 21", "Wed 22", "Thu 23", "Fri 24", "Sat 25", "Sun 26"];
const hours = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

export default function CalendarScreen() {
  const { events, addEvent, tasks } = useApp();
  const [viewType, setViewType] = useState<"week" | "day">("week");
  const [newEventOpen, setNewEventOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("11:00 AM");
  const [endTime, setEndTime] = useState("12:00 PM");
  const [dayIndex, setDayIndex] = useState(4); // Friday
  const [category, setCategory] = useState<"WORK" | "MEETING" | "FOCUS" | "PERSONAL">("FOCUS");

  function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    addEvent({
      title: title.trim(),
      startTime,
      endTime,
      dayIndex,
      dateStr: days[dayIndex],
      category,
      location: "Google Meet / Calendar",
    });

    setTitle("");
    setNewEventOpen(false);
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Calendar Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E8EAF2] rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 border border-[#E8EAF2] rounded-lg p-0.5 bg-[#F6F7FB]">
            <button className="p-1.5 hover:bg-white rounded-md text-[#70758B] hover:text-[#292C40] transition-colors">
              <ChevronLeft size={14} />
            </button>
            <button className="px-2.5 py-1 text-xs font-semibold text-[#292C40] bg-white rounded-md shadow-xs">
              Today
            </button>
            <button className="p-1.5 hover:bg-white rounded-md text-[#70758B] hover:text-[#292C40] transition-colors">
              <ChevronRight size={14} />
            </button>
          </div>

          <span className="text-sm font-semibold text-[#292C40]">
            October 20 – October 26, 2026
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Day / Week Switcher */}
          <div className="flex items-center bg-[#F6F7FB] p-1 rounded-lg border border-[#E8EAF2]">
            <button
              onClick={() => setViewType("week")}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                viewType === "week"
                  ? "bg-white text-[#292C40] font-semibold shadow-xs"
                  : "text-[#70758B]"
              }`}
            >
              Week View
            </button>
            <button
              onClick={() => setViewType("day")}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                viewType === "day"
                  ? "bg-white text-[#292C40] font-semibold shadow-xs"
                  : "text-[#70758B]"
              }`}
            >
              Day View
            </button>
          </div>

          <button
            onClick={() => setNewEventOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#655BDF] hover:bg-[#5449cf] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Main Grid & Side Optimizer */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Timeline Grid (3 Cols) */}
        <div className="lg:col-span-3 bg-white border border-[#E8EAF2] rounded-xl overflow-hidden">
          {/* Day Headers */}
          <div className="grid grid-cols-8 border-b border-[#E8EAF2] bg-[#FBFBFE] text-center text-xs py-2.5 font-medium text-[#70758B]">
            <div className="text-[11px] text-[#9DA1B2]">TIME</div>
            {days.map((day, idx) => (
              <div
                key={day}
                className={`${idx === 4 ? "text-[#655BDF] font-bold" : "text-[#292C40]"}`}
              >
                {day}
                {idx === 4 && (
                  <span className="block text-[9px] text-[#655BDF] font-normal uppercase">
                    Today
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Hour Rows */}
          <div className="divide-y divide-[#F0F1F7] text-xs">
            {hours.map((hr) => (
              <div key={hr} className="grid grid-cols-8 min-h-[56px] relative group">
                <div className="px-2 py-2 text-[11px] font-mono text-[#9DA1B2] border-r border-[#F0F1F7] bg-[#FBFBFE]">
                  {hr}
                </div>

                {days.map((_, dayIdx) => {
                  const matchingEvents = events.filter((e) => {
                    return e.dayIndex === dayIdx && e.startTime.startsWith(hr.slice(0, 2));
                  });

                  return (
                    <div
                      key={dayIdx}
                      className={`border-r border-[#F0F1F7] p-1 relative hover:bg-[#EEEDFB]/20 transition-colors ${
                        dayIdx === 4 ? "bg-[#EEEDFB]/10" : ""
                      }`}
                    >
                      {matchingEvents.map((ev) => (
                        <div
                          key={ev.id}
                          className={`rounded-md p-1.5 text-[11px] border leading-tight shadow-xs ${
                            ev.category === "FOCUS"
                              ? "bg-purple-50 text-purple-900 border-purple-200"
                              : ev.category === "MEETING"
                              ? "bg-blue-50 text-blue-900 border-blue-200"
                              : "bg-amber-50 text-amber-900 border-amber-200"
                          }`}
                        >
                          <div className="font-semibold truncate">{ev.title}</div>
                          <div className="text-[10px] opacity-75">
                            {ev.startTime} - {ev.endTime}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* AI Schedule Optimizer Panel (1 Col) */}
        <div className="space-y-4">
          <div className="bg-white border border-[#E8EAF2] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-[#655BDF]" />
              <h3 className="font-semibold text-xs text-[#292C40]">AI Schedule Optimization</h3>
            </div>
            <p className="text-[11px] text-[#70758B] leading-relaxed">
              Zynqo analyzed your {tasks.filter((t) => !t.done).length} open tasks against your calendar commitments:
            </p>

            <div className="space-y-2.5 mt-3">
              <div className="p-2.5 bg-[#EDFDF2] border border-emerald-200 rounded-lg text-xs">
                <div className="font-semibold text-emerald-800 flex items-center gap-1.5">
                  <Check size={13} />
                  <span>No Overlaps Detected</span>
                </div>
                <div className="text-[11px] text-emerald-700 mt-0.5">
                  Your 02:00 PM standup and 04:00 PM client call leave 2.5 hours of uninterrupted focus time.
                </div>
              </div>

              <div className="p-2.5 bg-[#FBFBFE] border border-[#E8EAF2] rounded-lg text-xs">
                <div className="font-semibold text-[#292C40]">Suggested Focus Block</div>
                <div className="text-[11px] text-[#70758B] mt-0.5">
                  Reserve 10:00 AM – 11:30 AM to complete &quot;Review project proposal&quot;.
                </div>
                <button
                  onClick={() => {
                    addEvent({
                      title: "Focus: Review Project Proposal",
                      startTime: "10:00 AM",
                      endTime: "11:30 AM",
                      dayIndex: 4,
                      dateStr: "Fri 24",
                      category: "FOCUS",
                      location: "Quiet focus",
                    });
                  }}
                  className="mt-2 text-[11px] font-semibold text-[#655BDF] hover:underline"
                >
                  + Add to Calendar
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E8EAF2] rounded-xl p-4">
            <h4 className="font-semibold text-xs text-[#292C40] mb-2">Connected Calendars</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#70758B]">
                <span>Google Calendar (Work)</span>
                <span className="text-[10px] text-emerald-600 font-medium">Synced</span>
              </div>
              <div className="flex items-center justify-between text-[#70758B]">
                <span>MCP Schedule Server</span>
                <span className="text-[10px] text-[#655BDF] font-mono">localhost:3002</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {newEventOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-[#E8EAF2] w-full max-w-md p-5 space-y-4 animate-in fade-in zoom-in-95 duration-100">
            <h3 className="font-semibold text-sm text-[#292C40]">Schedule Calendar Event</h3>
            <form onSubmit={handleCreateEvent} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#292C40] mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Sync with Design Team"
                  className="w-full px-3 py-1.5 text-xs border border-[#E3E5EF] rounded-lg focus:outline-none focus:border-[#655BDF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#292C40] mb-1">Start Time</label>
                  <select
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-[#E3E5EF] rounded-lg bg-white"
                  >
                    {hours.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#292C40] mb-1">End Time</label>
                  <select
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-[#E3E5EF] rounded-lg bg-white"
                  >
                    {hours.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#292C40] mb-1">Day</label>
                  <select
                    value={dayIndex}
                    onChange={(e) => setDayIndex(Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-xs border border-[#E3E5EF] rounded-lg bg-white"
                  >
                    {days.map((d, i) => (
                      <option key={d} value={i}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#292C40] mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CalendarEvent["category"])}
                    className="w-full px-2 py-1.5 text-xs border border-[#E3E5EF] rounded-lg bg-white"
                  >
                    <option value="FOCUS">Focus / Deep Work</option>
                    <option value="MEETING">Meeting</option>
                    <option value="WORK">Work Review</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#F0F1F7]">
                <button
                  type="button"
                  onClick={() => setNewEventOpen(false)}
                  className="px-3 py-1.5 text-xs text-[#70758B] hover:bg-[#F6F7FB] rounded-lg border border-[#E8EAF2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-medium text-white bg-[#655BDF] hover:bg-[#5449cf] rounded-lg shadow-xs"
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
