import { useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { PRIORITY, sortAccounts } from "@/utils/accounts";
import AddMoneyDialog from "./AddMoneyDialog";

// KBank is the primary card, SCB is one swipe away, anything else follows.
const nameColor = (name) =>
  PRIORITY[0].test(name) ? "text-green-700" : PRIORITY[1].test(name) ? "text-purple-700" : "text-white/80";

function Card({ account, onAddMoney }) {
  const negative = account.balance < 0;
  const Trend = negative ? TrendingDown : TrendingUp;

  return (
    <div className="flex min-h-56 flex-col justify-between rounded-3xl border border-white/50 bg-gradient-to-br from-white/50 via-white/25 to-white/10 p-6 text-white shadow-lg shadow-sky-900/10 backdrop-blur-md">
      <div className="flex items-start justify-between gap-3">
        <p className={cn("text-lg font-semibold", nameColor(account.name))}>
          {account.name}
        </p>
        <AddMoneyDialog account={account} onAdd={onAddMoney} />
      </div>

      <div className="flex items-end justify-between gap-3">
        <p className={cn("text-4xl font-bold tracking-tight text-[#0B1F4B]", negative && "text-red-700")}>
          ฿{account.balance.toLocaleString()}
        </p>
        {account.budget_per_day > 0 && (
          <span className="flex items-center gap-1 pb-1 text-sm text-[#0B1F4B]">
            <Trend className="size-4" />
            ฿{account.budget_per_day.toLocaleString()}/day
          </span>
        )}
      </div>
    </div>
  );
}

// Same box as a loaded card, so the calendar below doesn't jump when accounts arrive.
function CardSkeleton() {
  return (
    <div className="pb-[50px] pt-4">
      <div className="px-4 pb-3">
        <Skeleton className="min-h-56 rounded-3xl bg-white/30" />
      </div>
    </div>
  );
}

export default function BalanceCard({ accounts, loading, onAddMoney }) {
  const [active, setActive] = useState(0);
  if (loading) return <CardSkeleton />;
  const sorted = sortAccounts(accounts);
  if (!sorted.length) return null;

  const onScroll = (e) => {
    const { scrollLeft, clientWidth } = e.currentTarget;
    setActive(Math.round(scrollLeft / clientWidth));
  };

  const goTo = (e, i) => {
    const track = e.currentTarget.closest("[data-track]").querySelector("[data-scroller]");
    track.scrollTo({ left: i * track.clientWidth, behavior: "smooth" });
  };

  return (
    <div data-track className="pb-[50px] pt-4">
      <div
        data-scroller
        onScroll={onScroll}
        className="flex snap-x snap-mandatory overflow-x-auto px-0 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {sorted.map((acc) => (
          <div key={acc.id} className="w-full shrink-0 snap-center px-4">
            <Card account={acc} onAddMoney={onAddMoney} />
          </div>
        ))}
      </div>

      {sorted.length > 1 && (
        <div className="flex justify-center gap-1.5">
          {sorted.map((acc, i) => (
            <button
              key={acc.id}
              type="button"
              aria-label={`Show ${acc.name}`}
              onClick={(e) => goTo(e, i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === active ? "w-4 bg-white" : "w-1.5 bg-white/50"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
