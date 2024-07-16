import Link from "next/link";

export function Footer() {
  return (
    <div className="z-20 w-full bg-zinc-950 shadow backdrop-blur border-t border-zinc-900 ">
      <div className="mx-4 md:mx-8 flex h-14 items-center">
        <p className="text-xs md:text-sm leading-loose text-muted-foreground text-left">
          Built with love, Adrian @ 2024 - Currently not mobile friendly.
        </p>
      </div>
    </div>
  );
}