"use client";

import React, { useState } from "react";
import { useApp, Priority } from "@/lib/store";
import { X, Check } from "@/components/icons/Icons";

export default function AddTaskModal() {
  const { addTaskModalOpen, setAddTaskModalOpen, addTask } = useApp();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [dueDate, setDueDate] = useState("Today, 5:00 PM");
  const [tagInput, setTagInput] = useState("work");

  if (!addTaskModalOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagInput
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    addTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate,
      tags: tags.length ? tags : ["general"],
    });

    setTitle("");
    setDescription("");
    setPriority("MEDIUM");
    setAddTaskModalOpen(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-xl border border-[#E8EAF2] w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0F1F7]">
          <div>
            <h3 className="font-semibold text-sm text-[#292C40]">Create New Task</h3>
            <p className="text-xs text-[#70758B]">Add a task to your workspace or assign it to Zynqo</p>
          </div>
          <button
            onClick={() => setAddTaskModalOpen(false)}
            className="p-1 text-[#9DA1B2] hover:text-[#292C40] hover:bg-[#F6F7FB] rounded-md transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#292C40] mb-1">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Prepare slide deck for board meeting"
              className="w-full px-3 py-2 text-xs border border-[#E3E5EF] rounded-lg focus:outline-none focus:border-[#655BDF] focus:ring-1 focus:ring-[#655BDF]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#292C40] mb-1">
              Description / Notes
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key context, links, or expectations..."
              className="w-full px-3 py-2 text-xs border border-[#E3E5EF] rounded-lg focus:outline-none focus:border-[#655BDF] focus:ring-1 focus:ring-[#655BDF] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#292C40] mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 text-xs border border-[#E3E5EF] rounded-lg bg-white focus:outline-none focus:border-[#655BDF]"
              >
                <option value="HIGH">High (Immediate)</option>
                <option value="MEDIUM">Medium (Normal)</option>
                <option value="LOW">Low (Later)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#292C40] mb-1">Due Date & Time</label>
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="e.g. Today, 5:00 PM"
                className="w-full px-3 py-2 text-xs border border-[#E3E5EF] rounded-lg focus:outline-none focus:border-[#655BDF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#292C40] mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="work, urgent, finance"
              className="w-full px-3 py-2 text-xs border border-[#E3E5EF] rounded-lg focus:outline-none focus:border-[#655BDF]"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#F0F1F7]">
            <button
              type="button"
              onClick={() => setAddTaskModalOpen(false)}
              className="px-3.5 py-2 text-xs font-medium text-[#70758B] hover:bg-[#F6F7FB] rounded-lg border border-[#E8EAF2] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#655BDF] hover:bg-[#5449cf] rounded-lg shadow-xs transition-colors"
            >
              <Check size={14} />
              <span>Create Task</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
