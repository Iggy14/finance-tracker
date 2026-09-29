import { useState } from "react";
import { ArrowLeft, NotebookPen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import EntryItem    from "../entry/EntryItem";
import AddEntryForm from "../entry/AddEntryForm";

const sum = (list) => list.reduce((s, e) => s + e.amount, 0);

export default function BottomSheet({ day, month, year, entries, accounts, onClose, onAdd, onDelete }) {
  const [adding, setAdding] = useState(false);
  const date    = new Date(year, month - 1, day);
  const title   = date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  const spent   = sum(entries.filter(e => !e.is_income));

  return (
    <Sheet open onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent aria-describedby={undefined}>

        <header className="flex items-center gap-2 px-5 pt-3 pb-3">
          {adding && (
            <Button type="button" variant="ghost" size="icon-sm" onClick={() => setAdding(false)} aria-label="Back to day">
              <ArrowLeft />
            </Button>
          )}
          <div className="min-w-0 flex-1">
            <SheetTitle className="!text-lg !leading-tight !text-[#1A2E44]">{adding ? "New entry" : title}</SheetTitle>
            <SheetDescription className={adding ? "mt-1 text-[#1A2E44]" : "mt-1"}>{adding ? title : `${entries.length} ${entries.length === 1 ? "entry" : "entries"}`}</SheetDescription>
          </div>
        </header>

        {adding ? (
          <AddEntryForm accounts={accounts} onSave={onAdd} />
        ) : (
          <>
            {/* day summary */}
            <div className="mx-5 mb-3 flex items-baseline justify-between rounded-2xl bg-rose-50 px-4 py-2.5">
              <p className="text-sm text-rose-700/80">Spent today</p>
              <p className="text-xl font-bold tabular-nums text-rose-600">฿{spent.toLocaleString()}</p>
            </div>

            {/* entries */}
            <div className="min-h-0 flex-1 overflow-y-auto px-5">
              {entries.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <NotebookPen className="mx-auto mb-2 size-10 opacity-60" />
                  <p className="text-sm">Nothing logged for this day yet.</p>
                </div>
              ) : (
                <ul className="divide-y">
                  {entries.map(e => (
                    <EntryItem key={e.id} entry={e} accounts={accounts} onDelete={onDelete} />
                  ))}
                </ul>
              )}
            </div>

            <div className="px-5 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <Button type="button" size="lg" className="h-11 w-full rounded-xl text-base font-semibold" onClick={() => setAdding(true)}>
                <Plus /> Add entry
              </Button>
            </div>
          </>
        )}

      </SheetContent>
    </Sheet>
  );
}
