import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";

const sans = Bricolage_Grotesque({ variable: "--font-sans-src", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-mono-src", subsets: ["latin"] });

export const bodyClass = `${sans.variable} ${mono.variable} bg-white font-sans text-black antialiased`;
