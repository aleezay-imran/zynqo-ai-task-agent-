"use client";

import React, { useState } from "react";
import { useApp, EmailDraft } from "@/lib/store";
import {
  Mail,
  Send,
  Copy,
  Sparkles,
  Check,
  Plus,
  Trash2,
} from "@/components/icons/Icons";

export default function EmailScreen() {
  const {
    emailDrafts,
    activeDraft,
    updateActiveDraft,
    saveCurrentDraft,
    loadDraft,
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [sentNotice, setSentNotice] = useState(false);

  function handleCopy() {
    navigator.clipboard?.writeText(
      `Subject: ${activeDraft.subject}\n\n${activeDraft.body}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleSendSimulation() {
    saveCurrentDraft();
    setSentNotice(true);
    setTimeout(() => setSentNotice(false), 3000);
  }

  // AI Tone adjustment simulations
  function applyTone(tone: EmailDraft["tone"]) {
    updateActiveDraft({ tone });

    let newBody = activeDraft.body;
    if (tone === "Concise") {
      newBody = `Hi,\n\nFollowing up on our project review:\n• Timeline confirmed for Friday deployment\n• Documentation indexed for MCP tools\n\nLet me know if you have any questions.\n\nBest,\nAlex`;
    } else if (tone === "Formal") {
      newBody = `Dear Colleague,\n\nI am writing to formally communicate the deliverables agreed upon during our recent architectural assessment.\n\nPlease review the attached specifications at your earliest convenience.\n\nRespectfully,\nAlex Chen`;
    } else if (tone === "Friendly") {
      newBody = `Hey team,\n\nHope everyone is having a great week! Just wanted to share a quick update on our recent progress.\n\nTake a look whenever you get a chance and let me know your thoughts.\n\nCheers,\nAlex`;
    }
    updateActiveDraft({ body: newBody });
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner Notice if Sent */}
      {sentNotice && (
        <div className="bg-[#EDFDF2] border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check size={16} />
            <span>
              <strong>Draft saved & dispatched:</strong> Email recorded to local communication queue.
            </span>
          </div>
          <button onClick={() => setSentNotice(false)} className="text-emerald-700 font-bold">
            ×
          </button>
        </div>
      )}

      {/* Main 2-Column Interface: Drafts Sidebar & Full Composer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Saved Drafts & Templates (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-[#E8EAF2] rounded-xl overflow-hidden">
            <div className="p-4 border-b border-[#F0F1F7] flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-xs text-[#292C40]">Saved Drafts</h3>
                <p className="text-[11px] text-[#70758B]">Recent email drafts</p>
              </div>
              <button
                onClick={() => {
                  loadDraft({
                    id: `draft-${Date.now()}`,
                    to: "",
                    subject: "New Message",
                    body: "Hi,\n\nWrite your message here...\n\nBest,\nAlex",
                    tone: "Professional",
                    updatedAt: "Just now",
                  });
                }}
                className="flex items-center gap-1 text-xs text-[#655BDF] font-semibold hover:underline"
              >
                <Plus size={14} />
                <span>New</span>
              </button>
            </div>

            <div className="divide-y divide-[#F0F1F7]">
              {emailDrafts.map((draft) => {
                const isSelected = activeDraft.id === draft.id;

                return (
                  <div
                    key={draft.id}
                    onClick={() => loadDraft(draft)}
                    className={`p-3.5 cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-[#EEEDFB]/50 border-l-3 border-[#655BDF]"
                        : "hover:bg-[#FBFBFE]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#292C40] truncate max-w-[190px]">
                        {draft.subject || "(No Subject)"}
                      </span>
                      <span className="text-[10px] text-[#85899F]">{draft.updatedAt}</span>
                    </div>
                    <div className="text-[11px] text-[#70758B] truncate mt-0.5">
                      To: {draft.to || "Unassigned"}
                    </div>
                    <p className="text-[11px] text-[#9DA1B2] line-clamp-1 mt-1">
                      {draft.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Pre-Made Templates Card */}
          <div className="bg-white border border-[#E8EAF2] rounded-xl p-4 space-y-2.5">
            <h4 className="font-semibold text-xs text-[#292C40]">Quick Email Templates</h4>
            <div className="space-y-1.5 text-xs">
              {[
                { title: "Meeting Reschedule Request", to: "colleague@team.com" },
                { title: "Weekly Sprint Status Brief", to: "leadership@company.com" },
                { title: "Project Proposal Sign-Off", to: "stakeholders@corp.com" },
              ].map((template, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    loadDraft({
                      id: `draft-t-${idx}`,
                      to: template.to,
                      subject: template.title,
                      body: `Hi,\n\nI am writing regarding the ${template.title.toLowerCase()}. Please review and confirm your availability.\n\nBest regards,\nAlex`,
                      tone: "Professional",
                      updatedAt: "Template",
                    });
                  }}
                  className="w-full text-left p-2 rounded-lg border border-[#E8EAF2] hover:border-[#655BDF] hover:bg-[#EEEDFB]/30 transition-colors text-[#292C40] text-[11px] block"
                >
                  {template.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Email Composer & AI Assistant (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-[#E8EAF2] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0F1F7] pb-3">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-[#655BDF]" />
              <h3 className="font-semibold text-sm text-[#292C40]">AI Email Composer</h3>
            </div>

            {/* Tone Selector */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[#70758B] text-[11px] font-medium hidden sm:inline">Tone:</span>
              {(["Professional", "Concise", "Formal", "Friendly"] as EmailDraft["tone"][]).map((t) => (
                <button
                  key={t}
                  onClick={() => applyTone(t)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    activeDraft.tone === t
                      ? "bg-[#655BDF] text-white"
                      : "bg-[#F6F7FB] text-[#70758B] hover:bg-[#EEEDFB]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#70758B] mb-1">
                RECIPIENT (TO)
              </label>
              <input
                type="email"
                value={activeDraft.to}
                onChange={(e) => updateActiveDraft({ to: e.target.value })}
                placeholder="e.g. client@example.com"
                className="w-full px-3 py-2 text-xs border border-[#E3E5EF] rounded-lg focus:outline-none focus:border-[#655BDF]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#70758B] mb-1">
                SUBJECT
              </label>
              <input
                type="text"
                value={activeDraft.subject}
                onChange={(e) => updateActiveDraft({ subject: e.target.value })}
                placeholder="Email Subject Line"
                className="w-full px-3 py-2 text-xs border border-[#E3E5EF] rounded-lg focus:outline-none focus:border-[#655BDF] font-semibold text-[#292C40]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-semibold text-[#70758B]">
                  MESSAGE BODY
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => applyTone("Concise")}
                    className="text-[10px] text-[#655BDF] font-semibold hover:underline flex items-center gap-1"
                  >
                    <Sparkles size={11} />
                    <span>Make more concise</span>
                  </button>
                </div>
              </div>
              <textarea
                rows={12}
                value={activeDraft.body}
                onChange={(e) => updateActiveDraft({ body: e.target.value })}
                className="w-full px-3 py-2.5 text-xs border border-[#E3E5EF] rounded-lg focus:outline-none focus:border-[#655BDF] font-sans leading-relaxed text-[#292C40]"
              />
            </div>
          </div>

          {/* Actions Toolbar */}
          <div className="pt-3 border-t border-[#F0F1F7] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E8EAF2] hover:bg-[#F6F7FB] text-xs font-medium text-[#292C40] transition-colors"
              >
                {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                <span>{copied ? "Copied!" : "Copy to Clipboard"}</span>
              </button>
              <button
                onClick={saveCurrentDraft}
                className="px-3 py-1.5 rounded-lg border border-[#E8EAF2] hover:bg-[#F6F7FB] text-xs font-medium text-[#292C40] transition-colors"
              >
                Save Draft
              </button>
            </div>

            <button
              onClick={handleSendSimulation}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#655BDF] hover:bg-[#5449cf] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Send size={13} />
              <span>Send Email</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
