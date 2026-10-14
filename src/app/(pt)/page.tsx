import { Site } from "@/components/Site";
import { LangRedirect } from "@/components/LangRedirect";
import { pt } from "@/content/pt";

export const metadata = { title: pt.meta.title, description: pt.meta.description };

export default function Page() {
  return (<><LangRedirect /><Site content={pt} /></>);
}
