import { useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { COLS, ROWS, cellKey, computeSheet, formatValue, insertRef } from "@/lib/formula";

const isError = (v) => typeof v === "string" && v.startsWith("#");

export default function SheetGrid({ cells, onChange }) {
  const [editing, setEditing] = useState(null);
  const values = useMemo(() => computeSheet(cells), [cells]);
  const inputs = useRef({});

  // While typing a formula, tapping another cell inserts its name instead of moving focus.
  const pickCell = (e, key) => {
    const input = inputs.current[editing];
    if (!input || key === editing) return;
    const hit = insertRef(cells[editing] ?? "", input.selectionStart, input.selectionEnd, key);
    if (!hit) return;
    e.preventDefault();
    onChange(editing, hit.text);
    requestAnimationFrame(() => input.setSelectionRange(hit.caret, hit.caret));
  };

  const onKeyDown = (e, c, r) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const next = inputs.current[cellKey(c, r + 1)];
    if (next) next.focus(); else e.currentTarget.blur();
  };

  return (
    <div className="overflow-auto rounded-xl border border-slate-200">
      <table className="w-full table-fixed border-collapse text-sm">
        <thead>
          <tr className="bg-slate-100 text-xs font-semibold text-blue-900">
            <th className="w-8 border-b border-r border-slate-200" />
            {COLS.map((c) => (
              <th key={c} className="border-b border-r border-slate-200 py-1 last:border-r-0">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: ROWS }, (_, r) => (
            <tr key={r}>
              <th className="border-b border-r border-slate-200 bg-slate-100 text-xs font-semibold text-blue-900">
                {r + 1}
              </th>
              {COLS.map((_, c) => {
                const key = cellKey(c, r);
                const raw = cells[key] ?? "";
                const shown = editing === key || !(key in values) ? raw : formatValue(values[key]);
                return (
                  <td key={key} className="border-b border-r border-slate-200 p-0 last:border-r-0">
                    <input
                      ref={(el) => { inputs.current[key] = el; }}
                      aria-label={key}
                      onMouseDown={(e) => pickCell(e, key)}
                      onKeyDown={(e) => onKeyDown(e, c, r)}
                      value={shown}
                      inputMode="text"
                      onFocus={() => setEditing(key)}
                      onBlur={() => setEditing(null)}
                      onChange={(e) => onChange(key, e.target.value)}
                      className={cn(
                        "h-9 w-full bg-transparent px-1.5 text-right text-blue-900 outline-none focus:bg-sky-50 focus:ring-2 focus:ring-inset focus:ring-sky-500",
                        editing !== key && isError(values[key]) && "text-red-600",
                        editing !== key && typeof values[key] === "string" && !isError(values[key]) && "text-left"
                      )}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
