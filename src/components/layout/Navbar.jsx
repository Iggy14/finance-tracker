import { LogOut } from "lucide-react";
import { supabase } from "../../supabase";
import { Button } from "@/components/ui/button";

export default function Navbar({ user }) {
  const logout = () => supabase.auth.signOut();

  return (
    <header className="flex items-center justify-between px-5 pt-4 pb-2">
      <img
        src={user.user_metadata?.avatar_url}
        alt=""
        referrerPolicy="no-referrer"
        className="size-10 rounded-full object-cover"
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={logout}
        aria-label="Sign out"
        className="size-10 rounded-full bg-white/20 text-white hover:bg-white/30 hover:text-white"
      >
        <LogOut />
      </Button>
    </header>
  );
}
