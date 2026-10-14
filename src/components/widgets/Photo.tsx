import { GLASS } from "@/lib/palette";

export function Photo({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <figure className={`${GLASS} flex w-[150px] flex-col items-center gap-2 p-2.5`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} width={130} height={130} className="h-[130px] w-[130px] rounded-[14px] object-cover" />
      <figcaption className="text-center text-[10px] font-semibold leading-tight text-black/55">{caption}</figcaption>
    </figure>
  );
}
