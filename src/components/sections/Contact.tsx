import type { Content } from "@/content/types";
import { GitHubMark, LinkedInMark, MailMark, WhatsAppMark } from "@/components/ui/Icons";

function ArrowLink({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="group relative inline-flex w-fit items-center gap-1.5">
      <span className="text-black/70 transition-colors group-hover:text-black">{children}</span>
      <span aria-hidden className="relative h-4 w-4 overflow-hidden text-black/70 group-hover:text-black">
        <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-out group-hover:translate-x-[150%]">→</span>
        <span className="absolute inset-0 flex -translate-x-[150%] items-center justify-center transition-transform duration-300 ease-out group-hover:translate-x-0">→</span>
      </span>
      <span aria-hidden className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-black transition-transform duration-300 ease-out group-hover:scale-x-100" />
    </a>
  );
}

export function Contact({ content }: { content: Content }) {
  const c = content.contact;
  const icons = [
    { label: "LinkedIn", href: c.linkedin, Icon: LinkedInMark },
    { label: "GitHub", href: c.github, Icon: GitHubMark },
    { label: "Email", href: c.email, Icon: MailMark },
    { label: "WhatsApp", href: c.whatsapp, Icon: WhatsAppMark },
  ];
  return (
    <footer id="contact" aria-label={c.title} role="region" className="relative z-50 scroll-mt-24 border-t border-black/10 bg-white px-6 py-16">
      <div className="mx-auto grid max-w-[1060px] gap-10 md:grid-cols-[1fr_auto_auto] md:gap-20">
        <div>
          <div className="flex items-start gap-4">
            <span aria-hidden className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[24%] border border-black/10 bg-white text-[15px] font-extrabold tracking-tight shadow-md">DR</span>
            <div>
              <h2 className="text-[15px] font-bold leading-snug">{content.menu.name}.</h2>
              <p className="text-[15px] leading-snug text-black/55">{content.footer.tagline}</p>
            </div>
          </div>
          <ul className="mt-6 flex items-center gap-2.5">
            {icons.map(({ label, href, Icon }) => (
              <li key={label}>
                <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" aria-label={label}
                  className="block transition-transform duration-150 hover:-translate-y-1">
                  <Icon className="h-10 w-10 rounded-[22%] shadow-sm" />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <nav aria-label={c.title} className="flex flex-col items-start gap-2.5 text-sm font-medium">
          <ArrowLink href={c.email}>Email</ArrowLink>
          <ArrowLink href={c.linkedin}>LinkedIn</ArrowLink>
          <ArrowLink href={c.github}>GitHub</ArrowLink>
          <ArrowLink href={c.whatsapp}>WhatsApp</ArrowLink>
          <ArrowLink href={c.meeting}>{content.footer.meeting}</ArrowLink>
          <ArrowLink href={content.cvHref}>{content.footer.cv}</ArrowLink>
        </nav>
        <div className="flex flex-col items-start gap-2 text-sm text-black/50">
          <p>{content.lang === "pt" ? "São Leopoldo, RS" : "São Leopoldo, Brazil"}</p>
          <p>© {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}
