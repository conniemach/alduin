"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { Icon } from "@alduin/design-system";

export interface ComparisonRow {
  feature: string;
  /** Either a checkmark/x (boolean) or literal text for this row (e.g. the price row). */
  productValue: boolean | string;
  /** One entry per competitor, in the same order as `competitors`. */
  competitorValues: (boolean | string)[];
}

export interface ComparisonTableProps {
  productName: string;
  competitors: string[];
  rows: ComparisonRow[];
}

// Fixed per-row/header heights let every column's cells line up without
// manual pixel math, and (new here) let the sliding glass box's height
// stay constant across columns since it never needs to change size —
// every data column is the same width and covers the same rows.
const HEADER_H = "h-12";
const ROW_H = "h-16";

function Cell({ value, active }: { value: boolean | string; active: boolean }) {
  if (typeof value === "string") {
    // Heading SM from the design system (IBM Plex Mono 400 · 18/21.6 · -0.54).
    return (
      <span
        className={[
          "font-mono text-[18px] leading-[21.6px] tracking-[-0.54px] transition-colors duration-300",
          active ? "text-white" : "text-neutral-500",
        ].join(" ")}
      >
        {value}
      </span>
    );
  }
  return (
    <Icon
      name={value ? "check" : "close"}
      className={[
        "size-4 transition-colors duration-300",
        active ? "text-white" : "text-neutral-600",
      ].join(" ")}
    />
  );
}

interface BoxRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

// A single liquid-glass box (border-white/15, bg-white/[0.04],
// backdrop-blur — the same treatment as DemoForm's panel) that sits over
// the product's own column by default, and slides over to whichever
// column the mouse is hovering (at half opacity, since that's a
// competitor, not "us"). Leaving the table entirely slides it back home.
export function ComparisonTable({
  productName,
  competitors,
  rows,
}: ComparisonTableProps) {
  const columns = [productName, ...competitors];
  const gridTemplateColumns = `1.6fr repeat(${columns.length}, 1fr)`;

  const containerRef = useRef<HTMLDivElement>(null);
  const colRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);
  const active = hovered ?? 0;
  const [box, setBox] = useState<BoxRect | null>(null);

  useEffect(() => {
    function measure() {
      const containerEl = containerRef.current;
      const colEl = colRefs.current[active];
      if (!containerEl || !colEl) return;
      const containerRect = containerEl.getBoundingClientRect();
      const colRect = colEl.getBoundingClientRect();
      setBox({
        left: colRect.left - containerRect.left,
        top: colRect.top - containerRect.top,
        width: colRect.width,
        height: colRect.height,
      });
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active, rows.length, columns.length]);

  const valueFor = (row: ComparisonRow, colIndex: number) =>
    colIndex === 0 ? row.productValue : row.competitorValues[colIndex - 1];

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseLeave={() => setHovered(null)}
    >
      {box && (
        <div
          className="pointer-events-none absolute rounded-2xl border backdrop-blur-xl transition-[left,top,width,height,opacity,box-shadow,border-color] duration-300 ease-out"
          style={{
            left: box.left,
            top: box.top,
            width: box.width,
            height: box.height,
            opacity: active === 0 ? 1 : 0.5,
            // Only the product's own column gets the brand-green glow
            // (same green as the ProductMark glow, --product-mark-green)
            // — competitors just get plain glass, no glow.
            backgroundColor:
              active === 0 ? "rgba(30, 225, 40, 0.06)" : "rgba(255, 255, 255, 0.04)",
            borderColor:
              active === 0 ? "rgba(30, 225, 40, 0.35)" : "rgba(255, 255, 255, 0.15)",
            boxShadow:
              active === 0
                ? "0 0 40px 4px rgba(30, 225, 40, 0.25), inset 0 0 24px rgba(30, 225, 40, 0.08)"
                : "none",
          }}
        />
      )}

      <div
        className="relative grid gap-x-3"
        style={{ gridTemplateColumns }}
      >
        {/* Invisible measurement targets — one per data column, spanning
            header through the last row, purely so the glass box above
            knows where to slide to. pointer-events-none keeps them out
            of the way of hover handlers on the real cells. */}
        {columns.map((column, i) => (
          <div
            key={`${column}-measure`}
            ref={(el) => {
              colRefs.current[i] = el;
            }}
            className="pointer-events-none"
            style={{ gridColumn: 2 + i, gridRow: `1 / span ${rows.length + 1}` }}
          />
        ))}

        {/* Label column header — blank, just holds the header row's height. */}
        <div className={HEADER_H} style={{ gridColumn: 1, gridRow: 1 }} />

        {/* Column headers. */}
        {columns.map((column, i) => (
          <div
            key={column}
            onMouseEnter={() => setHovered(i)}
            className={[
              HEADER_H,
              "flex items-center justify-center text-center transition-colors duration-300",
              i === 0
                ? "font-logotype text-[16px] font-medium tracking-[-0.4px]"
                : "font-sans text-[12px] leading-[16.8px] tracking-[-0.12px]",
              i === active ? "text-white" : "text-neutral-500",
            ].join(" ")}
            style={{ gridColumn: 2 + i, gridRow: 1 }}
          >
            {column}
          </div>
        ))}

        {/* Feature rows: label + each column's cell. */}
        {rows.map((row, i) => (
          <Fragment key={row.feature}>
            <div
              className={[
                ROW_H,
                "flex items-center font-sans text-[13px] leading-[18.2px] text-neutral-200",
                i > 0 ? "border-t border-white/10" : "",
              ].join(" ")}
              style={{ gridColumn: 1, gridRow: i + 2 }}
            >
              {row.feature}
            </div>
            {columns.map((column, j) => (
              <div
                key={`${row.feature}-${column}`}
                onMouseEnter={() => setHovered(j)}
                className={[
                  ROW_H,
                  "flex items-center justify-center gap-2",
                  i > 0 ? "border-t border-white/10" : "",
                ].join(" ")}
                style={{ gridColumn: 2 + j, gridRow: i + 2 }}
              >
                <Cell value={valueFor(row, j)} active={j === active} />
              </div>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
