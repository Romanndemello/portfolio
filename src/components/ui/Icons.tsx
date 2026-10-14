import { useId } from "react";

// Ícones desenhados à mão, traço de 2px como os de sistema.
type P = { className?: string };
const base = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, viewBox: "0 0 24 24", "aria-hidden": true };

export const FolderGlyph = ({ className }: P) => (
  <svg {...base} className={className}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" fill="currentColor" stroke="none" /></svg>
);
export const Sparkles = ({ className }: P) => (
  <svg {...base} className={className}><path d="M10 3l1.6 4.4L16 9l-4.4 1.6L10 15l-1.6-4.4L4 9l4.4-1.6Z" fill="currentColor" stroke="none" /><path d="M18 14l.8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8Z" fill="currentColor" stroke="none" /></svg>
);
export const Heart = ({ className }: P) => (
  <svg {...base} className={className}><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" fill="currentColor" stroke="none" /></svg>
);
export const Contacts = ({ className }: P) => (
  <svg {...base} className={className}><rect x="4" y="3" width="15" height="18" rx="2.5" fill="currentColor" stroke="none" /><circle cx="11.5" cy="10" r="2.5" fill="#1FB84A" stroke="none" /><path d="M7.5 17c.6-2 2.2-3 4-3s3.4 1 4 3" stroke="#1FB84A" /><path d="M21 7v2M21 12v2" /></svg>
);
export const TerminalGlyph = ({ className }: P) => (
  <svg {...base} className={className}><path d="M5 8l4 4-4 4M11 16h8" /></svg>
);
export const Commit = ({ className }: P) => (
  <svg {...base} className={className}><circle cx="12" cy="12" r="3.5" /><path d="M3 12h5.5M15.5 12H21" /></svg>
);
export const PullRequest = ({ className }: P) => (
  <svg {...base} className={className}><circle cx="6" cy="6" r="2.5" /><circle cx="6" cy="18" r="2.5" /><circle cx="18" cy="18" r="2.5" /><path d="M6 8.5v7M18 15.5V9a3 3 0 0 0-3-3h-4M13 4l-2 2 2 2" /></svg>
);
export const Bot = ({ className }: P) => (
  <svg {...base} className={className}><rect x="4" y="8" width="16" height="11" rx="3" /><path d="M12 4v4M9 13v1M15 13v1M2 13v2M22 13v2" /></svg>
);
export const Phone = ({ className }: P) => (
  <svg {...base} className={className}><rect x="7" y="2.5" width="10" height="19" rx="2.5" /><path d="M11 18h2" /></svg>
);
export const Briefcase = ({ className }: P) => (
  <svg {...base} className={className}><rect x="3" y="7" width="18" height="13" rx="2.5" /><path d="M9 7V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v2M3 13h18" /></svg>
);
export const Users = ({ className }: P) => (
  <svg {...base} className={className}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5" /></svg>
);
export const Plug = ({ className }: P) => (
  <svg {...base} className={className}><path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0ZM12 17v4" /></svg>
);
export const ArrowUpRight = ({ className }: P) => (
  <svg {...base} className={className}><path d="M7 17 17 7M8 7h9v9" /></svg>
);
export const Plus = ({ className }: P) => (
  <svg {...base} className={className}><path d="M12 5v14M5 12h14" /></svg>
);
export const Sun = ({ className }: P) => (
  <svg {...base} className={className}><circle cx="12" cy="12" r="4" fill="currentColor" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
);
export const Cloud = ({ className }: P) => (
  <svg {...base} className={className}><path d="M7 18a4 4 0 0 1-.6-8A5.5 5.5 0 0 1 17 9a3.5 3.5 0 0 1 .5 9Z" fill="currentColor" stroke="none" /></svg>
);
export const Rain = ({ className }: P) => (
  <svg {...base} className={className}><path d="M7 14a4 4 0 0 1-.6-8A5.5 5.5 0 0 1 17 5a3.5 3.5 0 0 1 .5 9Z" fill="currentColor" stroke="none" /><path d="M8 17l-1 3M12 17l-1 3M16 17l-1 3" /></svg>
);

