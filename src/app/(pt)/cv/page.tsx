import { Cv } from "@/components/Cv";
import { pt } from "@/content/pt";
export const metadata = { title: "CV · D'Artagnan Romann", robots: { index: false } };
export default function Page() { return <Cv content={pt} />; }
