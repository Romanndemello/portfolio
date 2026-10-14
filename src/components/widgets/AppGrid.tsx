import type { Content } from "@/content/types";
import { GLASS } from "@/lib/palette";
import { CvMark, GitHubMark, LinkedInMark, MailMark, TerminalMark, WhatsAppMark } from "@/components/ui/Icons";

export function AppGrid({ content, onTerminal, className = "" }: { content: Content; onTerminal: () => void; className?: string }) {
  const c = content.contact;
  const links = [
    { label: "LinkedIn", href: c.linkedin, Icon: LinkedInMark },
    { label: "GitHub", href: c.github, Icon: GitHubMark },
    { label: "Email", href: c.email, Icon: MailMark },
    { label: "WhatsApp", href: c.whatsapp, Icon: WhatsAppMark },
    { label: content.footer.cv, href: content.cvHref, Icon: CvMark },
  ];
  const item = "grid h-12 w-12 place-items-center transition-transform hover:-translate-y-0.5";
  return (
    <nav aria-label={content.widgets.apps} className={`${GLASS} p-2.5 ${className}`}>
      <ul className="grid grid-cols-3 gap-1">
        {links.map(({ label, href, Icon }) => (
          <li key={label}>
            <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" aria-label={label} title={label} className={item}>
              <Icon className="h-10 w-10 rounded-[22%] shadow-sm" />
            </a>
          </li>
        ))}
        <li>
          <button type="button" onClick={onTerminal} aria-label={content.dock.terminal} title={content.dock.terminal} className={item}>
            <TerminalMark className="h-10 w-10 rounded-[22%] shadow-sm" />
          </button>
        </li>
      </ul>
    </nav>
  );
}
