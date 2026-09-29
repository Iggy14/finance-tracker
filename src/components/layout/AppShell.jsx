// Shared page background: sky-blue fading into the grey page colour.
export default function AppShell({ children }) {
  return (
    <div className="min-h-svh bg-sky-200">
      <div className="relative mx-auto min-h-svh w-full max-w-[430px] overflow-x-clip bg-[#e8ecf1] text-left text-slate-950">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[60svh] bg-gradient-to-b from-sky-500 via-sky-300 via-50% to-[#e8ecf1]"
        />
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}
