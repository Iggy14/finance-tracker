import { useState } from "react";
import { supabase } from "../../supabase";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import GoogleIcon from "./GoogleIcon";

export default function Auth() {
  const [busy, setBusy] = useState(false);

  const login = async () => {
    setBusy(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) setBusy(false);
  };

  return (
    <div className="min-h-svh bg-sky-200">
      <main className="relative mx-auto flex min-h-svh w-full max-w-[430px] flex-col overflow-hidden bg-[#e8ecf1] px-6 pb-16 text-left text-slate-950">
        <div className="relative -mx-6 h-[58svh] shrink-0 bg-gradient-to-b from-sky-500 via-sky-300 via-50% to-[#e8ecf1]">
          <img
            src="/images/auth/credit-card.png"
            alt=""
            width={1012}
            height={638}
            className="absolute top-[38%] -left-12 w-72 -rotate-[15deg] rounded-2xl opacity-70 shadow-2xl shadow-sky-900/30"
          />
          <img
            src="/images/auth/credit-card.png"
            alt=""
            width={1012}
            height={638}
            className="absolute top-[16%] -right-20 w-80 rotate-[12deg] rounded-2xl shadow-2xl shadow-sky-900/30"
          />
        </div>

        <div className="flex shrink-0 flex-col">
          <h1 className="!m-0 !pb-4 !text-3xl !leading-snug !font-bold !tracking-tight !text-slate-950">
            Track your money
            <br />
            in one place
          </h1>
          <p className="m-0 mt-5 text-sm leading-relaxed text-slate-600">
            Log your spending, watch your balance, and grow your savings with
            IggyCash.
          </p>

          <Button
            onClick={login}
            disabled={busy}
            size="lg"
            className="mt-10 h-14 w-full rounded-2xl bg-slate-950 text-base font-medium text-white hover:bg-slate-800"
          >
            {busy ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <span className="flex size-6 items-center justify-center rounded-full bg-white">
                <GoogleIcon className="size-3.5" />
              </span>
            )}
            {busy ? "Redirecting…" : "Continue with Google"}
          </Button>
          <p className="!m-0 !mt-[15px] text-center text-sm text-slate-600">
            Your data is encrypted and secure.
          </p>
        </div>
      </main>
    </div>
  );
}
