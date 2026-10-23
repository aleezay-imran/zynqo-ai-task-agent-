"use client";

import { useEffect, useState } from "react";

type Task = {
  id: number;
  title: string;
  done: boolean;
};

type Message = {
  role: "user" | "assistant";
  text: string;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [taskInput, setTaskInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hi! I'm Zynqo. I can organize tasks, plan your day, draft emails, and help you understand text documents. What would you like to do?",
    },
  ]);
  const [documentText, setDocumentText] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [emailDraft, setEmailDraft] = useState("");
  const [activeTab, setActiveTab] = useState("Overview");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("zynqo-tasks");
      if (saved) setTasks(JSON.parse(saved));
    } catch {
      // Ignore invalid local data.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      localStorage.setItem("zynqo-tasks", JSON.stringify(tasks));
    }
  }, [tasks, ready]);

  function addTask(title: string) {
    const clean = title.trim();
    if (!clean) return;
    setTasks((old) => [
      ...old,
      { id: Date.now(), title: clean, done: false },
    ]);
  }

  function toggleTask(id: number) {
    setTasks((old) =>
      old.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  }

  function respond(prompt: string): string {
    const q = prompt.toLowerCase();

    if (
      q.includes("plan") ||
      q.includes("schedule") ||
      q.includes("organize my day")
    ) {
      const pending = tasks.filter((t) => !t.done);
      if (!pending.length) {
        return "Your task list is clear! Add your priorities first, and I'll organize them into a suggested daily plan.";
      }
      return "Here is your suggested plan:\n\n" +
        pending.map((t, i) =>
          `${i + 1}. ${t.title}${i === 0 ? " — start here" : ""}`
        ).join("\n") +
        "\n\nThis is a suggested order based on your current list, not a calendar booking.";
    }

    if (
      q.includes("summar") ||
      q.includes("document") ||
      q.includes("uploaded file")
    ) {
      if (!documentText) {
        return "Open Document Assistant and upload a .txt file first. I'll extract its key points and create a summary.";
      }
      const sentences = documentText
        .replace(/\s+/g, " ")
        .match(/[^.!?]+[.!?]*/g) || [documentText];
      return "Document: " + documentName + "\n\nKey points:\n" +
        sentences.slice(0, 5).map((s) => "• " + s.trim()).join("\n") +
        "\n\nThis is an extractive preview of the document, not an AI-generated interpretation.";
    }

    if (q.includes("email") || q.includes("draft") || q.includes("reply")) {
      setActiveTab("Email");
      return "I've opened Email Drafts for you. Enter the purpose of your message there, then edit the draft before sending it.";
    }

    if (q.includes("task") || q.includes("todo") || q.includes("to-do")) {
      const title = prompt
        .replace(/^(please\s+)?(add|create|make)\s+(a\s+)?(task|todo|to-do)(\s+to)?/i, "")
        .trim();
      if (title && title.toLowerCase() !== prompt.toLowerCase()) {
        addTask(title);
        return `Added "${title}" to your task list. You can mark it complete from Overview.`;
      }
      return `You have ${tasks.filter((t) => !t.done).length} pending tasks and ${tasks.filter((t) => t.done).length} completed tasks. Try: "Add task to finish my assignment".`;
    }

    if (q.includes("help") || q.includes("what can you")) {
      return "Try these commands:\n• Add task to finish my assignment\n• Plan my day\n• Summarize my document\n• Draft an email to my professor\n\nYou can also use the panels on the left to manage tasks, documents, and email drafts.";
    }

    return "I can help with tasks, daily planning, text documents, and email drafts. Try asking me to add a task or plan your day. Note: this demo uses local rules, not a connected generative AI model.";
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text) return;

    setMessages((old) => [...old, { role: "user", text }]);
    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessages((old) => [
          ...old,
          {
            role: "assistant",
            text: `Server error (${response.status}): ${
              data.error || "Unknown error"
            }`,
          },
        ]);
        return;
      }

      setMessages((old) => [
        ...old,
        { role: "assistant", text: data.reply },
      ]);
    } catch (error) {
      console.error("Chat error:", error);

      setMessages((old) => [
        ...old,
        {
          role: "assistant",
          text: "I couldn't connect to Zynqo AI right now. Please check the Gemini API setup and try again.",
        },
      ]);
    }
  }

  async function uploadDocument(file?: File) {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".txt")) {
      alert("For this prototype, please upload a .txt file.");
      return;
    }
    setDocumentText(await file.text());
    setDocumentName(file.name);
  }

  function createEmail() {
    setEmailDraft(
      "Subject: Request for Assistance\n\nDear Professor,\n\nI hope you are doing well. I am writing to discuss my request. I would appreciate your guidance when you have time.\n\nThank you for your time and consideration.\n\nBest regards"
    );
  }

  const pending = tasks.filter((t) => !t.done).length;
  const completed = tasks.filter((t) => t.done).length;

  const nav = ["Overview", "Tasks", "Planner", "Documents", "Email"];

  return (
    <main style={styles.page}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <div style={styles.logo}>Z</div>
          <div>
            <strong style={{ fontSize: 22 }}>zynqo</strong>
            <div style={styles.muted}>PERSONAL AI AGENT</div>
          </div>
        </div>

        <div style={styles.navLabel}>WORKSPACE</div>
        {nav.map((item) => (
          <button
            key={item}
            onClick={() => setActiveTab(item)}
            style={{
              ...styles.navButton,
              ...(activeTab === item ? styles.navActive : {}),
            }}
          >
            {item === "Overview" ? "◫" :
             item === "Tasks" ? "✓" :
             item === "Planner" ? "◷" :
             item === "Documents" ? "▤" : "✉"}
            <span>{item}</span>
          </button>
        ))}

        <div style={styles.sidebarBottom}>
          <div style={styles.statusDot} />
          <span>Local demo mode</span>
        </div>
      </aside>

      <section style={styles.main}>
        <header style={styles.header}>
          <div>
            <div style={styles.muted}>YOUR PERSONAL WORKSPACE</div>
            <h1 style={styles.heading}>{activeTab}</h1>
          </div>
          <div style={styles.profile}>
            <div style={styles.avatar}>Z</div>
            <div>
              <strong>My Workspace</strong>
              <div style={styles.muted}>Personal assistant</div>
            </div>
          </div>
        </header>

        {activeTab === "Overview" && (
          <>
            <div style={styles.welcome}>
              <div>
                <div style={{ color: "#C9C7FF", fontSize: 13 }}>
                  YOUR DAY, SIMPLIFIED
                </div>
                <h2 style={{ fontSize: 29, margin: "12px 0" }}>
                  Less busywork.<br />More meaningful work.
                </h2>
                <p style={{ color: "#D5D5E8", lineHeight: 1.7 }}>
                  Tell Zynqo what you need. Turn everyday intentions into
                  organized actions.
                </p>
                <button
                  style={styles.primaryButton}
                  onClick={() => {
                    setActiveTab("Tasks");
                  }}
                >
                  Organize my tasks →
                </button>
              </div>
              <div style={styles.orb}>✳</div>
            </div>

            <div style={styles.stats}>
              <Stat label="Pending tasks" value={pending} icon="◷" />
              <Stat label="Completed" value={completed} icon="✓" />
              <Stat label="Documents loaded" value={documentName ? 1 : 0} icon="▤" />
            </div>

            <div style={styles.columns}>
              <section style={styles.card}>
                <h3>Today's priorities</h3>
                <p style={styles.muted}>Your current task list</p>
                {tasks.length === 0 ? (
                  <p style={styles.empty}>No tasks yet. Add your first task below.</p>
                ) : tasks.slice(0, 5).map((task) => (
                  <TaskRow key={task.id} task={task} onToggle={toggleTask} />
                ))}
                <form
                  style={styles.addRow}
                  onSubmit={(e) => {
                    e.preventDefault();
                    addTask(taskInput);
                    setTaskInput("");
                  }}
                >
                  <input
                    style={styles.input}
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    placeholder="Add a task..."
                  />
                  <button style={styles.smallButton}>Add</button>
                </form>
              </section>

              <section style={styles.card}>
                <h3>Ask Zynqo</h3>
                <p style={styles.muted}>Your action-oriented assistant</p>
                <Chat
                  messages={messages}
                  input={input}
                  setInput={setInput}
                  sendMessage={sendMessage}
                />
              </section>
            </div>
          </>
        )}

        {activeTab === "Tasks" && (
          <section style={styles.card}>
            <h2>Task management</h2>
            <p style={styles.muted}>Add, track, and complete your tasks.</p>
            <form style={styles.addRow} onSubmit={(e) => {
              e.preventDefault();
              addTask(taskInput);
              setTaskInput("");
            }}>
              <input style={styles.input} value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                placeholder="What do you need to do?" />
              <button style={styles.smallButton}>Add task</button>
            </form>
            {tasks.map((task) => <TaskRow key={task.id} task={task} onToggle={toggleTask} />)}
            {tasks.length === 0 && <p style={styles.empty}>Your task list is empty.</p>}
          </section>
        )}

        {activeTab === "Planner" && (
          <section style={styles.card}>
            <h2>Your daily plan</h2>
            <p style={styles.muted}>A suggested order based on unfinished tasks.</p>
            {tasks.filter(t => !t.done).length === 0
              ? <p style={styles.empty}>Add some tasks to create a plan.</p>
              : tasks.filter(t => !t.done).map((task, i) => (
                <div key={task.id} style={styles.planRow}>
                  <div style={styles.planNumber}>{String(i + 1).padStart(2, "0")}</div>
                  <div>
                    <strong>{task.title}</strong>
                    <p style={styles.muted}>{i === 0 ? "Suggested first priority" : "Upcoming task"}</p>
                  </div>
                </div>
              ))}
            <p style={styles.note}>This is a suggested task order, not a calendar-integrated schedule.</p>
          </section>
        )}

        {activeTab === "Documents" && (
          <section style={styles.card}>
            <h2>Document assistant</h2>
            <p style={styles.muted}>Upload a plain-text file to extract key points.</p>
            <label style={styles.upload}>
              <span style={{ fontSize: 28 }}>⇧</span>
              <strong>Choose a .txt document</strong>
              <span style={styles.muted}>Text files only in this demo</span>
              <input type="file" accept=".txt,text/plain" style={{ display: "none" }}
                onChange={(e) => uploadDocument(e.target.files?.[0])} />
            </label>
            {documentName && (
              <div style={styles.documentBox}>
                <strong>✓ {documentName}</strong>
                <p>{documentText.slice(0, 700)}{documentText.length > 700 ? "..." : ""}</p>
                <button style={styles.smallButton} onClick={() => {
                  setInput("Summarize my document");
                  setMessages(old => [...old,
                    { role: "user", text: "Summarize my document" },
                    { role: "assistant", text: respond("Summarize my document") }
                  ]);
                }}>Extract key points</button>
              </div>
            )}
          </section>
        )}

        {activeTab === "Email" && (
          <section style={styles.card}>
            <h2>Smart communication</h2>
            <p style={styles.muted}>Create a professional email draft to review.</p>
            <button style={styles.smallButton} onClick={createEmail}>Generate sample email</button>
            <textarea style={styles.emailArea} value={emailDraft}
              onChange={(e) => setEmailDraft(e.target.value)}
              placeholder="Your email draft will appear here..." />
            <button style={styles.primaryButton} onClick={() => {
              navigator.clipboard?.writeText(emailDraft);
            }}>Copy draft</button>
            <p style={styles.note}>Review the draft before sending. This demo does not send emails.</p>
          </section>
        )}

        <footer style={styles.footer}>
          Zynqo AI · Hackathon prototype · Local demo mode
        </footer>
      </section>
    </main>
  );
}

