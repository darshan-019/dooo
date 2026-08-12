# Ledger — Long-Term Routine & Task Manager

A modern, responsive daily planner, habit tracker, and long-term routine manager. Track tasks and routines across any date — today, tomorrow, or years into the past or future — with full recurrence support, statistics, and history.

**100% static. No backend, no build step, no server required.** All data is stored locally in your browser via `localStorage`.

---

## Features

- **Multi-year task tracking** — every date, past or future, has its own tasks and completion history
- **Dashboard** with daily progress, completed/remaining counts, and current/next task
- **Timeline view** of the day's schedule
- **Recurring tasks** — daily, weekly (specific weekdays), or custom N-day intervals, with optional end dates
- **Routine templates** ("My Routines") you can apply to any date
- **Calendar, Week, History, and Statistics views**
- **Streak tracking**, category hours, and completion percentages — all calculated from real stored data
- **Categories**, **global search** across your entire history, **filters**
- **Import/Export** your data as a JSON backup
- **Dark theme**, fully responsive (desktop sidebar / mobile bottom nav)

---

## Project Structure

```
ledger/
├── index.html              Shell: markup + <link>/<script> references
├── css/
│   ├── base.css             Theme variables, resets, scrollbars
│   ├── layout.css           Sidebar, topbar, mobile nav/hamburger
│   ├── dashboard.css        Date hero, stat cards, timeline
│   ├── calendar.css
│   ├── week.css
│   ├── routines.css
│   ├── history.css
│   ├── stats.css
│   ├── categories.css
│   ├── search.css
│   ├── modal.css             All modals (task/scope/delete/routine/category)
│   └── toast.css
└── js/
    ├── data.js               Storage, task model, recurrence expansion
    ├── utils.js              Toasts, view switching, shared helpers, clock
    ├── dashboard.js
    ├── task-modal.js         Add/edit form + recurring edit-scope
    ├── task-delete.js        Delete confirm + recurring delete-scope
    ├── calendar.js
    ├── week.js
    ├── routines.js
    ├── history.js
    ├── stats.js
    ├── categories.js
    ├── search.js
    ├── data-io.js            Import/export/reset
    └── app.js                Nav wiring + init — loaded LAST
```

Files are loaded as plain global `<script src>` tags (not ES modules) in dependency order — `data.js` and `utils.js` first, then feature files, then `app.js` last, since features share top-level state (`DB`, `currentDate`, helper functions).

---

## Running Locally

Because `index.html` loads separate CSS/JS files by relative path, opening it directly via `file://` may be blocked by your browser's CORS rules. Instead, serve it with any static file server:

```bash
# from inside the ledger/ folder
python3 -m http.server 8000
# then open http://localhost:8000
```

Or use your code editor's "Live Server" extension (e.g. in VS Code).

---

## Data & Storage

- All data lives in your browser's `localStorage` under the key `ledger_app_data_v1` — no account, no server, no network calls.
- Data is **per-browser, per-device**. It does not sync between browsers, devices, or visitors to a deployed URL — each visitor gets their own empty local dataset.
- Clearing browser data, using incognito mode, or switching browsers will erase your data.
- Use **Export** (top bar or Settings page) regularly to download a JSON backup, and **Import** to restore it — including on a different device or browser.

---

## Tech

Vanilla HTML, CSS, and JavaScript. No frameworks, no dependencies, no package manager required.
