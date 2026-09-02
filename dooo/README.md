# Ledger — Long-Term Routine & Task Manager

A modern, responsive daily planner, habit tracker, and long-term routine manager. Track tasks and routines across any date — today, tomorrow, or years into the past or future — with full recurrence support, statistics, and history.

**100% static. No backend, no build step, no server required.** All data is stored locally in your browser via `localStorage`.

---

## Features

### Core Task Management
- **Multi-year task tracking** — track tasks on any date (past, today, or future years ahead)
- **Timeline view** — see all tasks for a day organized by start time
- **Task details** — name, description, start/end time, category, priority (low/medium/high), reminders, and notes
- **Completion tracking** — mark tasks done/incomplete and view history
- **Task editing & deletion** — with scope options for recurring task series (this instance, future, or all)

### Recurring Tasks & Patterns
- **Non-recurring tasks** — one-time tasks on a specific date
- **Daily recurrence** — repeats every single day from start date
- **Weekly recurrence** — repeats on specific weekdays (e.g., every Monday, Wednesday, Friday)
- **Custom interval** — repeats every N days (e.g., every 3 days)
- **Date ranges** — optional start and end dates for any recurrence pattern
- **Recurring exceptions** — delete individual instances from a recurring series without affecting the pattern

### Routine Templates
- **My Routines** — save templates of repeated task sets (e.g., "Morning Routine", "Monday Schedule")
- **Apply to specific date** — add all routine tasks to any single date without affecting other days
- **Apply to day of week** — create a recurring weekly routine that repeats every Monday, Tuesday, etc.
- **Edit routines** — add, remove, and reorder tasks within a template
- **Task list** — each routine shows count of tasks and quick actions (Apply, Edit, Delete)

### Dashboard & Views
- **Dashboard (Today/Any Date)** 
  - Progress bar with completion percentage
  - Completed vs. remaining task counts
  - Current/next task indicator with time and category
  - Full timeline of day's tasks with completion toggles
  - Quick actions: Add task, apply routine, delete entire day
  
- **Calendar** — month-view with clickable dates to jump to any date
- **Week** — completion breakdown by category for Monday–Sunday
- **History** — completion record searchable by date
- **Statistics** — productivity metrics
  - Completion % for today, this week, this month, this year
  - Current and longest streaks (consecutive days with 100% completion)
  - Category hours (total time spent in each category)
  - Task totals (completed, missed, all tasks, days tracked)

### Categories & Organization
- **Categories** — organize tasks by type (e.g., English, DSA, Gym, College)
- **Pre-loaded categories** — English, DSA, Gym, Project, Reading, Sleep, Meal, Break, Practice, Fresh, College, Study, Other
- **Category colors** — visual identification in timeline and stats
- **Manage categories** — create custom categories in the Categories view

### Search & Filters
- **Global search** — find tasks across entire history by name or keywords
- **Search results** — displays matching tasks with date and category

### Reminders
- **Reminder notifications** — set reminders for tasks (5, 10, 30, or 60 minutes before)
- **Notification alerts** — browser notifications when reminder time arrives

### Data Management
- **Export data** — download entire app state as JSON backup file
- **Import data** — restore from previously exported JSON (replaces current data)
- **Reset all data** — permanently erase all tasks, routines, categories, and history
- **Local storage** — all data persists in browser's `localStorage` (survives page refreshes)

### UI & Accessibility
- **Dark theme** — reduced eye strain, modern appearance
- **Fully responsive** — desktop (sidebar nav) and mobile (bottom nav) layouts
- **Date navigation** — jump between dates with prev/next buttons or calendar
- **Live clock** — displays current time and date in top bar
- **Toast notifications** — visual feedback for all actions (task saved, routine applied, etc.)
- **Keyboard friendly** — modal forms with clear labels and submit buttons

---

## User Guide

### Getting Started

1. **Open the app** — navigate to `index.html` via a local server (see "Running Locally")
2. **Dashboard loads** — today's date and schedule appear by default
3. **Navigation** — use top-left buttons to navigate dates, or click sidebar/bottom nav to switch views

### Managing Tasks

