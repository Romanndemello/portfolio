import { Site } from "@/components/Site";
import { en } from "@/content/en";

export const metadata = { title: en.meta.title, description: en.meta.description };

export default function Page() {
  return <Site content={en} />;
}
