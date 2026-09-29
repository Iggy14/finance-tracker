import { Trash2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "../../utils/categories";

export default function EntryItem({ entry, accounts, onDelete }) {
  const cat     = CATEGORIES.find(c => c.key === entry.category) || CATEGORIES[CATEGORIES.length - 1];
  const account = accounts.find(a => a.id === entry.account_id);
  const detail  = [entry.is_income ? "Income" : cat.key, account?.name, entry.note].filter(Boolean).join(" · ");

  return (
    <li className="flex items-center gap-3 py-2.5">
      <span
        className="flex size-10 shrink-0 items-center justify-center rounded-xl"
        style={{ background: `${cat.color}26`, color: cat.color }}
      >
        {entry.is_income ? <Wallet className="size-5" /> : <cat.icon className="size-5" />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{entry.item}</p>
        <p className="truncate text-xs text-muted-foreground">{detail}</p>
      </div>
      <span className={`text-sm font-bold tabular-nums ${entry.is_income ? "text-emerald-600" : "text-foreground"}`}>
        {entry.is_income ? "+" : "-"}฿{entry.amount.toLocaleString()}
      </span>
      <Button
        type="button" variant="ghost" size="icon-sm"
        className="text-muted-foreground hover:text-destructive"
        onClick={() => onDelete(entry.id)}
        aria-label={`Delete ${entry.item}`}
      >
        <Trash2 />
      </Button>
    </li>
  );
}
