import Link from "next/link";
import { nav } from "@/lib/nav";

export default function Home() {
  return (
    <div className="mx-auto max-w-[860px] px-12 py-16">
      <div className="font-sans text-[13px] font-bold uppercase tracking-[0.04em] text-neutral-500">
        Alduin Design System
      </div>
      <h1 className="mt-2 font-display text-[52px] leading-[1.05] text-neutral-900">
        Build with what&rsquo;s already there.
      </h1>
      <p className="mt-5 max-w-[560px] font-sans text-[16px] leading-[26px] text-neutral-700">
        This is the reference for every color, font, and component pulled
        from the Alduin Figma file — what it is, when to use it, and what
        it looks like in motion. Start with Foundations if you&rsquo;re
        deciding on a look; jump straight to Components if you know what
        you&rsquo;re placing on a page.
      </p>

      {nav.map((group) => (
        <div key={group.title} className="mt-12">
          <h2 className="font-sans text-[13px] font-bold uppercase tracking-[0.04em] text-neutral-500">
            {group.title}
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-xl border border-neutral-900/10 bg-white p-5 transition-colors hover:border-neutral-900/30"
              >
                <div className="font-sans text-[15px] font-bold text-neutral-900">
                  {item.label}
                </div>
                <div className="mt-1 font-sans text-[13px] text-neutral-500">
                  {item.blurb}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
