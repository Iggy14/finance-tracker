import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CATEGORIES, DEFAULT_CATEGORY } from "../../utils/categories";

export default function AddEntryForm({ accounts, onSave }) {
  const [amount, setAmount]       = useState("");
  const [category, setCategory]   = useState(DEFAULT_CATEGORY);
  const [accountId, setAccountId] = useState(accounts[0]?.id || "");
  const [item, setItem]           = useState("");
  const [note, setNote]           = useState("");

  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const amountRef = useRef(null);
  const savedTimer = useRef(null);

  useEffect(() => () => clearTimeout(savedTimer.current), []);

  const value = parseFloat(amount);
  const valid = value > 0 && !!accountId;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!valid || saving) return;
    setSaving(true);
    // Item is optional: fall back to the category so the list row is never blank.
    await onSave({
      item: item.trim() || category,
      amount: value,
      category,
      account_id: accountId,
      is_income: false,
      note: note.trim(),
    });
    // Stay on the form, cleared and ready for the next entry (account choice is kept).
    setAmount(""); setItem(""); setNote(""); setCategory(DEFAULT_CATEGORY);
    setSaving(false);
    setSaved(true);
    amountRef.current?.focus();
    clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setSaved(false), 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 space-y-5 overflow-y-auto px-5 pb-4">

        {/* amount + what it was for, read together: "฿80 · Lunch" */}
        <div className="space-y-2 pt-3">
          <label className="flex items-center justify-center gap-1">
            <span className="text-3xl font-semibold text-muted-foreground">฿</span>
            <input
              ref={amountRef}
              type="number" inputMode="decimal" min="0" placeholder="0" autoFocus
              value={amount} onChange={(e) => setAmount(e.target.value)}
              aria-label="Amount in baht"
              className="w-40 bg-transparent text-center text-5xl font-bold tabular-nums outline-none placeholder:text-muted-foreground/40"
            />
          </label>
          <Input
            className="mx-auto mt-5 block h-9 max-w-64 rounded-full border-[#1A2E44] bg-white text-center text-[#1A2E44] placeholder:text-[#1A2E44]/50 focus-visible:border-[#1A2E44] focus-visible:ring-[#1A2E44]/20"
            placeholder="What was it? (e.g. Lunch)"
            value={item} onChange={(e) => setItem(e.target.value)} aria-label="Item"
          />
        </div>

        {/* categories: all options visible in a grid */}
        <section aria-label="Category">
          <p className="!mb-3.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Category</p>
          <div className="grid grid-cols-4 gap-2">
            {CATEGORIES.map(cat => {
              const active = category === cat.key;
              return (
                <button
                  key={cat.key} type="button" aria-pressed={active}
                  onClick={() => setCategory(cat.key)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl border px-1 py-2 transition-colors",
                    active ? "border-transparent text-white" : "bg-background text-foreground hover:bg-muted"
                  )}
                  style={active ? { background: cat.color } : undefined}
                >
                  <cat.icon className="size-5" />
                  <span className="text-center text-[11px] leading-tight font-medium">{cat.key}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* account: only worth showing when there's a choice */}
        {accounts.length > 1 && (
          <section aria-label="Account">
            <p className="!mb-3.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Pay from</p>
            <div className="flex flex-wrap gap-2">
              {accounts.map(acc => (
                <button
                  key={acc.id} type="button" aria-pressed={accountId === acc.id}
                  onClick={() => setAccountId(acc.id)}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                    accountId === acc.id
                      ? "border-transparent bg-primary text-primary-foreground"
                      : "bg-background hover:bg-muted"
                  )}
                >
                  {acc.name}
                </button>
              ))}
            </div>
          </section>
        )}

        <Input
          className="border-transparent bg-transparent focus-visible:border-transparent focus-visible:ring-0"
          placeholder="Add a note (optional)"
          value={note} onChange={(e) => setNote(e.target.value)} aria-label="Note"
        />
      </div>

      {/* sticky save bar */}
      <div className="bg-background px-5 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {/* flashes sky-300 "Saved" until the next amount is typed or the timer ends */}
        <Button
          type="submit" size="lg" disabled={!valid || saving}
          className={cn(
            "h-11 w-full rounded-xl text-base font-semibold transition-colors",
            saved && !valid && "bg-sky-300 text-[#1A2E44] disabled:opacity-100"
          )}
        >
          {saved && !valid ? (
            <><Check /> Saved</>
          ) : valid ? (
            `Save · ฿${value.toLocaleString()}`
          ) : (
            "Enter an amount"
          )}
        </Button>
      </div>
    </form>
  );
}
