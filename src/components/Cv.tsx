import type { Content } from "@/content/types";

export function Cv({ content }: { content: Content }) {
  const email = content.contact.email.replace("mailto:", "");
  return (
    <article className="mx-auto max-w-[800px] bg-white p-10 text-[12px] leading-relaxed text-neutral-900 print:p-0">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">D&apos;Artagnan Romann de Mello</h1>
        <p>{content.menu.role} · São Leopoldo, RS</p>
        <p>{email} · linkedin.com/in/dartagnanromann · github.com/Romanndemello</p>
      </header>
      <p className="mb-6">{content.about.now}</p>
      <section className="mb-6">
        {content.jobs.map((j) => (
          <div key={j.company + j.period} className="mb-3">
            <h3 className="font-semibold">{j.role} · {j.company}</h3>
            <p className="text-neutral-500">{j.period} · {j.place}</p>
            <ul className="list-disc pl-5">{j.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
          </div>
        ))}
      </section>
      <section className="mb-6">
        <h2 className="font-semibold">{content.education.title}</h2>
        <p>{content.education.course} · {content.education.school} · {content.education.period}</p>
      </section>
      <section>
        {content.stack.map((g) => <p key={g.group}><b>{g.group}:</b> {g.items.join(", ")}</p>)}
      </section>
    </article>
  );
}
