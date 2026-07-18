"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/lib/nav";

export function Sidebar() {
  const pathname = usePathname();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return nav;
    return nav
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (item) =>
            item.label.toLowerCase().includes(q) ||
            item.blurb.toLowerCase().includes(q),
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [query]);

  return (
    <aside className="flex h-screen w-[264px] shrink-0 flex-col border-r border-neutral-900/[0.06] bg-white">
      <div className="px-7 pb-5 pt-9">
        <Link href="/" className="block">
          <div className="font-display text-[20px] leading-none text-neutral-900">
            Alduin
          </div>
          <div className="mt-1.5 font-sans text-[12px] text-neutral-500">
            Design System
          </div>
        </Link>
      </div>

      <div className="px-7 pb-6">
        <div className="relative">
          <svg
            viewBox="0 0 16 16"
            fill="none"
            className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-neutral-500"
          >
            <circle cx="6.5" cy="6.5" r="4.75" stroke="currentColor" strokeWidth="1.2" />
            <path d="M10 10L14 14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find anything"
            className="w-full rounded-full bg-neutral-100/70 py-2 pl-9 pr-3 font-sans text-[13.5px] text-neutral-900 outline-none placeholder:text-neutral-500 focus:bg-neutral-100"
          />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 pb-10">
        {filtered.length === 0 && (
          <p className="px-3 py-4 font-sans text-[13px] text-neutral-500">
            No matches for &ldquo;{query}&rdquo;.
          </p>
        )}
        {filtered.map((group, i) => (
          <div
            key={group.title}
            className={`mb-8 ${i > 0 ? "border-t border-neutral-900/[0.06] pt-8" : ""}`}
          >
            <div className="px-3 pb-2.5 font-sans text-[11px] font-bold uppercase tracking-[0.06em] text-neutral-400">
              {group.title}
            </div>
            <ul className="flex flex-col gap-[2px]">
              {group.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block rounded-md py-[7px] pl-3 pr-3 font-sans text-[14px] leading-tight transition-colors ${
                        active
                          ? "bg-neutral-900/[0.06] font-bold text-neutral-900"
                          : "font-medium text-neutral-600 hover:bg-neutral-900/[0.04] hover:text-neutral-900"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
