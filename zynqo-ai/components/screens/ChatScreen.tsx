"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "@/lib/store";
import {
  Send,
  Server,
  Check,
  Trash2,
  Paperclip,
  Mic,
  MicOff,
} from "@/components/icons/Icons";

type SpeechRecognitionEventLike = Event & {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
};

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

export default function ChatScreen() {
  const { messages, sendMessage, clearMessages } = useApp();
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const voiceTextRef = useRef("");
  const sendMessageRef = useRef(sendMessage);

  useEffect(() => {
    sendMessageRef.current = sendMessage;
  }, [sendMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const speechWindow = window as Window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const Recognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!Recognition) return;

    const supportTimer = window.setTimeout(() => setVoiceSupported(true), 0);
    const recognition = new Recognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      const transcript = Array.from({ length: event.results.length }, (_, index) => event.results[index][0].transcript).join(" ").trim();
      voiceTextRef.current = transcript;
      setInputText(transcript);
    };
    recognition.onerror = () => {
      setIsListening(false);
      voiceTextRef.current = "";
    };
    recognition.onend = () => {
      setIsListening(false);
      const transcript = voiceTextRef.current.trim();
      voiceTextRef.current = "";
      if (transcript) {
        setLoading(true);
        void sendMessageRef.current(transcript).finally(() => setLoading(false));
      }
    };
    recognitionRef.current = recognition;
    return () => {
      recognition.stop();
      recognitionRef.current = null;
      window.clearTimeout(supportTimer);
    };
  }, []);

  function toggleVoiceInput() {
    if (!recognitionRef.current || loading) return;
    if (isListening) {
      recognitionRef.current.stop();
      return;
    }
    voiceTextRef.current = "";
    setInputText("");
    setIsListening(true);
    recognitionRef.current.start();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const clean = inputText.trim();
    if (!clean || loading) return;

    setInputText("");
    setLoading(true);
    await sendMessage(clean);
    setLoading(false);
  }

  const promptSuggestions = [
    "Plan my day with focus blocks",
    "Add task to submit expense report by 4pm !high",
    "Draft a follow-up email to Marcus",
    "Summarize the Q3 Performance Report",
  ];

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8.5rem)] flex flex-col bg-white border border-[#E8EAF2] rounded-xl overflow-hidden shadow-xs">
      {/* Header Bar */}
      <div className="px-5 py-3 border-b border-[#F0F1F7] flex items-center justify-between bg-white z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#655BDF] text-white flex items-center justify-center font-bold text-xs">
            Z
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs text-[#292C40]">Zynqo Task Agent</span>
              <span className="text-[10px] font-medium bg-[#EDFDF2] text-[#16A34A] px-1.5 py-0.2 rounded border border-emerald-200">
                MCP Tooling Active
              </span>
            </div>
            <div className="text-[10px] text-[#70758B]">
              Deterministic actions via local task, calendar & doc servers
            </div>
          </div>
        </div>

        <button
          onClick={clearMessages}
          className="p-1.5 text-[#9DA1B2] hover:text-rose-500 hover:bg-[#F6F7FB] rounded-md transition-colors"
          title="Clear Conversation"
        >
          <Trash2 size={15} />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === "user";

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-[#9DA1B2]">
                <span className="font-semibold text-[#70758B]">
                  {isUser ? "YOU" : "ZYNQO AGENT"}
                </span>
                <span>·</span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] rounded-xl px-4 py-3 text-xs leading-relaxed ${
                  isUser
                    ? "bg-[#655BDF] text-white shadow-xs"
                    : "bg-[#F8F9FC] border border-[#E8EAF2] text-[#292C40]"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Tool Execution Card (if AI triggered an MCP action) */}
                {msg.toolExecution && (
                  <div className="mt-3 pt-3 border-t border-[#E8EAF2] text-xs">
                    <div className="p-2.5 rounded-lg bg-white border border-[#E0E2EC] space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between text-[#70758B]">
                        <span className="flex items-center gap-1.5 font-mono font-medium text-[#655BDF]">
                          <Server size={12} />
                          {msg.toolExecution.toolName}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-[#16A34A] font-semibold">
                          <Check size={11} />
                          SUCCESS
                        </span>
                      </div>

                      <div className="text-[10px] font-mono text-[#70758B] bg-[#F6F7FB] p-1.5 rounded">
                        {JSON.stringify(msg.toolExecution.params, null, 2)}
                      </div>

                      {msg.toolExecution.output && (
                        <div className="text-[10px] text-emerald-700">
                          {msg.toolExecution.output}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-[#70758B] p-2">
            <span className="w-2 h-2 rounded-full bg-[#655BDF] animate-ping" />
            <span>Zynqo is analyzing intent and executing tools...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="px-5 py-2 border-t border-[#F0F1F7] bg-[#FBFBFE] flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-semibold text-[#9DA1B2] uppercase tracking-wider flex-shrink-0">
          Suggestions:
        </span>
        {promptSuggestions.map((prompt, i) => (
          <button
            key={i}
            onClick={() => sendMessage(prompt)}
            className="text-[11px] px-2.5 py-1 bg-white hover:bg-[#EEEDFB] hover:text-[#655BDF] text-[#70758B] border border-[#E8EAF2] rounded-full whitespace-nowrap transition-colors flex-shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={handleSubmit}
        className="p-3 bg-white border-t border-[#F0F1F7] flex items-center gap-2"
      >
        <button
          type="button"
          onClick={toggleVoiceInput}
          disabled={!voiceSupported || loading}
          className={`p-2 rounded-lg transition-colors ${isListening ? "text-rose-500 bg-rose-50" : "text-[#9DA1B2] hover:text-[#292C40]"} disabled:opacity-40`}
          title={voiceSupported ? (isListening ? "Stop listening" : "Use voice command") : "Voice input is not supported in this browser"}
        >
          {isListening ? <MicOff size={16} /> : <Mic size={16} />}
        </button>

        <button
          type="button"
          className="p-2 text-[#9DA1B2] hover:text-[#292C40] rounded-lg transition-colors"
          title="Attach Document"
        >
          <Paperclip size={16} />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask Zynqo to create a task, plan your calendar, draft emails, or summarize files..."
          className="flex-1 text-xs border border-[#E3E5EF] rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-[#655BDF] text-[#292C40]"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || loading}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#655BDF] hover:bg-[#5449cf] disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Send size={13} />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
}
