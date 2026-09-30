# Architecture

Finance Tracker is a **mobile-first single-page web app**. There is no custom backend: the React client talks directly to Supabase (PostgreSQL + Auth) using the public anon key, and data isolation is enforced by Row Level Security (RLS) in the database.

---

## 1. System Overview

```
┌──────────────────────────┐        ┌──────────────────────────────────────┐
│  Browser (phone / desktop)│        │             Supabase                 │
│                          │  HTTPS │  ┌──────────────┐  ┌──────────────┐  │
│  React 19 SPA (Vite)     │◄──────►│  │ Auth (Google │  │ PostgreSQL   │  │
│  - pages / components    │        │  │ OAuth)       │  │ + RLS        │  │
│  - Recharts              │        │  └──────────────┘  └──────────────┘  │
│  - @supabase/supabase-js │        └──────────────────────────────────────┘
└────────────▲─────────────┘
             │ static assets (HTML/JS/CSS)
┌────────────┴─────────────┐
│ Vercel (static hosting)  │  ← auto-deploys on push to `main`
└──────────────────────────┘
```

| Concern        | Choice                                         |
| -------------- | ---------------------------------------------- |
| UI             | React 19 (function components + hooks)         |
| Build / dev    | Vite 8 with `@vitejs/plugin-react`             |
| Data + Auth    | Supabase (`@supabase/supabase-js`)             |
| Charts         | Recharts                                       |
| Styling        | Tailwind v4 + shadcn/ui (new code); older components still use inline style objects |
| Hosting        | Vercel (static)                                |
| Linting        | ESLint 10 (`eslint.config.js`, react-hooks + react-refresh plugins) |

> `firebase` is listed in `package.json` but is **not imported anywhere** in `src/`. It appears to be an unused dependency.

---

## 2. Repository Layout

