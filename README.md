# 💰 Finance Tracker

A mobile-first personal finance app to track daily expenses across multiple bank accounts. Built with React and Supabase, featuring a calendar view, category breakdowns, and an analytics dashboard with interactive charts.

**Live Demo → [finance-tracker-zeta-murex-50.vercel.app](https://finance-tracker-zeta-murex-50.vercel.app)**

---

## ✨ Features

- **Calendar View** — see daily expenses laid out on a monthly calendar with colored category dots
- **Day Detail Sheet** — tap any day to view, add, or delete entries with a smooth bottom sheet
- **Multiple Accounts** — manage separate bank accounts (e.g. KBank for daily, SCB for savings)
- **Category Tracking** — 8 categories: Food & Drink, Pet, Clothing, Rent & Bills, Transport, Health, Entertainment, Others
- **Monthly Budget** — set a daily budget and monthly rent per account
- **Analytics Dashboard** — summary cards, spending pie chart, monthly bar chart, and daily food spend vs budget line chart
- **Google Auth** — sign in with one click, all data is private per user
- **Real-time Sync** — expenses save instantly to Supabase PostgreSQL
- **Mobile-first** — designed for phone use at max-width 480px

---

## 🛠️ Tech Stack

| Layer      | Technology             |
| ---------- | ---------------------- |
| Frontend   | React 19, Vite         |
| Database   | Supabase (PostgreSQL)  |
| Auth       | Supabase Auth (Google) |
| Charts     | Recharts               |
| Deployment | Vercel                 |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A Supabase account

### Installation

1. Clone the repository

```bash
git clone https://github.com/Iggy14/finance-tracker.git
cd finance-tracker
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the root directory

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server

```bash
npm run dev
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── analytics/
│   │   ├── SummaryCards.jsx      ← total spent, avg/day, savings, top category
│   │   ├── SpendingPieChart.jsx  ← spending by category
│   │   ├── MonthlyBarChart.jsx   ← last 6 months spending
│   │   └── DailyLineChart.jsx    ← daily food spend vs budget line
│   ├── calendar/
│   │   ├── BalanceHeader.jsx     ← account balance display
│   │   ├── CalendarGrid.jsx      ← monthly calendar with dots
│   │   ├── DayCell.jsx           ← single day cell
│   │   └── BottomSheet.jsx       ← slide-up entry sheet
│   ├── entry/
│   │   ├── AddEntryForm.jsx      ← add expense/income form
│   │   └── EntryItem.jsx         ← single entry row
│   ├── layout/
│   │   ├── Auth.jsx              ← Google sign-in screen
│   │   ├── Navbar.jsx            ← top navigation bar
│   │   └── BottomNav.jsx         ← bottom tab navigation
│   └── settings/
│       ├── AccountCard.jsx       ← account display + edit
│       ├── AddAccountForm.jsx    ← create new account
│       └── RentSetting.jsx       ← monthly rent configuration
├── pages/
│   ├── CalendarPage.jsx          ← main calendar view
│   ├── AnalyticsPage.jsx         ← charts and stats
│   └── SettingsPage.jsx          ← account and rent settings
├── utils/
│   ├── calculations.js           ← balance and budget logic
│   └── categories.js             ← category definitions
├── supabase.js                   ← Supabase client
└── App.jsx                       ← auth + routing
```

---

## 🗄️ Database Schema

```
accounts         — id, user_id, name, balance, budget_per_day, created_at
monthly_settings — id, user_id, month, year, rent, account_id, created_at
entries          — id, user_id, date, item, amount, category, account_id, is_income, note, created_at
```

Row Level Security is enabled on all tables — users can only access their own data.

---

## 🌐 Deployment

This project is deployed on Vercel. Every push to `main` triggers an automatic redeployment.

```bash
git add .
git commit -m "your update"
git push
```

Remember to add your environment variables in the Vercel dashboard under **Project Settings → Environment Variables**.

---

## 🔒 Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Enable **Google** as an Auth provider under Authentication → Providers
3. Create the three tables above with Row Level Security enabled
4. Add your Vercel domain to **Redirect URLs** under Authentication → URL Configuration

---

## 📄 License

MIT — free to use and modify.
