"use client";

import { useState } from "react";

export function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-lg bg-neutral-900">
      <button
        type="button"
        onClick={() => {
          navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="absolute right-3 top-3 rounded-md bg-white/10 px-2 py-1 font-sans text-[12px] text-white hover:bg-white/20"
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <pre className="overflow-x-auto p-5 pr-16 font-mono text-[13px] leading-[1.6] text-neutral-100">
        <code>{code}</code>
      </pre>
    </div>
  );
}
