# TODO

## Mini Sheet: create the `sheets` table in Supabase
- **Missing:** the code now syncs to a `sheets` table, but the table doesn't exist until the SQL is run. Until then saves log a console error and the sheet only persists in `localStorage`.
- **Why skipped:** I have no access to the Supabase project; the SQL must be run by the owner.
- **Steps:** paste `docs/sheets.sql` into Supabase → SQL editor and run it. Then edit the sheet, wait ~1 s, and confirm a row appears in `sheets`. Delete this entry.
- **Files:** `docs/sheets.sql`, `src/components/calendar/useSheetCells.js`.
