import { Cv } from "@/components/Cv";
import { en } from "@/content/en";
export const metadata = { title: "Resume · D'Artagnan Romann", robots: { index: false } };
export default function Page() { return <Cv content={en} />; }
