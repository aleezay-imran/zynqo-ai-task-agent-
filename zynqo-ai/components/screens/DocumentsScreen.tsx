"use client";

import React, { useState } from "react";
import { useApp, DocumentItem } from "@/lib/store";
import {
  FileText,
  UploadCloud,
  Search,
  Check,
  Sparkles,
  ArrowRight,
  Send,
  Sliders,
} from "@/components/icons/Icons";

export default function DocumentsScreen() {
  const { documents, addDocument, selectedDoc, setSelectedDoc } = useApp();
  const [activeDoc, setActiveDoc] = useState<DocumentItem>(selectedDoc || documents[0]);
  const [qaQuestion, setQaQuestion] = useState("");
  const [qaAnswer, setQaAnswer] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dragActive, setDragActive] = useState(false);

  // File upload handler
  async function handleFileUpload(file?: File) {
    if (!file) return;
    const textContent = await file.text().catch(() => "Binary file uploaded. Content indexed for agent queries.");
    const extension = file.name.split(".").pop()?.toLowerCase();
    const type: DocumentItem["type"] =
      extension === "pdf" || extension === "docx" || extension === "xlsx"
        ? extension
        : "txt";

    addDocument({
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type,
      content: textContent,
      summary: `Automated summary of ${file.name}. Key points indexed into local knowledge store.`,
      keyPoints: [
        `File ${file.name} uploaded successfully.`,
        "Content parsed into searchable sections for MCP agent retrieval.",
      ],
      actionItems: ["Review document details in preview panel."],
    });
  }

  // Question answering simulation
  function handleAskQuestion(e: React.FormEvent) {
    e.preventDefault();
    if (!qaQuestion.trim()) return;

    const q = qaQuestion.toLowerCase();
    if (q.includes("budget") || q.includes("cost") || q.includes("money")) {
      setQaAnswer(`According to ${activeDoc.name}, the total projected Q4 allocation is $42,000 with a $6,500 surge reserve buffer.`);
    } else if (q.includes("performance") || q.includes("result") || q.includes("turnaround")) {
      setQaAnswer(`Based on ${activeDoc.name}, task completion turnaround increased by 38% after deploying MCP tool automation.`);
    } else {
      setQaAnswer(`Based on ${activeDoc.name}: "${activeDoc.keyPoints[0] || activeDoc.summary}"`);
    }
    setQaQuestion("");
  }

  const filteredDocs = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Search & Upload Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E8EAF2] rounded-xl p-4">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <Search size={16} className="text-[#9DA1B2]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search indexed documents by filename..."
            className="w-full text-xs border-0 focus:outline-none text-[#292C40] placeholder-[#9DA1B2]"
          />
        </div>

        <label className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#655BDF] hover:bg-[#5449cf] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer flex-shrink-0">
          <UploadCloud size={14} />
          <span>Upload File</span>
          <input
            type="file"
            className="hidden"
            accept=".txt,.pdf,.docx,.xlsx"
            onChange={(e) => handleFileUpload(e.target.files?.[0])}
          />
        </label>
      </div>

      {/* Main Two-Panel Layout: Documents List / Grid & Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Upload Dropzone & Document Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              const file = e.dataTransfer.files[0];
              if (file) handleFileUpload(file);
            }}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
              dragActive
                ? "border-[#655BDF] bg-[#EEEDFB]/30"
                : "border-[#DCDFEA] bg-[#FBFBFE] hover:border-[#655BDF]"
            }`}
          >
            <UploadCloud size={28} className="mx-auto text-[#655BDF] mb-2" />
            <div className="text-xs font-semibold text-[#292C40]">
              Drag & drop documents here
            </div>
            <div className="text-[11px] text-[#70758B] mt-0.5">
              Supports .txt, .pdf, .docx, and .xlsx up to 25MB
            </div>
            <label className="mt-2.5 inline-block text-[11px] font-semibold text-[#655BDF] hover:underline cursor-pointer">
              Browse from your computer
              <input
                type="file"
                className="hidden"
                accept=".txt,.pdf,.docx,.xlsx"
                onChange={(e) => handleFileUpload(e.target.files?.[0])}
              />
            </label>
          </div>

          {/* Documents List */}
          <div className="bg-white border border-[#E8EAF2] rounded-xl overflow-hidden">
            <div className="p-3 border-b border-[#F0F1F7] text-xs font-semibold text-[#292C40]">
              Indexed Files ({filteredDocs.length})
            </div>

            <div className="divide-y divide-[#F0F1F7]">
              {filteredDocs.map((doc) => {
                const isSelected = activeDoc?.id === doc.id;

                return (
                  <div
                    key={doc.id}
                    onClick={() => {
                      setActiveDoc(doc);
                      setSelectedDoc(doc);
                      setQaAnswer(null);
                    }}
                    className={`p-3 cursor-pointer transition-colors flex items-start justify-between gap-3 ${
                      isSelected
                        ? "bg-[#EEEDFB]/50 border-l-3 border-[#655BDF]"
                        : "hover:bg-[#FBFBFE]"
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="p-1.5 rounded bg-slate-100 text-[#70758B] mt-0.5">
                        <FileText size={16} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-[#292C40] truncate">
                          {doc.name}
                        </div>
                        <div className="text-[10px] text-[#70758B] flex items-center gap-2 mt-0.5">
                          <span>{doc.size}</span>
                          <span>·</span>
                          <span>{doc.uploadedAt}</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[9px] font-mono uppercase bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                      {doc.type}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Document Viewer & AI Insights (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {activeDoc ? (
            <div className="bg-white border border-[#E8EAF2] rounded-xl p-5 space-y-5">
              {/* Document Header */}
              <div className="flex items-start justify-between border-b border-[#F0F1F7] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-[#292C40]">{activeDoc.name}</h3>
                    <span className="text-[10px] font-mono uppercase bg-[#EEEDFB] text-[#655BDF] px-1.5 py-0.2 rounded font-semibold">
                      {activeDoc.type}
                    </span>
                  </div>
                  <div className="text-xs text-[#70758B] mt-0.5">
                    Size: {activeDoc.size} · Uploaded: {activeDoc.uploadedAt}
                  </div>
                </div>

                <div className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  ✓ Indexed for MCP queries
                </div>
              </div>

              {/* AI Generated Executive Summary */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#655BDF]">
                  <Sparkles size={14} />
                  <span>AI Executive Summary</span>
                </div>
                <div className="p-3 bg-[#FBFBFE] border border-[#E8EAF2] rounded-lg text-xs text-[#292C40] leading-relaxed">
                  {activeDoc.summary}
                </div>
              </div>

              {/* Extracted Key Points */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-[#292C40]">Extracted Key Points</div>
                <ul className="space-y-1.5 text-xs text-[#70758B]">
                  {activeDoc.keyPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#655BDF] font-bold mt-0.5">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Items */}
              {activeDoc.actionItems && activeDoc.actionItems.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-[#292C40]">Detected Action Items</div>
                  <div className="space-y-1.5">
                    {activeDoc.actionItems.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 rounded-lg bg-[#F8F9FC] border border-[#E8EAF2] text-xs text-[#292C40]"
                      >
                        <span>{item}</span>
                        <span className="text-[10px] font-semibold text-[#655BDF] bg-[#EEEDFB] px-1.5 py-0.5 rounded">
                          Action Item
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ask Question About Document */}
              <div className="pt-3 border-t border-[#F0F1F7] space-y-3">
                <div className="text-xs font-semibold text-[#292C40]">
                  Ask Document Assistant
                </div>

                {qaAnswer && (
                  <div className="p-3 rounded-lg bg-[#EEEDFB]/40 border border-[#655BDF]/30 text-xs text-[#292C40] leading-relaxed">
                    <span className="font-semibold text-[#655BDF] block mb-1">Zynqo Answer:</span>
                    {qaAnswer}
                  </div>
                )}

                <form onSubmit={handleAskQuestion} className="flex gap-2">
                  <input
                    type="text"
                    value={qaQuestion}
                    onChange={(e) => setQaQuestion(e.target.value)}
                    placeholder={`Ask a question about ${activeDoc.name}...`}
                    className="flex-1 px-3 py-2 text-xs border border-[#E3E5EF] rounded-lg focus:outline-none focus:border-[#655BDF]"
                  />
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#655BDF] hover:bg-[#5449cf] text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
                  >
                    <Send size={13} />
                    <span>Ask</span>
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#E8EAF2] rounded-xl p-12 text-center text-xs text-[#9DA1B2]">
              Select a document from the left to view its summary and ask questions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
