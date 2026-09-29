import { CalendarDays, ChartNoAxesCombined, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "calendar",  label: "Calendar",  Icon: CalendarDays },
  { key: "analytics", label: "Analytics", Icon: ChartNoAxesCombined },
  { key: "settings",  label: "Settings",  Icon: Settings },
];

export default function BottomNav({ page, setPage }) {
  return (
    <nav
      aria-label="Main"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 mx-auto flex w-full max-w-[430px] justify-center px-15 pb-[calc(env(safe-area-inset-bottom)+28px)]"
    >
      <div className="pointer-events-auto flex w-full items-center justify-around rounded-2xl bg-white p-2 shadow-lg ring-1 ring-black/5">
        {TABS.map(({ key, label, Icon }) => {
          const active = page === key;
          return (
            <button
              key={key}
              type="button"
              aria-label={label}
              aria-current={active ? "page" : undefined}
              onClick={() => setPage(key)}
              className={cn(
                "flex h-12 w-24 items-center justify-center rounded-xl text-black transition-colors",
                active ? "bg-sky-300" : "bg-transparent hover:bg-slate-100",
              )}
            >
              <Icon className="size-5" strokeWidth={1.75} />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
