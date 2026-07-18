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
    <aside className="flex h-screen w-[280px] shrink-0 flex-col border-r border-neutral-900/10 bg-white">
      <div className="px-6 pt-8 pb-4">
        <Link href="/" className="block">
          <div className="font-display text-[22px] leading-none text-neutral-900">
            Alduin
          </div>
          <div className="mt-1 font-sans text-[13px] text-neutral-500">
            Design System
          </div>
        </Link>
      </div>

      <div className="px-6 pb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find anything..."
          className="w-full rounded-md border border-neutral-900/15 bg-neutral-100/60 px-3 py-2 font-sans text-[14px] text-neutral-900 outline-none placeholder:text-neutral-500 focus:border-neutral-900/30"
        />
      </div>

      <nav className="flex-1 overflow-y-auto px-4 pb-8">
        {filtered.length === 0 && (
          <p className="px-2 py-4 font-sans text-[13px] text-neutral-500">
            No matches for &ldquo;{query}&rdquo;.
          </p>
        )}
        {filtered.map((group) => (
          <div key={group.title} className="mb-6">
            <div className="px-2 pb-2 font-sans text-[12px] font-bold uppercase tracking-[0.04em] text-neutral-500">
              {group.title}
            </div>
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block rounded-md px-2 py-2 transition-colors ${
                        active
                          ? "bg-neutral-900 text-white"
                          : "text-neutral-900 hover:bg-neutral-100"
                      }`}
                    >
                      <div className="font-sans text-[14px] font-bold leading-tight">
                        {item.label}
                      </div>
                      <div
                        className={`font-sans text-[12px] leading-tight ${
                          active ? "text-neutral-200" : "text-neutral-500"
                        }`}
                      >
                        {item.blurb}
                      </div>
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