// Marcas, em forma simples e cor de cada uma.
export const LinkedInMark = ({ className }: P) => (
  <svg viewBox="0 0 24 24" aria-hidden className={className}><rect width="24" height="24" rx="5" fill="#0A66C2" /><path fill="#fff" d="M6.5 9.5h2.4V18H6.5zM7.7 5.6a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8ZM10.6 9.5h2.3v1.2c.4-.7 1.3-1.4 2.6-1.4 2.5 0 3 1.6 3 3.7V18h-2.4v-4.4c0-1 0-2.3-1.4-2.3s-1.7 1.1-1.7 2.2V18h-2.4z" /></svg>
);
export const GitHubMark = ({ className }: P) => (
  <svg viewBox="0 0 24 24" aria-hidden className={className}><rect width="24" height="24" rx="5" fill="#111" /><path fill="#fff" d="M12 4.5a7.5 7.5 0 0 0-2.4 14.6c.4.1.5-.2.5-.4v-1.3c-2.1.5-2.5-.9-2.5-.9-.3-.9-.8-1.1-.8-1.1-.7-.5 0-.5 0-.5.8.1 1.2.8 1.2.8.7 1.2 1.8.8 2.2.6.1-.5.3-.8.5-1-1.7-.2-3.4-.8-3.4-3.7 0-.8.3-1.5.8-2-.1-.2-.3-1 .1-2 0 0 .6-.2 2 .8a7 7 0 0 1 3.7 0c1.4-1 2-.8 2-.8.4 1 .2 1.8.1 2 .5.5.8 1.2.8 2 0 2.9-1.8 3.5-3.4 3.7.3.2.5.7.5 1.4v2c0 .2.1.5.5.4A7.5 7.5 0 0 0 12 4.5Z" /></svg>
);
export const MailMark = ({ className }: P) => (
  <svg viewBox="0 0 24 24" aria-hidden className={className}><rect width="24" height="24" rx="5" fill="#fff" /><rect x="4" y="6.5" width="16" height="11" rx="1.5" fill="none" stroke="#EA4335" strokeWidth="1.8" /><path d="M4.5 7.5 12 13l7.5-5.5" fill="none" stroke="#EA4335" strokeWidth="1.8" strokeLinejoin="round" /></svg>
);
export const WhatsAppMark = ({ className }: P) => (
  <svg viewBox="0 0 24 24" aria-hidden className={className}><rect width="24" height="24" rx="5" fill="#25D366" /><path fill="none" stroke="#fff" strokeWidth="1.6" d="M6.2 17.8l.9-2.9a6 6 0 1 1 2.2 2.1Z" strokeLinejoin="round" /><path fill="#fff" d="M10 9.4c.2-.4.4-.4.6-.4h.4c.1 0 .3 0 .4.3l.5 1.2c0 .1 0 .3-.1.4l-.3.4c-.1.1-.1.2 0 .4.4.7 1 1.2 1.7 1.6.2.1.3 0 .4-.1l.4-.5c.1-.1.2-.1.4-.1l1.1.5c.2.1.3.2.3.3 0 .4-.2 1-.7 1.2-.5.3-1.2.3-2.4-.2a6 6 0 0 1-2.6-2.5c-.4-.8-.5-1.6-.1-2Z" /></svg>
);
export const CvMark = ({ className }: P) => (
  <svg viewBox="0 0 24 24" aria-hidden className={className}><rect width="24" height="24" rx="5" fill="#fff" /><path d="M7 4.5h7l3.5 3.5v11.5H7Z" fill="#f2f2f4" stroke="#c7c7cc" strokeWidth="1" /><text x="12.2" y="16.2" textAnchor="middle" fontSize="5.5" fontWeight="800" fill="#F92D50" fontFamily="system-ui">CV</text></svg>
);
export const TerminalMark = ({ className }: P) => (
  <svg viewBox="0 0 24 24" aria-hidden className={className}><rect width="24" height="24" rx="5" fill="#1c1c1e" /><rect x=".5" y=".5" width="23" height="23" rx="4.5" fill="none" stroke="#3a3a3c" /><path d="M6 8.5l3 2.5-3 2.5M11 15h5" fill="none" stroke="#e5e5ea" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

// Pasta azul clara, no jeito das pastas de sistema.
export function FolderIcon({ className }: P) {
  // id único: com o mesmo id, uma pasta escondida (display: none) apaga o degradê das outras.
  const id = useId();
  return (
    <svg viewBox="0 0 64 52" aria-hidden className={className}>
      <defs>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6CC4F5" /><stop offset="1" stopColor="#4AAEEA" /></linearGradient>
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8FD6FB" /><stop offset="1" stopColor="#62BFF3" /></linearGradient>
      </defs>
      <path d="M4 6a3 3 0 0 1 3-3h15l4 4h31a3 3 0 0 1 3 3v36a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3Z" fill={`url(#${id}b)`} />
      <path d="M4 15a3 3 0 0 1 3-3h50a3 3 0 0 1 3 3v31a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3Z" fill={`url(#${id}f)`} />
      <path d="M5 13.5h54" stroke="#fff" strokeOpacity=".55" />
    </svg>
  );
}
