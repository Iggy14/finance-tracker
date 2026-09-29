import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";

export default function AddMoneyDialog({ account, onAdd }) {
  const [open, setOpen]     = useState(false);
  const [amount, setAmount] = useState("");
  const [note, setNote]     = useState("");

  const value = parseFloat(amount);
  const valid = value > 0;

  const handleOpenChange = (next) => {
    setOpen(next);
    if (!next) { setAmount(""); setNote(""); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!valid) return;
    await onAdd({
      item: "Add money", amount: value, category: "Others",
      account_id: account.id, is_income: true, note,
    });
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button" variant="ghost" size="sm"
          className="rounded-xl border border-white/60 bg-white/20 text-white hover:bg-white/30 hover:text-white"
        >
          <Plus className="size-4" /> Add money
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <form onSubmit={handleSave} className="grid gap-4">
          <DialogHeader>
            <DialogTitle className="text-blue-950!">Add money</DialogTitle>
            <DialogDescription>Deposit into {account.name}. Recorded as income today.</DialogDescription>
          </DialogHeader>
          <label className="flex items-center justify-center gap-1 py-2">
            <span className="text-3xl font-semibold text-muted-foreground">฿</span>
            <input
              type="number" inputMode="decimal" min="0" placeholder="0" autoFocus
              value={amount} onChange={(e) => setAmount(e.target.value)}
              aria-label="Amount in baht"
              className="w-40 bg-transparent text-center text-5xl font-bold tabular-nums outline-none placeholder:text-muted-foreground/40"
            />
          </label>
          <div className="grid gap-2">
            <Label htmlFor={`note-${account.id}`}>Note (optional)</Label>
            <Input id={`note-${account.id}`} placeholder="e.g. Salary"
              value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
          <DialogFooter className="m-0 border-t-0 bg-transparent p-0">
            <Button type="submit" disabled={!valid}>Add</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