#### Add a Task
1. Click **+ Add Task** (Dashboard) or **+ Add Task** in the timeline
2. Fill in:
   - **Task name** (required)
   - **Start & end time** (required)
   - **Date** (defaults to current date)
   - **Category** (required)
   - **Priority** (Low/Medium/High)
   - **Repeat** (None, Daily, Weekly, or Custom)
   - **Reminder** (optional notification time)
   - **Description & notes** (optional)
3. Click **Save Task**

#### Set Up Recurrence
- **None** — one-time task on the selected date only
- **Daily** — repeats every day starting from the date you set
- **Weekly** — repeats on specific weekdays (select Mon/Tue/Wed/Thu/Fri/Sat/Sun)
- **Custom** — repeats every N days (e.g., every 3 days)
- **Date range** — optionally set when the recurrence starts and ends

#### Complete a Task
- Click on any task in the timeline to mark it complete/incomplete
- Completed tasks show a checkmark and dim styling
- Completion is tracked separately for each date (so recurring task on Monday can be complete while Monday's instance shows as done)

#### Edit a Task
- Click on a task → choose edit scope:
  - **Edit this task only** — changes only this date's instance
  - **Edit this and future tasks** — splits the series (earlier instances unchanged, this and future change)
  - **Edit entire routine** — changes all past and future instances

#### Delete a Task
- Click on a task → choose delete scope (same options as edit)
- Deleted tasks can be recovered by editing/undeleting their parent task, or via import

### Working with Routines

#### Create a Routine Template
1. Go to **My Routines** view
2. Click **+ New Routine**
3. Enter routine name (e.g., "Morning Routine", "College Day")
4. Click **+ Add task to routine** and fill in:
   - Task name, start/end time, category
   - *Note: dates are NOT set here, only times*
5. Add as many tasks as needed, then click **Save Routine**

#### Apply Routine to a Specific Date
1. Go to **My Routines**
2. Click **Apply** on any routine card
3. Modal opens with:
   - **Apply Mode: "Once to a date"** (default)
   - **Choose routine** (dropdown)
   - **Apply to date** (date picker, defaults to today)
4. Click **Apply** → tasks are added to that date

#### Apply Routine to Repeat Every Week on a Day
1. Go to **My Routines**
2. Click **Apply** on any routine card
3. Modal opens → switch mode to **"Every [Day of Week]"**
4. Select day from dropdown (Sunday through Saturday)
5. Click **Apply** → tasks now repeat every week on that day
6. Tasks appear in your timeline every week on that day going forward

#### Edit or Delete a Routine
- **Edit** — modify the routine's name and tasks (does NOT affect already-applied tasks)
- **Delete** — remove the template (does NOT affect any tasks already applied from it)

### Dashboard & Navigation

#### Dashboard Features
- **Date header** — shows current viewing date with "Today", "Prev/Next" buttons
- **Progress card** — % of tasks completed today
- **Stats** — completed count, remaining count, current/next task
- **Timeline** — all tasks sorted by time with checkboxes to complete
- **Quick actions** — Add Task, Apply Routine, Delete entire day

#### Date Navigation
- Click **Today** button to jump back to today
- Click **← Prev** or **Next →** to go back/forward one day
- Click any date on the **Calendar** view to jump to it
- Use **Calendar** view for month overview

### Views

#### Calendar
- **Month view** — see all dates at a glance
- **Click any date** to jump to that date's dashboard
- **Prev Month / This Month / Next Month** buttons

#### Week
- **Seven-column table** — Monday through Sunday
- **Color-coded completion** by category for each day
- Shows which categories you completed the most in that week

#### History
- **All-time completion record** — every date that has tasks
- **Sortable/searchable** — filter by date or task name
- **Click any date** to open that date's dashboard

#### Statistics
- **Today/Week/Month/Year completion %** — based on actual task data
- **Streak tracking** — current consecutive days at 100%, longest streak ever
- **Category hours** — total time in each category (all-time)
- **Task totals** — completed, missed, total tasks, days tracked

### Categories

#### View & Manage Categories
1. Go to **Categories** view
2. See all categories with their colors and task counts
3. Click **+ Add Category** to create a custom category
4. Choose a name and color
5. New category appears in task creation dropdowns

#### Default Categories
English, DSA, Gym, Project, Reading, Sleep, Meal, Break, Practice, Fresh, College, Study, Other

### Search

#### Global Search
1. Click the search box at the top of any page
2. Type a task name or keyword
3. Results show all matching tasks from your history
4. Click any result to jump to that date's dashboard

### Reminders

#### Set a Reminder
1. When creating/editing a task, choose **Reminder**
2. Options: None, 5 min before, 10 min before, 30 min before, 1 hour before
3. Browser will notify you at the reminder time (if notifications are enabled)

### Data Management

#### Export Your Data
1. Click **⇩** icon in top bar OR go to **Settings**
2. Click **Export JSON** button
3. A JSON file downloads (keep as backup)

#### Import Data
1. Click **⇧** icon in top bar OR go to **Settings**
2. Click **Import JSON** button
3. Select a previously exported JSON file
4. All app data is replaced with the imported data
5. *Note: This is permanent — exported data is saved locally first*

#### Reset All Data
1. Go to **Settings** → scroll to "Reset all data"
2. Click **Erase Everything**
3. *Careful: this permanently deletes all tasks, routines, categories, and history*
4. App resets to default state with empty data

---

## Technical Reference

### Data Model

#### Task Object
```javascript
{
  id: string,                    // Unique task ID
  seriesId: string | null,       // Links to recurring series (null if non-recurring)
  name: string,                  // Task title
  description: string,           // Optional details
  start: "HH:MM",               // Start time (24-hour format)
  end: "HH:MM",                 // End time
  date: "YYYY-MM-DD",           // Date task occurs (stored date for series)
  category: string,              // Category ID
  priority: "low" | "medium" | "high",
  reminder: "5" | "10" | "30" | "60" | "", // Minutes before start
  notes: string,                 // User notes
  completed: boolean,            // Only for non-recurring tasks
  repeat: { type, weekdays, interval, start, end } // Recurrence info
}
```

#### Repeat Object
```javascript
{
  type: "none" | "daily" | "weekly" | "custom",
  weekdays: [0-6],              // For weekly: day of week (0=Sun, 1=Mon, etc.)
  interval: number,              // For custom: repeat every N days
  start: "YYYY-MM-DD",          // When recurrence starts
  end: "YYYY-MM-DD" | null      // When recurrence ends (null = never)
}
```

#### Category Object
```javascript
{
  id: string,                    // Category ID
  name: string,                  // Display name
  color: string                  // Hex color code
}
```

#### Routine Object
```javascript
{
  id: string,                    // Routine ID
  name: string,                  // Template name
  tasks: [                        // Tasks in this routine
    {
      id, name, start, end, category, description
      // Note: no date field, only times
    }
  ]
}
```

### Database Structure

The main `DB` object in memory:
```javascript
{
  tasks: [],                     // All tasks (recurring and non-recurring)
  routines: [],                  // All routine templates
  categories: [],                // All custom categories
  completions: {},               // Completion state for recurring task instances
                                 // Key: instanceId, Value: boolean
  exceptions: {}                 // Deleted instances from recurring series
                                 // Key: seriesId, Value: { dateKey: "deleted" }
}
```

### Recurrence Expansion

When displaying a date, the app:
1. Iterates all tasks in `DB.tasks`
2. For each task, checks if it "occurs" on the date using `seriesOccursOnDate()`
3. Expands recurring tasks into "instances" (synthetic objects with `instanceId`)
4. Instance ID: `originalTaskId__dateKey` for recurring, or just `originalTaskId` for one-time
5. Completions are looked up in `DB.completions[instanceId]`

This allows:
- One recurring task to appear on multiple dates
- Each instance tracked independently for completion
- Deletions of specific instances via `DB.exceptions`
- Editing with scope (this, future, all)

### Storage & Persistence

- **Key** — `ledger_app_data_v1` in browser's `localStorage`
- **Format** — JSON string of the entire `DB` object
- **Persistence** — automatic on every modification (`save()` function called)
- **Lifespan** — survives page refresh, lost on "Clear Browsing Data" (unless exported)

### Function Reference

#### Core Helpers (utils.js)
- `dateKey(date)` — converts Date object to "YYYY-MM-DD" string
- `parseKey(key)` — converts "YYYY-MM-DD" string to Date object
- `addDays(key, n)` — adds N days to a date key
- `fmtLongDate(key)` — formats as "Wednesday, September 2, 2026"
- `fmtShortDate(key)` — formats as "Wed, Sep 2"
- `to12h(time)` — converts "14:30" to "2:30 PM"
- `timeToMinutes(time)` — converts "14:30" to 870 minutes
- `uid(prefix)` — generates unique ID with timestamp + random suffix

#### Data Layer (data.js)
- `load()` — loads DB from localStorage or creates default
- `save(db)` — persists DB to localStorage
- `seriesOccursOnDate(task, key)` — checks if recurring task appears on date
- `getInstancesForDate(key)` — returns all task instances for a date, sorted by time
- `toggleComplete(instanceId, sourceTaskId, dateKey)` — marks task complete/incomplete

#### UI Helpers (utils.js)
- `switchView(name)` — shows/hides view by name (dashboard, calendar, week, etc.)
- `toast(message)` — displays notification message
- `populateCategorySelect(select)` — populates category dropdown

### Project Structure

```
dooo/
├── index.html              Markup: shell, modals, forms
├── css/
│   ├── base.css            Variables, theme, resets
│   ├── layout.css          Sidebar, topbar, mobile nav
│   ├── dashboard.css       Dashboard view styles
│   ├── calendar.css        Calendar view
│   ├── week.css            Week table
│   ├── routines.css        Routine cards
│   ├── history.css         History list
│   ├── stats.css           Statistics cards
│   ├── categories.css      Category list
│   ├── search.css          Search results
│   ├── modal.css           All modal styles
│   └── toast.css           Toast notifications
└── js/
    ├── data.js             DB, storage, recurrence logic
    ├── utils.js            Shared helpers, clock, toasts, view switching
    ├── dashboard.js        Dashboard view + timeline rendering
    ├── task-modal.js       Add/edit task form + recurring scope modal
    ├── task-delete.js      Delete confirmation + recurring delete scope
    ├── calendar.js         Calendar month view
    ├── week.js             Week table view
    ├── routines.js         Routine templates + apply modal (with day-of-week feature)
    ├── history.js          History list view
    ├── stats.js            Statistics calculations and rendering
    ├── categories.js       Category management
    ├── search.js           Global search
    ├── data-io.js          Import/export/reset
    └── app.js              Navigation init, view setup (loaded last)
```

### Initialization Flow

1. Browser loads `index.html`
2. CSS files load (in order)
3. JS files load in dependency order:
   - `data.js` — initializes `DB` from localStorage or defaults
   - `utils.js` — sets up helpers, clock, view switching
   - Feature files — dashboard, modals, views (can reference `DB` and helpers)
   - `app.js` — wires navigation, sets initial view to dashboard
4. App ready — current date loaded, first view rendered

---

## Running Locally

Because `index.html` loads separate CSS/JS files by relative path, opening it directly via `file://` may be blocked by your browser's CORS rules. Instead, serve it with any static file server:

```bash
# from inside the dooo/ folder
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

## Changelog

### Version 1.1 — Day-Based Routines
- ✅ **Apply routines by day of week** — in addition to applying to specific dates, routines can now repeat every Monday, Tuesday, etc.
- ✅ **New apply mode toggle** — Choose between "Once to a date" (apply one-time) or "Every [Day of Week]" (create recurring)
- ✅ **Automatic recurrence** — day-based routine applications automatically create weekly recurring tasks
- ✅ Works seamlessly with existing task recurrence system

### Version 1.0 — Initial Release
- ✅ Multi-year task tracking with full recurrence support
- ✅ Dashboard, Calendar, Week, History, and Statistics views
- ✅ Routine templates with apply-to-date functionality
- ✅ Categories, global search, streak tracking
- ✅ Full import/export and data management
- ✅ Dark theme, fully responsive design

---

## License

Public domain. Use freely.

---

## Support & Contributing

- **Bug reports** — if you find an issue, test it and document the steps to reproduce
- **Feature requests** — feel free to suggest improvements
- **Code contributions** — PRs welcome; keep it vanilla JS, no frameworks

---

## Tech

Vanilla HTML, CSS, and JavaScript. No frameworks, no dependencies, no package manager required.
