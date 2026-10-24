"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store";
import { X, Check, ArrowRight, Zap, CheckSquare, MessageSquare, Server } from "@/components/icons/Icons";

export default function OnboardingModal() {
  const { onboardingOpen, setOnboardingOpen, setActiveTab } = useApp();
  const [step, setStep] = useState(1);

  if (!onboardingOpen) return null;

  function handleClose() {
    setOnboardingOpen(false);
    setStep(1);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-[#E8EAF2] w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F1F7]">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-[#EEEDFB] text-[#655BDF] flex items-center justify-center font-bold text-xs">
              Z
            </span>
            <span className="font-semibold text-sm text-[#292C40]">Welcome to Zynqo AI</span>
          </div>
          <button
            onClick={handleClose}
            className="text-[#9DA1B2] hover:text-[#292C40] p-1 rounded-md"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#EEEDFB] text-[#655BDF] flex items-center justify-center">
                <CheckSquare size={24} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#292C40]">
                  Your Personal AI Task & Action Agent
                </h3>
                <p className="text-xs text-[#70758B] mt-1 leading-relaxed">
                  Zynqo AI is not just another conversational bot. It is an agentic productivity system that takes action on your behalf: scheduling focus sessions, breaking down complex tasks, and summarizing documents.
                </p>
              </div>

              <div className="space-y-2 bg-[#FBFBFE] border border-[#E8EAF2] rounded-lg p-3 text-xs">
                <div className="flex items-start gap-2">
                  <span className="text-[#16A34A] font-bold">✓</span>
                  <span className="text-[#292C40]">
                    <strong>Dual View Tasks:</strong> Toggle instantly between List and Kanban board workflows.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#16A34A] font-bold">✓</span>
                  <span className="text-[#292C40]">
                    <strong>Deterministic MCP Execution:</strong> AI actions run via audited local Model Context Protocol tools.
                  </span>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#EDFDF2] text-[#16A34A] flex items-center justify-center">
                <Server size={24} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#292C40]">
                  Standardized Model Context Protocol (MCP)
                </h3>
                <p className="text-xs text-[#70758B] mt-1 leading-relaxed">
                  Every action—creating tasks, extracting document insights, drafting emails—is executed through standardized tool interfaces with clear confirmation and logs.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg border border-[#E8EAF2] bg-[#F8F9FC]">
                  <div className="font-medium text-[#292C40]">Tasks MCP Server</div>
                  <div className="text-[10px] text-[#70758B] mt-0.5">localhost:3001 · 4 tools</div>
                </div>
                <div className="p-2.5 rounded-lg border border-[#E8EAF2] bg-[#F8F9FC]">
                  <div className="font-medium text-[#292C40]">Calendar Server</div>
                  <div className="text-[10px] text-[#70758B] mt-0.5">localhost:3002 · 3 tools</div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#FFFBEB] text-[#D97706] flex items-center justify-center">
                <Zap size={24} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#292C40]">
                  You&apos;re All Set to Start
                </h3>
                <p className="text-xs text-[#70758B] mt-1 leading-relaxed">
                  Start by exploring the Dashboard overview, checking today&apos;s priority tasks, or pressing <kbd className="px-1 py-0.5 bg-[#F0F1F7] rounded text-[11px] font-mono">Ctrl+K</kbd> to search anywhere.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    handleClose();
                    setActiveTab("Overview");
                  }}
                  className="flex-1 py-2 text-xs font-medium text-center border border-[#E8EAF2] rounded-lg hover:bg-[#F6F7FB] text-[#292C40]"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => {
                    handleClose();
                    setActiveTab("Chat");
                  }}
                  className="flex-1 py-2 text-xs font-medium text-center bg-[#655BDF] text-white rounded-lg hover:bg-[#5449cf]"
                >
                  Chat with Agent
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer & Progress */}
        <div className="px-6 py-3.5 bg-[#FBFBFE] border-t border-[#F0F1F7] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((s) => (
              <span
                key={s}
                className={`w-2 h-2 rounded-full transition-colors ${
                  step === s ? "bg-[#655BDF]" : "bg-[#DCDFEA]"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {step < 3 ? (
              <>
                <button
                  onClick={handleClose}
                  className="px-3 py-1.5 text-xs text-[#70758B] hover:text-[#292C40]"
                >
                  Skip
                </button>
                <button
                  onClick={() => setStep((s) => s + 1)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#655BDF] hover:bg-[#5449cf] text-white text-xs font-medium rounded-lg"
                >
                  <span>Next</span>
                  <ArrowRight size={13} />
                </button>
              </>
            ) : (
              <button
                onClick={handleClose}
                className="px-4 py-1.5 bg-[#655BDF] hover:bg-[#5449cf] text-white text-xs font-medium rounded-lg"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
