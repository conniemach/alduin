import { type HTMLAttributes } from "react";
import clsx from "clsx";

/**
 * Shared chip structure + markup for every product mark (CobaltMark,
 * BoreasMark, CypherMark, NightwatchMark) — the visual treatment and
 * motion (see styles/product-mark.css) are identical across all four;
 * only the artwork and its silhouette mask differ per product. Not
 * exported from index.ts: consumers reach for the named per-product
 * components, this is just what they share.
 */
export interface ProductMarkProps extends HTMLAttributes<HTMLDivElement> {
  /** The plate artwork, front-on (data URI or URL). */
  markSrc: string;
  /**
   * A same-size alpha-only silhouette of just the glowing icon (not the
   * plate) — everything else transparent. Drives both the core glow and
   * the engraved emboss, so they trace the icon's exact shape.
   */
  maskSrc: string;
  /** Product name, used as the image's alt text. */
  alt: string;
}

export function ProductMark({ markSrc, maskSrc, alt, className, ...props }: ProductMarkProps) {
  return (
    <div className={clsx("product-mark-scene", className)} {...props}>
      <div className="product-mark-shadow-wrap">
        <div className="product-mark-shadow" />
      </div>

      <div className="product-mark-chip">
        <div className="product-mark-face product-mark-back" />
        <div className="product-mark-rim" />
        <div className="product-mark-edge product-mark-edge-top" />
        <div className="product-mark-edge product-mark-edge-bottom" />
        <div className="product-mark-edge product-mark-edge-left" />
        <div className="product-mark-edge product-mark-edge-right" />
        <div className="product-mark-face product-mark-front">
          <img src={markSrc} alt={alt} />
          <div
            className="product-mark-core-glow"
            style={{ WebkitMaskImage: `url(${maskSrc})`, maskImage: `url(${maskSrc})` }}
          />
          <div
            className="product-mark-core-glow-hot"
            style={{ WebkitMaskImage: `url(${maskSrc})`, maskImage: `url(${maskSrc})` }}
          />
          <div className="product-mark-emboss-ao" style={{ backgroundImage: `url(${maskSrc})` }} />
          <div className="product-mark-emboss-shadow" style={{ backgroundImage: `url(${maskSrc})` }} />
          <div
            className="product-mark-emboss-highlight"
            style={{ WebkitMaskImage: `url(${maskSrc})`, maskImage: `url(${maskSrc})` }}
          />
          <div className="product-mark-sheen" />
          <div className="product-mark-vignette" />
        </div>
      </div>
    </div>
  );
}
