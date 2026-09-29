import { useEffect, useRef, useState } from "react";
import { supabase } from "../../supabase";

const STORAGE_KEY = "mini-sheet-cells";
const SAVE_DELAY  = 800;

const loadLocal = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
};

// Sheet cells synced to the `sheets` table (one row per user). localStorage is the
// instant-load cache and the fallback if Supabase is unreachable or the table is missing.
export default function useSheetCells(userId) {
  const [cells, setCells] = useState(loadLocal);
  const loaded = useRef(false); // don't upsert until the remote copy has been read

  useEffect(() => {
    let cancelled = false;
    supabase.from("sheets").select("cells").eq("user_id", userId).maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        if (data?.cells) setCells(data.cells);
        loaded.current = true;
      });
    return () => { cancelled = true; };
  }, [userId]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cells)); }
    catch { /* storage unavailable: sheet just won't cache locally */ }

    if (!loaded.current) return;
    const timer = setTimeout(() => {
      supabase.from("sheets")
        .upsert({ user_id: userId, cells, updated_at: new Date().toISOString() }, { onConflict: "user_id" })
        .then(({ error }) => { if (error) console.error("Mini sheet save failed:", error.message); });
    }, SAVE_DELAY);
    return () => clearTimeout(timer);
  }, [cells, userId]);

  return [cells, setCells];
}
