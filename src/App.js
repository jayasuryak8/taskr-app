import { useState, useEffect, useCallback, useRef } from "react";

// ─── DESIGN SYSTEM ─────────────────────────────────────────────────────────
// Aesthetic: Industrial Utility — raw, functional, confident.
// Palette: near-black canvas, warm amber accents, steel grays.
// Typefaces: "Syne" (display) + "DM Mono" (data/code feel)
// ────────────────────────────────────────────────────────────────────────────

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #0e0e0f;
    --surface:   #17171a;
    --panel:     #1f1f24;
    --border:    #2e2e35;
    --amber:     #f5a623;
    --amber-dim: #c07f10;
    --red:       #e05252;
    --green:     #4caf7d;
    --blue:      #5b8cf7;
    --text:      #e8e8ec;
    --muted:     #7a7a8c;
    --radius:    6px;
    --mono: 'DM Mono', monospace;
    --sans: 'Syne', sans-serif;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--mono);
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  /* ── Animations ── */
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; } to { opacity: 1; }
  }
  @keyframes pulse {
    0%,100% { opacity:1; } 50% { opacity:0.4; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }
  @keyframes toast-in {
    from { opacity:0; transform: translateX(100%); }
    to   { opacity:1; transform: translateX(0); }
  }
  @keyframes toast-out {
    from { opacity:1; transform: translateX(0); }
    to   { opacity:0; transform: translateX(100%); }
  }

  .animate-slideUp { animation: slideUp .3s ease both; }

  /* ── Layout ── */
  .app-shell {
    display: grid;
    grid-template-rows: auto 1fr;
    min-height: 100vh;
  }

  /* ── Topbar ── */
  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 28px;
    height: 56px;
    border-bottom: 1px solid var(--border);
    background: var(--surface);
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .logo {
    font-family: var(--sans);
    font-weight: 800;
    font-size: 18px;
    letter-spacing: -0.5px;
    color: var(--amber);
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .logo-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--amber);
    animation: pulse 2s infinite;
  }
  .user-chip {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: var(--muted);
  }
  .avatar {
    width: 32px; height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--amber), var(--amber-dim));
    display: flex; align-items: center; justify-content: center;
    font-family: var(--sans);
    font-weight: 700;
    font-size: 13px;
    color: #000;
  }
  .btn-logout {
    background: none;
    border: 1px solid var(--border);
    color: var(--muted);
    padding: 4px 12px;
    border-radius: var(--radius);
    cursor: pointer;
    font-family: var(--mono);
    font-size: 12px;
    transition: all .15s;
  }
  .btn-logout:hover { border-color: var(--red); color: var(--red); }

  /* ── Main area ── */
  .main {
    display: grid;
    grid-template-columns: 260px 1fr;
    height: calc(100vh - 56px);
    overflow: hidden;
  }

  /* ── Sidebar ── */
  .sidebar {
    border-right: 1px solid var(--border);
    background: var(--surface);
    display: flex;
    flex-direction: column;
    padding: 20px 0;
    overflow-y: auto;
  }
  .sidebar-section {
    padding: 0 16px 20px;
  }
  .sidebar-label {
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 10px;
    padding: 0 8px;
  }
  .filter-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 8px 10px;
    border-radius: var(--radius);
    border: none;
    background: transparent;
    color: var(--muted);
    font-family: var(--mono);
    font-size: 13px;
    cursor: pointer;
    transition: all .15s;
    text-align: left;
  }
  .filter-btn:hover { background: var(--panel); color: var(--text); }
  .filter-btn.active { background: var(--panel); color: var(--amber); }
  .filter-btn .count {
    margin-left: auto;
    font-size: 11px;
    background: var(--border);
    padding: 1px 7px;
    border-radius: 20px;
    color: var(--muted);
  }
  .filter-btn.active .count { background: var(--amber-dim); color: var(--amber); }

  .priority-dot {
    width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
  }

  /* ── Stats row ── */
  .stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin: 16px;
    margin-top: 0;
  }
  .stat-card {
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 12px;
  }
  .stat-value {
    font-family: var(--sans);
    font-size: 22px;
    font-weight: 700;
    line-height: 1;
  }
  .stat-label {
    font-size: 10px;
    color: var(--muted);
    margin-top: 4px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .progress-bar {
    height: 3px;
    background: var(--border);
    border-radius: 2px;
    margin-top: 8px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    background: var(--green);
    border-radius: 2px;
    transition: width .6s ease;
  }

  /* ── Content area ── */
  .content {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .content-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px 24px;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }
  .content-title {
    font-family: var(--sans);
    font-weight: 700;
    font-size: 20px;
  }
  .btn-new {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 6px;
    background: var(--amber);
    color: #000;
    border: none;
    padding: 8px 16px;
    border-radius: var(--radius);
    font-family: var(--sans);
    font-weight: 700;
    font-size: 13px;
    cursor: pointer;
    transition: all .15s;
    white-space: nowrap;
  }
  .btn-new:hover { background: #ffc04a; transform: translateY(-1px); }

  .search-box {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 7px 12px;
    flex: 1;
    max-width: 320px;
  }
  .search-box input {
    background: none;
    border: none;
    outline: none;
    color: var(--text);
    font-family: var(--mono);
    font-size: 13px;
    width: 100%;
  }
  .search-box input::placeholder { color: var(--muted); }

  /* ── Task list ── */
  .task-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 16px 24px;
  }
  .task-group-label {
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 8px;
    margin-top: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .task-group-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }
  .task-card {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 14px 16px;
    margin-bottom: 8px;
    cursor: pointer;
    transition: all .15s;
    animation: slideUp .25s ease both;
  }
  .task-card:hover {
    border-color: var(--amber-dim);
    background: var(--panel);
    transform: translateX(2px);
  }
  .task-card.done {
    opacity: 0.5;
  }
  .task-check {
    width: 18px; height: 18px;
    border-radius: 4px;
    border: 2px solid var(--border);
    flex-shrink: 0;
    margin-top: 2px;
    cursor: pointer;
    transition: all .15s;
    display: flex; align-items: center; justify-content: center;
  }
  .task-check:hover { border-color: var(--amber); }
  .task-check.checked {
    background: var(--green);
    border-color: var(--green);
  }
  .task-body { flex: 1; min-width: 0; }
  .task-title {
    font-size: 14px;
    font-weight: 500;
    line-height: 1.4;
    color: var(--text);
  }
  .task-card.done .task-title {
    text-decoration: line-through;
    color: var(--muted);
  }
  .task-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 6px;
    flex-wrap: wrap;
  }
  .tag {
    font-size: 10px;
    padding: 2px 8px;
    border-radius: 20px;
    background: var(--panel);
    border: 1px solid var(--border);
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .tag.priority-high   { border-color: #e0525240; color: var(--red); background: #e0525210; }
  .tag.priority-medium { border-color: #f5a62340; color: var(--amber); background: #f5a62310; }
  .tag.priority-low    { border-color: #4caf7d40; color: var(--green); background: #4caf7d10; }

  .task-actions {
    display: flex;
    gap: 4px;
    opacity: 0;
    transition: opacity .15s;
  }
  .task-card:hover .task-actions { opacity: 1; }
  .icon-btn {
    width: 28px; height: 28px;
    border-radius: var(--radius);
    border: 1px solid transparent;
    background: transparent;
    color: var(--muted);
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px;
    transition: all .15s;
  }
  .icon-btn:hover { background: var(--border); color: var(--text); border-color: var(--border); }
  .icon-btn.danger:hover { background: #e0525220; color: var(--red); border-color: var(--red); }

  /* ── Empty state ── */
  .empty {
    text-align: center;
    padding: 60px 20px;
    color: var(--muted);
    animation: fadeIn .4s ease;
  }
  .empty-icon { font-size: 40px; margin-bottom: 16px; opacity: 0.4; }
  .empty-title { font-family: var(--sans); font-size: 18px; color: var(--text); margin-bottom: 8px; }
  .empty-desc { font-size: 13px; }

  /* ── Modal ── */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,.7);
    backdrop-filter: blur(4px);
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn .2s ease;
    padding: 20px;
  }
  .modal {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    width: 100%;
    max-width: 480px;
    padding: 28px;
    animation: slideUp .25s ease;
    box-shadow: 0 32px 64px rgba(0,0,0,.5);
  }
  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
  }
  .modal-title {
    font-family: var(--sans);
    font-weight: 700;
    font-size: 18px;
  }

  /* ── Form ── */
  .form-group { margin-bottom: 18px; }
  .form-label {
    display: block;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--muted);
    margin-bottom: 8px;
  }
  .form-input, .form-textarea, .form-select {
    width: 100%;
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    color: var(--text);
    font-family: var(--mono);
    font-size: 13px;
    padding: 10px 14px;
    outline: none;
    transition: border-color .15s;
  }
  .form-input:focus, .form-textarea:focus, .form-select:focus {
    border-color: var(--amber);
  }
  .form-textarea { resize: vertical; min-height: 80px; }
  .form-select option { background: var(--panel); }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

  .btn-row { display: flex; gap: 10px; justify-content: flex-end; margin-top: 24px; }
  .btn-cancel {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--muted);
    padding: 9px 20px;
    border-radius: var(--radius);
    font-family: var(--mono);
    font-size: 13px;
    cursor: pointer;
    transition: all .15s;
  }
  .btn-cancel:hover { border-color: var(--text); color: var(--text); }
  .btn-submit {
    background: var(--amber);
    border: none;
    color: #000;
    padding: 9px 24px;
    border-radius: var(--radius);
    font-family: var(--sans);
    font-weight: 700;
    font-size: 13px;
    cursor: pointer;
    transition: all .15s;
  }
  .btn-submit:hover { background: #ffc04a; }

  /* ── Auth screen ── */
  .auth-screen {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background:
      radial-gradient(ellipse 60% 50% at 20% 20%, #f5a62310 0%, transparent 60%),
      radial-gradient(ellipse 50% 60% at 80% 80%, #5b8cf710 0%, transparent 60%),
      var(--bg);
    padding: 20px;
  }
  .auth-box {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 40px;
    width: 100%;
    max-width: 400px;
    animation: slideUp .35s ease;
    box-shadow: 0 40px 80px rgba(0,0,0,.6);
  }
  .auth-logo {
    font-family: var(--sans);
    font-weight: 800;
    font-size: 26px;
    color: var(--amber);
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .auth-tagline {
    font-size: 13px;
    color: var(--muted);
    margin-bottom: 32px;
  }
  .auth-tabs {
    display: flex;
    gap: 0;
    margin-bottom: 28px;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
  }
  .auth-tab {
    flex: 1;
    padding: 10px;
    background: transparent;
    border: none;
    color: var(--muted);
    font-family: var(--mono);
    font-size: 13px;
    cursor: pointer;
    transition: all .15s;
  }
  .auth-tab.active { background: var(--panel); color: var(--text); }

  /* ── Toast ── */
  .toast-container {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 999;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .toast {
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 12px 18px;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 220px;
    animation: toast-in .3s ease;
    box-shadow: 0 8px 24px rgba(0,0,0,.4);
  }
  .toast.success { border-color: #4caf7d40; }
  .toast.error   { border-color: #e0525240; }

  /* ── Due date ── */
  .due-label {
    font-size: 11px;
    color: var(--muted);
  }
  .due-label.overdue { color: var(--red); }
  .due-label.soon    { color: var(--amber); }

  /* ── Spinner ── */
  .spinner {
    width: 16px; height: 16px;
    border: 2px solid transparent;
    border-top-color: currentColor;
    border-radius: 50%;
    animation: spin .7s linear infinite;
  }

  /* ── Responsive ── */
  @media (max-width: 720px) {
    .main { grid-template-columns: 1fr; }
    .sidebar { display: none; }
    .content-header { padding: 14px 16px; flex-wrap: wrap; }
    .task-scroll { padding: 12px 16px; }
    .topbar { padding: 0 16px; }
    .search-box { max-width: 100%; }
    .form-row { grid-template-columns: 1fr; }
  }
`;

// ─── CONSTANTS ──────────────────────────────────────────────────────────────
const PRIORITIES = ["low", "medium", "high"];
const CATEGORIES = ["work", "personal", "health", "learning", "other"];
const STATUSES   = ["todo", "in-progress", "done"];

const STATUS_ICONS = { "todo": "○", "in-progress": "◑", "done": "●" };
const PRIORITY_COLORS = { low: "#4caf7d", medium: "#f5a623", high: "#e05252" };

const DEMO_TASKS = [
  { id: "1", title: "Design system audit", description: "Review all UI components for consistency", priority: "high", status: "in-progress", category: "work", due: "2026-06-05", createdAt: Date.now() - 86400000 * 2 },
  { id: "2", title: "Set up CI/CD pipeline", description: "Configure GitHub Actions for automated deploys", priority: "high", status: "todo", category: "work", due: "2026-06-08", createdAt: Date.now() - 86400000 },
  { id: "3", title: "Morning run 5k", description: "", priority: "medium", status: "done", category: "health", due: "2026-06-02", createdAt: Date.now() - 86400000 * 3 },
  { id: "4", title: "Read 'Thinking Fast and Slow'", description: "Chapter 12 onwards", priority: "low", status: "todo", category: "learning", due: "2026-06-15", createdAt: Date.now() - 86400000 * 4 },
  { id: "5", title: "Grocery shopping", description: "Vegetables, oats, coffee", priority: "medium", status: "todo", category: "personal", due: "2026-06-03", createdAt: Date.now() },
];

const DEMO_USERS = [
  { email: "demo@tasks.io", password: "demo123", name: "Alex Demo" },
];

// ─── HELPERS ────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 9);

const getDueStatus = (due) => {
  if (!due) return null;
  const now = new Date(); now.setHours(0,0,0,0);
  const d = new Date(due);
  const diff = Math.ceil((d - now) / 86400000);
  if (diff < 0)  return "overdue";
  if (diff <= 2) return "soon";
  return "ok";
};

const formatDue = (due) => {
  if (!due) return null;
  const d = new Date(due);
  const now = new Date(); now.setHours(0,0,0,0);
  const diff = Math.ceil((d - now) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  if (diff < 0) return `${Math.abs(diff)}d overdue`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// ─── TOASTS ─────────────────────────────────────────────────────────────────
let toastId = 0;
const ToastContext = {};

const ToastContainer = ({ toasts }) => (
  <div className="toast-container">
    {toasts.map(t => (
      <div key={t.id} className={`toast ${t.type}`}>
        <span>{t.type === "success" ? "✓" : "✕"}</span>
        {t.msg}
      </div>
    ))}
  </div>
);

// ─── AUTH SCREEN ─────────────────────────────────────────────────────────────
const AuthScreen = ({ onLogin }) => {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async () => {
    setErr(""); setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    if (tab === "login") {
      const user = DEMO_USERS.find(u => u.email === form.email && u.password === form.password);
      if (!user) { setErr("Invalid credentials. Try demo@tasks.io / demo123"); setLoading(false); return; }
      onLogin(user);
    } else {
      if (!form.name || !form.email || !form.password) { setErr("All fields required"); setLoading(false); return; }
      if (form.password.length < 6) { setErr("Password must be 6+ characters"); setLoading(false); return; }
      const newUser = { email: form.email, password: form.password, name: form.name };
      DEMO_USERS.push(newUser);
      onLogin(newUser);
    }
    setLoading(false);
  };

  return (
    <div className="auth-screen">
      <div className="auth-box">
        <div className="auth-logo">
          <span style={{ color: "var(--amber)" }}>⬡</span> TASKR
        </div>
        <div className="auth-tagline">Industrial-strength task management.</div>

        <div className="auth-tabs">
          <button className={`auth-tab ${tab==="login"?"active":""}`} onClick={() => setTab("login")}>Sign In</button>
          <button className={`auth-tab ${tab==="signup"?"active":""}`} onClick={() => setTab("signup")}>Sign Up</button>
        </div>

        {tab === "signup" && (
          <div className="form-group">
            <label className="form-label">Name</label>
            <input className="form-input" name="name" placeholder="Your name" value={form.name} onChange={handle} />
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handle}
            onKeyDown={e => e.key === "Enter" && submit()} />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" name="password" type="password" placeholder="••••••••" value={form.password} onChange={handle}
            onKeyDown={e => e.key === "Enter" && submit()} />
        </div>

        {err && <div style={{ color:"var(--red)", fontSize:12, marginBottom:14 }}>{err}</div>}

        <button className="btn-submit" style={{ width:"100%", padding:"11px" }} onClick={submit} disabled={loading}>
          {loading ? <span style={{display:"flex",alignItems:"center",gap:8,justifyContent:"center"}}><span className="spinner"/>Processing…</span>
                   : tab === "login" ? "Sign In" : "Create Account"}
        </button>

        {tab === "login" && (
          <div style={{ marginTop:16, fontSize:12, color:"var(--muted)", textAlign:"center" }}>
            Demo → <span style={{color:"var(--amber)"}}>demo@tasks.io</span> / <span style={{color:"var(--amber)"}}>demo123</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── TASK FORM ───────────────────────────────────────────────────────────────
const TaskForm = ({ initial, onSave, onClose }) => {
  const [form, setForm] = useState({
    title: "", description: "", priority: "medium", status: "todo",
    category: "work", due: "", ...initial
  });

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const submit = () => {
    if (!form.title.trim()) return;
    onSave(form);
  };

  return (
    <div className="modal-backdrop" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{initial?.id ? "Edit Task" : "New Task"}</div>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>

        <div className="form-group">
          <label className="form-label">Title *</label>
          <input className="form-input" name="title" placeholder="What needs to be done?" value={form.title} onChange={handle}
            autoFocus onKeyDown={e => e.key === "Enter" && submit()} />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-textarea" name="description" placeholder="Optional details…" value={form.description} onChange={handle} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select className="form-select" name="priority" value={form.priority} onChange={handle}>
              {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" name="status" value={form.status} onChange={handle}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" name="category" value={form.category} onChange={handle}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Due Date</label>
            <input className="form-input" name="due" type="date" value={form.due} onChange={handle} />
          </div>
        </div>

        <div className="btn-row">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-submit" onClick={submit} disabled={!form.title.trim()}>
            {initial?.id ? "Save Changes" : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── TASK CARD ───────────────────────────────────────────────────────────────
const TaskCard = ({ task, onToggle, onEdit, onDelete }) => {
  const dueStatus = getDueStatus(task.due);
  const dueLabel  = formatDue(task.due);
  const done      = task.status === "done";

  return (
    <div className={`task-card ${done?"done":""}`} onClick={() => onEdit(task)}>
      <div
        className={`task-check ${done?"checked":""}`}
        onClick={e => { e.stopPropagation(); onToggle(task.id); }}
        title="Toggle done"
      >
        {done && <span style={{ fontSize:11, color:"#fff", lineHeight:1 }}>✓</span>}
      </div>

      <div className="task-body">
        <div className="task-title">{task.title}</div>
        {task.description && (
          <div style={{ fontSize:12, color:"var(--muted)", marginTop:4, lineHeight:1.5 }}>
            {task.description.length > 80 ? task.description.slice(0,80)+"…" : task.description}
          </div>
        )}
        <div className="task-meta">
          <span className={`tag priority-${task.priority}`}>{task.priority}</span>
          <span className="tag">{task.category}</span>
          <span className="tag">{STATUS_ICONS[task.status]} {task.status}</span>
          {dueLabel && (
            <span className={`due-label ${dueStatus!=="ok"?dueStatus:""}`}>
              {dueStatus === "overdue" ? "⚑ " : dueStatus === "soon" ? "⏰ " : "📅 "}
              {dueLabel}
            </span>
          )}
        </div>
      </div>

      <div className="task-actions" onClick={e => e.stopPropagation()}>
        <button className="icon-btn" title="Edit" onClick={() => onEdit(task)}>✎</button>
        <button className="icon-btn danger" title="Delete" onClick={() => onDelete(task.id)}>⌫</button>
      </div>
    </div>
  );
};

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState(DEMO_TASKS);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // null | "new" | task object
  const [toasts, setToasts] = useState([]);

  // ── Toast helper ──
  const toast = useCallback((msg, type = "success") => {
    const id = ++toastId;
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  }, []);

  // ── CRUD ──
  const createTask = (form) => {
    const t = { ...form, id: uid(), createdAt: Date.now() };
    setTasks(ts => [t, ...ts]);
    setModal(null);
    toast("Task created");
  };

  const updateTask = (form) => {
    setTasks(ts => ts.map(t => t.id === form.id ? { ...t, ...form } : t));
    setModal(null);
    toast("Task updated");
  };

  const deleteTask = (id) => {
    setTasks(ts => ts.filter(t => t.id !== id));
    toast("Task deleted", "error");
  };

  const toggleTask = (id) => {
    setTasks(ts => ts.map(t =>
      t.id === id ? { ...t, status: t.status === "done" ? "todo" : "done" } : t
    ));
  };

  // ── Filtering ──
  const filtered = tasks.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = !q || t.title.toLowerCase().includes(q) || (t.description||"").toLowerCase().includes(q);
    if (!matchSearch) return false;
    if (filter === "all") return true;
    if (filter === "done") return t.status === "done";
    if (filter === "active") return t.status !== "done";
    if (PRIORITIES.includes(filter)) return t.priority === filter;
    if (CATEGORIES.includes(filter)) return t.category === filter;
    if (filter === "overdue") return getDueStatus(t.due) === "overdue";
    return true;
  });

  // Stats
  const total  = tasks.length;
  const done   = tasks.filter(t => t.status === "done").length;
  const pct    = total ? Math.round((done / total) * 100) : 0;
  const overdue = tasks.filter(t => getDueStatus(t.due) === "overdue" && t.status !== "done").length;

  const counts = {
    all: tasks.length,
    active: tasks.filter(t => t.status !== "done").length,
    done: tasks.filter(t => t.status === "done").length,
    overdue: overdue,
    high: tasks.filter(t => t.priority === "high").length,
    medium: tasks.filter(t => t.priority === "medium").length,
    low: tasks.filter(t => t.priority === "low").length,
    ...Object.fromEntries(CATEGORIES.map(c => [c, tasks.filter(t => t.category === c).length])),
  };

  // Group filtered tasks
  const grouped = {
    overdue: filtered.filter(t => getDueStatus(t.due) === "overdue" && t.status !== "done"),
    active:  filtered.filter(t => t.status !== "done" && getDueStatus(t.due) !== "overdue"),
    done:    filtered.filter(t => t.status === "done"),
  };

  if (!user) return (
    <>
      <style>{STYLES}</style>
      <AuthScreen onLogin={setUser} />
    </>
  );

  return (
    <>
      <style>{STYLES}</style>
      <div className="app-shell">

        {/* ── TOPBAR ── */}
        <header className="topbar">
          <div className="logo">
            <span>⬡</span> TASKR
            <div className="logo-dot" />
          </div>
          <div className="user-chip">
            <div className="avatar">{user.name[0].toUpperCase()}</div>
            <span style={{color:"var(--text)"}}>{user.name}</span>
            <button className="btn-logout" onClick={() => setUser(null)}>Sign out</button>
          </div>
        </header>

        <div className="main">
          {/* ── SIDEBAR ── */}
          <aside className="sidebar">
            {/* Stats */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value" style={{ color:"var(--amber)" }}>{total}</div>
                <div className="stat-label">Total</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color:"var(--green)" }}>{done}</div>
                <div className="stat-label">Completed</div>
                <div style={{ fontSize:11, color:"var(--muted)", marginTop:8 }}>{pct}% done</div>
              </div>
              {overdue > 0 && (
                <div className="stat-card" style={{ gridColumn:"1/-1" }}>
                  <div className="stat-value" style={{ color:"var(--red)" }}>⚑ {overdue}</div>
                  <div className="stat-label">Overdue</div>
                </div>
              )}
            </div>

            {/* Views */}
            <div className="sidebar-section">
              <div className="sidebar-label">Views</div>
              {[["all","◈ All tasks"],["active","◑ Active"],["done","● Done"],["overdue","⚑ Overdue"]].map(([k,l]) => (
                <button key={k} className={`filter-btn ${filter===k?"active":""}`} onClick={() => setFilter(k)}>
                  {l} <span className="count">{counts[k]}</span>
                </button>
              ))}
            </div>

            {/* Priority */}
            <div className="sidebar-section">
              <div className="sidebar-label">Priority</div>
              {PRIORITIES.map(p => (
                <button key={p} className={`filter-btn ${filter===p?"active":""}`} onClick={() => setFilter(p)}>
                  <span className="priority-dot" style={{ background: PRIORITY_COLORS[p] }} />
                  {p.charAt(0).toUpperCase()+p.slice(1)}
                  <span className="count">{counts[p]}</span>
                </button>
              ))}
            </div>

            {/* Categories */}
            <div className="sidebar-section">
              <div className="sidebar-label">Category</div>
              {CATEGORIES.map(c => (
                <button key={c} className={`filter-btn ${filter===c?"active":""}`} onClick={() => setFilter(c)}>
                  {c.charAt(0).toUpperCase()+c.slice(1)}
                  <span className="count">{counts[c]}</span>
                </button>
              ))}
            </div>
          </aside>

          {/* ── CONTENT ── */}
          <div className="content">
            <div className="content-header">
              <div className="content-title">
                {filter === "all" ? "All Tasks" : filter.charAt(0).toUpperCase()+filter.slice(1)}
              </div>

              <div className="search-box">
                <span style={{ color:"var(--muted)" }}>⌕</span>
                <input
                  placeholder="Search tasks…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                {search && <span style={{ cursor:"pointer", color:"var(--muted)", fontSize:12 }} onClick={() => setSearch("")}>✕</span>}
              </div>

              <button className="btn-new" onClick={() => setModal("new")}>
                <span>+</span> New Task
              </button>
            </div>

            <div className="task-scroll">
              {filtered.length === 0 ? (
                <div className="empty">
                  <div className="empty-icon">◈</div>
                  <div className="empty-title">{search ? "No matches found" : "No tasks here"}</div>
                  <div className="empty-desc">
                    {search ? "Try a different search term." : "Create a task to get started."}
                  </div>
                </div>
              ) : (
                <>
                  {grouped.overdue.length > 0 && (
                    <>
                      <div className="task-group-label" style={{ color:"var(--red)" }}>⚑ Overdue</div>
                      {grouped.overdue.map((t,i) => (
                        <div key={t.id} style={{ animationDelay: `${i*40}ms` }}>
                          <TaskCard task={t} onToggle={toggleTask} onEdit={setModal} onDelete={deleteTask} />
                        </div>
                      ))}
                    </>
                  )}
                  {grouped.active.length > 0 && (
                    <>
                      <div className="task-group-label">Active</div>
                      {grouped.active.map((t,i) => (
                        <div key={t.id} style={{ animationDelay: `${i*40}ms` }}>
                          <TaskCard task={t} onToggle={toggleTask} onEdit={setModal} onDelete={deleteTask} />
                        </div>
                      ))}
                    </>
                  )}
                  {grouped.done.length > 0 && (
                    <>
                      <div className="task-group-label">Completed</div>
                      {grouped.done.map((t,i) => (
                        <div key={t.id} style={{ animationDelay: `${i*40}ms` }}>
                          <TaskCard task={t} onToggle={toggleTask} onEdit={setModal} onDelete={deleteTask} />
                        </div>
                      ))}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── MODAL ── */}
      {modal && (
        <TaskForm
          initial={modal === "new" ? undefined : modal}
          onSave={modal === "new" ? createTask : updateTask}
          onClose={() => setModal(null)}
        />
      )}

      {/* ── TOASTS ── */}
      <ToastContainer toasts={toasts} />
    </>
  );
}