function Stat({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div style={styles.stat}>
      <div style={styles.statIcon}>{icon}</div>
      <div style={{ fontSize: 25, fontWeight: 700 }}>{value}</div>
      <div style={styles.muted}>{label}</div>
    </div>
  );
}

function TaskRow({ task, onToggle }: {
  task: Task;
  onToggle: (id: number) => void;
}) {
  return (
    <div style={styles.taskRow}>
      <input type="checkbox" checked={task.done}
        onChange={() => onToggle(task.id)} />
      <span style={{
        flex: 1,
        textDecoration: task.done ? "line-through" : "none",
        color: task.done ? "#9296A9" : "#292C40",
      }}>{task.title}</span>
      <span style={styles.taskTag}>{task.done ? "Done" : "Pending"}</span>
    </div>
  );
}

function Chat({ messages, input, setInput, sendMessage }: {
  messages: Message[];
  input: string;
  setInput: (value: string) => void;
  sendMessage: () => void;
}) {
  return (
    <>
      <div style={styles.chatBox}>
        {messages.slice(-8).map((message, i) => (
          <div key={i} style={{
            ...styles.bubble,
            ...(message.role === "user" ? styles.userBubble : styles.aiBubble),
          }}>
            <div style={styles.bubbleLabel}>
              {message.role === "user" ? "YOU" : "ZYNQO"}
            </div>
            <div style={{ whiteSpace: "pre-wrap" }}>{message.text}</div>
          </div>
        ))}
      </div>
      <form style={styles.chatInputRow} onSubmit={(e) => {
        e.preventDefault();
        sendMessage();
      }}>
        <input style={styles.input} value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Zynqo to do something..." />
        <button style={styles.smallButton}>Send</button>
      </form>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { display: "flex", minHeight: "100vh", background: "#F6F7FB", color: "#292C40", fontFamily: "Arial, sans-serif" },
  sidebar: { width: 225, flexShrink: 0, background: "#FFFFFF", borderRight: "1px solid #E8EAF2", padding: "28px 16px", display: "flex", flexDirection: "column", gap: 8 },
  brand: { display: "flex", alignItems: "center", gap: 12, padding: "0 8px 35px" },
  logo: { background: "#6258DB", color: "white", width: 43, height: 43, borderRadius: 14, display: "grid", placeItems: "center", fontSize: 25, fontWeight: 700 },
  muted: { color: "#85899F", fontSize: 12, lineHeight: 1.6 },
  navLabel: { color: "#9DA1B2", fontSize: 10, letterSpacing: 1.5, padding: "0 12px", marginBottom: 8 },
  navButton: { display: "flex", gap: 12, alignItems: "center", border: 0, borderRadius: 10, padding: "13px 14px", background: "transparent", color: "#70758B", textAlign: "left", cursor: "pointer", fontSize: 14 },
  navActive: { background: "#EFEEFF", color: "#5C52CE", fontWeight: 700 },
  sidebarBottom: { marginTop: "auto", display: "flex", gap: 8, alignItems: "center", padding: 12, color: "#777D91", fontSize: 12 },
  statusDot: { width: 8, height: 8, borderRadius: 10, background: "#E5A445" },
  main: { flex: 1, padding: "28px clamp(16px, 4vw, 48px)", minWidth: 0 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 15, marginBottom: 28 },
  heading: { fontSize: 30, margin: "6px 0", letterSpacing: -0.8 },
  profile: { display: "flex", alignItems: "center", gap: 10, fontSize: 12 },
  avatar: { width: 38, height: 38, borderRadius: 20, background: "#E5E2FF", color: "#5D53D0", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 18 },
  welcome: { background: "linear-gradient(120deg,#242546,#49449B)", borderRadius: 20, padding: "30px clamp(20px, 4vw, 42px)", display: "flex", justifyContent: "space-between", alignItems: "center", color: "white", gap: 15 },
  orb: { width: 110, height: 110, borderRadius: 80, background: "radial-gradient(circle at 35% 30%,#B7B1FF,#7770E8 45%,#302D6C)", display: "grid", placeItems: "center", fontSize: 50, flexShrink: 0, boxShadow: "0 0 45px #8178FF55" },
  primaryButton: { background: "#655BDF", color: "white", border: 0, borderRadius: 9, padding: "12px 17px", cursor: "pointer", fontWeight: 700, marginTop: 12 },
  stats: { display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 16, margin: "20px 0" },
  stat: { background: "white", border: "1px solid #EBEDF4", borderRadius: 14, padding: 18 },
  statIcon: { color: "#655BDF", fontSize: 19, marginBottom: 8 },
  columns: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,310px),1fr))", gap: 18 },
  card: { background: "white", border: "1px solid #EBEDF4", borderRadius: 16, padding: 22, marginBottom: 16, minWidth: 0 },
  addRow: { display: "flex", gap: 8, marginTop: 18 },
  input: { width: "100%", minWidth: 0, padding: "12px 13px", border: "1px solid #E3E5EF", borderRadius: 9, outlineColor: "#7770E8", fontSize: 13, background: "white", color: "#292C40" },
  smallButton: { border: 0, borderRadius: 9, padding: "11px 15px", background: "#655BDF", color: "white", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },
  taskRow: { display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid #F0F1F6", padding: "13px 0", fontSize: 13 },
  taskTag: { color: "#7771CE", background: "#F0EFFF", borderRadius: 6, padding: "4px 7px", fontSize: 10 },
  empty: { color: "#9296A9", fontSize: 13, padding: "14px 0" },
  chatBox: { display: "flex", flexDirection: "column", gap: 10, marginTop: 14, maxHeight: 360, overflowY: "auto" },
  bubble: { borderRadius: 12, padding: 12, fontSize: 12, lineHeight: 1.65, whiteSpace: "pre-wrap" },
  aiBubble: { background: "#F3F3FA", alignSelf: "flex-start", maxWidth: "95%" },
  userBubble: { background: "#EAE8FF", alignSelf: "flex-end", maxWidth: "95%" },
  bubbleLabel: { fontSize: 9, color: "#7770C9", fontWeight: 700, letterSpacing: 1, marginBottom: 5 },
  chatInputRow: { display: "flex", gap: 7, marginTop: 14 },
  planRow: { display: "flex", gap: 15, alignItems: "center", borderBottom: "1px solid #F0F1F6", padding: "15px 0" },
  planNumber: { color: "#655BDF", fontSize: 19, fontWeight: 700, background: "#F0EFFF", borderRadius: 10, padding: 12 },
  note: { fontSize: 11, color: "#898DA0", lineHeight: 1.7, marginTop: 16 },
  upload: { marginTop: 18, border: "2px dashed #D9D8F0", borderRadius: 14, minHeight: 170, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", color: "#6258D4" },
  documentBox: { marginTop: 18, padding: 16, background: "#F7F7FC", borderRadius: 12, fontSize: 13, lineHeight: 1.7, overflowWrap: "anywhere" },
  emailArea: { width: "100%", minHeight: 240, padding: 14, marginTop: 18, border: "1px solid #E3E5EF", borderRadius: 10, resize: "vertical", font: "13px Arial", lineHeight: 1.7, color: "#292C40", background: "white" },
  footer: { textAlign: "center", color: "#A0A3B3", fontSize: 11, padding: "30px 0 10px" },
};