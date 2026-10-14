export type Lang = "pt" | "en";

export type Metric = { value: string; label: string; source: string };

export type Superpower = {
  id: "automacao" | "integracoes" | "marketing" | "produto";
  tab: string;
  kicker: string;
  title: string;
  body: string;
  metrics: Metric[];
};

export type Project = {
  id: string;
  name: string;
  role: string;
  period: string;
  summary: string;
  stack: string[];
  bullets: string[];
};

export type Job = { company: string; role: string; period: string; place: string; bullets: string[] };

export type Content = {
  lang: Lang;
  meta: { title: string; description: string };
  menu: { name: string; role: string };
  hero: { line1: string; line2: string; sub: string };
  folders: { id: string; label: string }[];
  dock: { home: string; superpowers: string; highlights: string; about: string; meeting: string; contact: string; terminal: string };
  widgets: { city: string; weatherCity: string; monogram: string; photoAlt: string; apps: string };
  highlightsTitle: string;
  highlights: { icon: "years" | "commits" | "users" | "plug" | "agents" | "screens"; value: string; label: string; source: string }[];
  projectsSub: string;
  playground: { before: string; after: string; sub: string; cta: string };
  footer: { tagline: string; meeting: string; cv: string };
  superpowersTitle: string;
  superpowers: Superpower[];
  experienceTitle: string;
  experienceSub: string;
  projectsTitle: string;
  projects: Project[];
  about: { file: string; then: string; now: string; next: string; labels: { then: string; now: string; next: string }; availability: string; stackTitle: string };
  closeLabel: string;
  contributions: { less: string; more: string; total: string };
  jobs: Job[];
  education: { title: string; school: string; course: string; period: string };
  stack: { group: string; items: string[] }[];
  contact: { title: string; email: string; linkedin: string; github: string; whatsapp: string; meeting: string };
  terminal: {
    welcome: string;
    help: string[];
    whoami: string[];
    unknown: string; // contém "{cmd}"
    hire: string;
    agents: string[];
    langChanged: string;
    cvDownloading: string;
    projectNotFound: string; // contém "{name}"
  };
  cvHref: string;
};
