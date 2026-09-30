import { useState } from "react";
import { Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ExcelIcon from "./ExcelIcon";
import SheetGrid from "./SheetGrid";
import useSheetCells from "./useSheetCells";

// Floating Excel button + a panel that grows out of it. Render inside a `relative`
// container: the panel is absolutely positioned over the container (top → just above the button).
export default function MiniSheet({ user }) {
  const [open, setOpen]   = useState(false);
  const [cells, setCells] = useSheetCells(user.id);

  const setCell = (key, value) => setCells((c) => ({ ...c, [key]: value }));

  return (
    <>
      <div
        role="dialog"
        aria-label="Mini sheet"
        aria-hidden={!open}
        inert={!open}
        className={cn(
          "absolute inset-x-3 top-2 bottom-[68px] z-40 origin-bottom-right transition-all duration-300 ease-out",
          open ? "scale-100 opacity-100" : "pointer-events-none scale-[0.08] opacity-0"
        )}
      >
        <div className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl shadow-sky-900/20">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ExcelIcon className="size-6" />
              <h2 className="!m-0 !text-base font-semibold !text-blue-900">Mini Sheet</h2>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon-sm" aria-label="Clear sheet" onClick={() => setCells({})}>
                <Trash2 />
              </Button>
              <Button variant="ghost" size="icon-sm" aria-label="Close" onClick={() => setOpen(false)}>
                <X />
              </Button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-auto">
            <SheetGrid cells={cells} onChange={setCell} />
          </div>
          <p className="mt-2 text-xs text-blue-900/70">
            Type numbers or formulas like <code>=A1+B2*3</code>. Supports + − × ÷ and ( ).
          </p>
        </div>

        {/* tail pointing at the floating button */}
        <span
          aria-hidden="true"
          className="absolute -bottom-2 right-[19px] size-4 rotate-45 border-b border-r border-slate-200 bg-white"
        />
      </div>

      <div className="flex justify-end px-4 pb-2 pt-0">
        <button
          type="button"
          aria-label={open ? "Close mini sheet" : "Open mini sheet"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="relative z-50 grid size-12 place-items-center rounded-full bg-white shadow-lg shadow-sky-900/25 ring-1 ring-slate-200 transition-transform active:scale-95"
        >
          <ExcelIcon className="size-8" />
        </button>
      </div>
    </>
  );
}