```
finance-tracker/
├── index.html              # Vite entry HTML, mounts <div id="root">
├── vite.config.js          # Vite + React + Tailwind plugins, `@` → `src/` alias
├── jsconfig.json           # `@/*` path alias (editor support)
├── components.json         # shadcn/ui config (radix, nova, JS, lucide icons)
├── eslint.config.js
├── package.json
├── .env / .env.example     # VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
├── public/                 # static assets; images live in public/images/<section>/ (see §3.5)
│   ├── manifest.webmanifest
│   └── images/app-icons/   # favicon, apple-touch-icon, PWA icons (all generated from iggy-logo.jpg)
└── src/
    ├── main.jsx            # createRoot + <StrictMode><App/>
    ├── App.jsx             # auth gate + tab "router"
    ├── supabase.js         # single shared Supabase client
    ├── lib/utils.js        # `cn()` class-merge helper (clsx + tailwind-merge)
    ├── index.css, App.css  # global styles
    ├── pages/              # one component per bottom-nav tab
    │   ├── CalendarPage.jsx
    │   ├── AnalyticsPage.jsx
    │   └── SettingsPage.jsx
    ├── components/
    │   ├── ui/             # shadcn/ui primitives (button, dialog, sheet, input, …), added via CLI
    │   ├── layout/         # Auth, Navbar, BottomNav
    │   ├── calendar/       # BalanceCard, CalendarGrid, DayCell, BottomSheet
    │   ├── entry/          # AddEntryForm, EntryItem
    │   ├── analytics/      # SummaryCards, SpendingPieChart, MonthlyBarChart, DailyLineChart
    │   └── settings/       # AccountCard, AddAccountForm
    └── utils/
        ├── calculations.js # pure functions: totals, dot color, groupings
        └── categories.js   # CATEGORIES list + DEFAULT_CATEGORY
```

---

## 3. Application Structure

### 3.1 Bootstrap and auth gate (`main.jsx`, `App.jsx`)

1. `main.jsx` renders `<App/>` into `#root` inside `StrictMode`.
2. `App` holds three pieces of state: `user`, `page` (`"calendar" | "analytics" | "settings"`), and `loading`.
3. On mount it calls `supabase.auth.getSession()` and subscribes to `onAuthStateChange`, keeping `user` in sync (the subscription is cleaned up on unmount).
4. Render logic:
   - `loading` → "Loading..." screen
   - no `user` → `<Auth/>` (Google sign-in)
   - otherwise → `Navbar` + the active page + `BottomNav`

### 3.2 Routing

There is **no router library**. `App` keeps `page` in state, and `BottomNav` calls `setPage`. Only the active page is mounted, so switching tabs unmounts the previous page and re-fetches on the next visit. The URL never changes.

### 3.3 Layout

The app shell is a centered column with `maxWidth: 480px`, so it is designed as a phone-sized UI even on desktop. `BottomNav` provides tab navigation and `Navbar` provides the header and logout.

### 3.4 Component hierarchy

```
App
├── Auth                          (when signed out)
└── (when signed in)
    ├── Navbar                    → supabase.auth.signOut()
    ├── CalendarPage
    │   ├── BalanceCard           (swipeable glass cards, KBank then SCB; each has an "Add money" button)
    │   │   └── AddMoneyDialog    (shadcn Dialog → CalendarPage.addMoney → income entry dated today)
    │   ├── CalendarGrid → DayCell (colored budget dot per day)
    │   ├── MiniSheet             (floating Excel button + panel; SheetGrid inside; see §3.7)
    │   └── BottomSheet           (shadcn Sheet, opens on day tap; two views: day list ↔ add)
    │       ├── EntryItem[]       (list + delete)
    │       └── AddEntryForm      (expenses only; big amount, category grid, sticky save. Income comes from AddMoneyDialog)
    ├── AnalyticsPage
    │   ├── SummaryCards
    │   ├── SpendingPieChart      (by category)
    │   ├── MonthlyBarChart       (last 6 months; fetches its own data)
    │   └── DailyLineChart        (daily food spend vs budget)
    ├── SettingsPage
    │   ├── AddAccountForm
    │   ├── AccountCard[]         (edit / delete)
    │   └── Profile card          (Google avatar / name / email)
    └── BottomNav
```

### 3.5 UI components (shadcn/ui)

New UI uses shadcn/ui + Tailwind with semantic tokens (`bg-primary`, `text-muted-foreground`). Add components with `npx shadcn@latest add <name>` and import from `@/components/ui/...`. Theme tokens live in `src/index.css`; `--primary` and `--ring` are set to the app blue. Gotchas:

- The Vite-template variables in `index.css` (`--text`, `--bg`, …) coexist with the shadcn tokens.
- `h1`/`h2` have unlayered global styles, so Tailwind utilities on headings need the `!` modifier.
- After `shadcn add`, check that generated files import `cn` from `@/lib/utils`. The CLI once resolved it to the unrelated `cn` npm package.

### 3.5.1 Page background (`AppShell`)

Every screen uses the sign-in theme: a sky-blue → white gradient (`from-sky-500 via-sky-300 to-white`, covering the top 60svh) at the top of a white column, on a `bg-sky-200` page. `components/layout/AppShell.jsx` provides it and wraps the loading and signed-in views in `App.jsx`. New pages must leave their own root background transparent (no `background` on the page style) so the gradient shows through; put white cards on top for content. Header text over the gradient is white; the `Navbar` is transparent (avatar left, circular sign-out icon button right) so it shares the gradient with no divider.

### 3.6 Image assets

Static images go in `public/images/<section>/` (e.g. `app-icons/`, `auth/`, `dashboard/`), one folder per app section, referenced as `/images/<section>/<file>`. Create the folder when the first image for a section is added, and delete images that are no longer referenced. Only `manifest.webmanifest` stays at the `public/` root. Illustrations that are inline SVG components (none currently) live in `src/components/`, not `public/`.

### 3.7 Mini Sheet (`MiniSheet`, `SheetGrid`, `lib/formula.js`)

A standalone 5×12 scratch spreadsheet on the Calendar page. `MiniSheet` renders a floating Excel button at the bottom of the page and an absolutely-positioned panel (`CalendarPage` root is `relative`) that scales out of the button's corner (`origin-bottom-right`) with a tail pointing at it. `lib/formula.js` is a pure engine: `computeSheet(cells)` takes `{ A1: "=B1*2" }` and returns computed values or error codes (`#ERR`, `#DIV/0`, `#CYC`, `#REF`); it supports `+ - * /`, parentheses, unary minus and cell refs, no `eval`. Cells sync through `useSheetCells(userId)`: it loads from the `sheets` table (one row per user, `cells jsonb`, schema in `docs/sheets.sql`), debounces upserts (800 ms), and keeps `localStorage` (`mini-sheet-cells`) as an instant-load cache and fallback if Supabase fails.

---

## 4. Data Model

Four tables in Supabase PostgreSQL (plus `sheets`, below):

```
accounts
  id, user_id, name, balance, budget_per_day, created_at

entries
  id, user_id, date, item, amount, category, account_id, is_income, note, created_at

monthly_settings
  id, user_id, month, year, rent, account_id, created_at
  (unique on user_id + month + year, used as the upsert conflict target)

sheets
  user_id (pk), cells (jsonb, { "A1": "=B1*2" }), updated_at
```

Relationships:

```
auth.users 1 ──< accounts 1 ──< entries
     │                │
     └──< monthly_settings >── (optional) accounts
```

- `entries.date` is a `YYYY-MM-DD` string; month queries use `gte`/`lte` on it.
- `entries.is_income` distinguishes income from expenses; all spend calculations filter `!is_income`.
- `entries.category` is one of the keys in `utils/categories.js` (defaults to `"Others"`).
- `accounts.budget_per_day` drives the calendar dot colors and the analytics budget line.
- `accounts.balance` is a stored running balance, adjusted on every entry add or delete (see §5.3).

### Categories (`utils/categories.js`)

Food & Drink, Pet, Groceries, Rent & Bills, Transport, Skin & Health, Entertainment, Others. Each has a key, a lucide `icon` component, and a chart color. The app uses lucide icons instead of emojis. This is the single source of truth for the entry form and the charts.

---

## 5. Data Flow

The `supabase` client (`src/supabase.js`) is a singleton created from `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Pages and components import it and query directly. There is no service, repository, or global store layer, and no React Context, Redux, or React Query. State is local `useState` per page, and `user` is passed down as a prop.

### 5.1 Authentication

```
Auth.jsx ──signInWithOAuth({provider:"google", redirectTo: window.location.origin})──► Google ──► Supabase
   ▲                                                                                              │
   └────────── session restored via getSession / onAuthStateChange in App.jsx ◄───────────────────┘
```

`user.id` is then used as the `user_id` filter and insert value across the app. The Google avatar and name come from `user.user_metadata`.

### 5.2 Reads

| Screen           | Query                                                                                   | Trigger            |
| ---------------- | --------------------------------------------------------------------------------------- | ------------------ |
| CalendarPage     | `accounts` where `user_id`                                                              | on mount           |
| CalendarPage     | `entries` where `user_id`, `date` in `[YYYY-MM-01, YYYY-MM-31]`                         | on `year`/`month`  |
| AnalyticsPage    | `entries` (month range, ordered by date) and `accounts`, in parallel via `Promise.all`  | on `user`/`month`/`year` |
| MonthlyBarChart  | one `entries` query per month for the last 6 months (`amount, is_income`, expenses only), in parallel | on `user`          |
| SettingsPage     | `accounts` ordered by `created_at`                                                      | on mount           |

Entries are grouped client-side into a `{ dayNumber: entry[] }` map in `CalendarPage` and passed to `CalendarGrid`.

### 5.3 Writes

| Action          | Operations                                                                                          |
| --------------- | --------------------------------------------------------------------------------------------------- |
| Add entry       | `insert` into `entries` → `update` `accounts.balance` (+ for income, − for expense) → refetch entries and accounts |
| Delete entry    | `update` `accounts.balance` (reverse the entry) → `delete` from `entries` → refetch                 |
| Add account     | `insert` into `accounts` → refetch                                                                  |
| Edit account    | `update` `accounts` (in `AccountCard`) → `onUpdated` refetch                                        |
| Delete account  | `delete` from `accounts` → refetch                                                                  |

After each write, the page **refetches** rather than updating local state optimistically.

### 5.4 Business logic (`utils/calculations.js`)

Pure functions, with no I/O:

- `dailyTotal(entries)` — sum of expense amounts.
- `dotColor(entries, budgetPerDay)` — only `BUDGET_CATEGORY` ("Food & Drink", from `utils/categories.js`) entries count toward the budget; other categories are ignored. `null` if the day has no food entries; green if ≤ budget; yellow if ≤ 120% of budget; red otherwise.
- `spendingByCategory(entries)` — `{ category: total }` for the pie chart.
- `monthlyTotals(entries)` — `{ "YYYY-MM": total }`.
- `dailyFoodSpending(entries, year, month)` — one `{ day, amount }` per day of the month for the food line chart.

---

## 6. Security Model

- The anon key is intentionally public and shipped to the browser (`VITE_` variables are inlined into the bundle). Security depends on **RLS being enabled on `accounts`, `entries` and `monthly_settings`**, so each user can only read and write their own rows.
- Client-side `.eq("user_id", user.id)` filters are for correctness and efficiency, not security. RLS is the actual boundary.
- Google is the only auth provider. The site's Vercel domain must be added to Supabase's **Redirect URLs**, because the app uses `window.location.origin` as `redirectTo`.
- `.env` holds local secrets and should not be committed. The repo tracks `.env.example` instead (`.env` is being removed from git in the working tree).

---

## 7. Build, Run, and Deploy

| Command           | Purpose                        |
| ----------------- | ------------------------------ |
| `npm run dev`     | Vite dev server with HMR       |
| `npm run build`   | Production build to `dist/`    |
| `npm run preview` | Serve the production build     |
| `npm run lint`    | ESLint                         |

Configuration comes from environment variables: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Set them in `.env` locally and in Vercel under *Project Settings → Environment Variables*.

Deployment: pushing to `main` triggers an automatic Vercel build and redeploy. Live at https://finance-tracker-zeta-murex-50.vercel.app.

---

## 8. Design Decisions and Trade-offs

- **Backend-as-a-service.** No server to run, and RLS replaces an API layer. The trade-off is that all logic lives in the client and the database policies.
- **No router or state library.** This keeps the app small. The trade-off is no deep links, no back-button navigation between tabs, and repeated fetches when tabs remount.
- **Direct Supabase calls in components.** This is simple, but data access is scattered across pages and components (`supabase.from(...)` appears in about 10 files), which makes changes to the schema or queries harder.
- **Stored balance.** `accounts.balance` is updated by separate client calls after inserting or deleting an entry.

---

## 9. Known Issues and Improvement Opportunities

- **Non-atomic balance updates.** Entry insert/delete and the balance update are separate requests, so a failure between them leaves `balance` out of sync with `entries`. A Postgres function/transaction or trigger would fix this, or the balance could be computed from entries.
- **Read-modify-write race.** The new balance is computed from the client's cached `accounts`, so concurrent edits from two devices can overwrite each other.
- **Ignored errors.** Supabase `error` results are mostly not checked; failures are silent.
- **Month range uses day 31.** `CalendarPage` queries `date <= YYYY-MM-31`. This works with string date comparison but is inconsistent with `AnalyticsPage`, which computes the real last day.
- **Deleting an account** does not adjust or handle its entries in the client code. Behavior depends on the database foreign-key rule (cascade or restrict).
- **`monthly_settings` table** is no longer used by the client (the Rent setting was removed; rent is logged as a "Rent & Bills" expense from the calendar). The table can be dropped.
- **Unused dependency:** `firebase`.
- **Styling** is inline objects duplicated per component, with hard-coded colors, so there is no shared theme.
- **No tests** and no TypeScript or PropTypes.
- **Hard-coded currency/locale.** Category names and defaults are English, and the sample accounts in the README are Thai banks (KBank, SCB).
