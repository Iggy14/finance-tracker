export default function ExcelIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect x="4" y="4" width="40" height="40" rx="8" fill="#107C41" />
      <path fill="#21A366" d="M4 12a8 8 0 0 1 8-8h12v40H12a8 8 0 0 1-8-8z" opacity=".55" />
      <path
        d="m16 16 16 16m0-16L16 32"
        stroke="#fff"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
