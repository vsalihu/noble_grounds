"use client";

import { useMemo, useState } from "react";
import { Maximize2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";
import { trackGalleryFlip, trackGalleryFullscreen } from "@/lib/analytics";
import type { GalleryComparison, GalleryProject } from "@/types/supabase";

type GalleryComparisonCardProps = {
  comparison: GalleryComparison;
  project: GalleryProject;
};

export function GalleryComparisonCard({
  comparison,
  project,
}: GalleryComparisonCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [viewerSide, setViewerSide] = useState<"before" | "after" | null>(null);
  const reduceMotion = useReducedMotion();
  const location = comparison.location || project.location || project.address || "Wisbech";
  const baseAlt =
    comparison.alt_text ||
    `Noble Grounds lawn mowing before and after in ${location}`;
  const activeSide = isFlipped ? "after" : "before";

  const currentImage = useMemo(
    () => ({
      src: activeSide === "after" ? comparison.after_image_url : comparison.before_image_url,
      label: activeSide === "after" ? "After" : "Before",
      alt: `${activeSide === "after" ? "After" : "Before"}: ${baseAlt}`,
    }),
    [activeSide, baseAlt, comparison.after_image_url, comparison.before_image_url],
  );

  function openViewer(side: "before" | "after") {
    trackGalleryFullscreen();
    setViewerSide(side);
  }

  function flipCard() {
    trackGalleryFlip();
    setIsFlipped((current) => !current);
  }

  return (
    <>
      <div className="group">
        <div
          role="button"
          tabIndex={0}
          aria-label={`${comparison.title || "Before and after comparison"}. Tap to reveal the after result.`}
          className="relative aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl border border-border-soft bg-sage-100 shadow-[0_18px_50px_rgb(22_38_30_/_0.12)] outline-none transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_70px_rgb(18_50_38_/_0.18)] focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
          style={{ perspective: 1200 }}
          onClick={flipCard}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              flipCard();
            }
          }}
        >
          {reduceMotion ? (
            <ImageFace
              src={currentImage.src}
              alt={currentImage.alt}
              label={currentImage.label}
            />
          ) : (
            <motion.div
              className="relative h-full w-full"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <ImageFace
                src={comparison.before_image_url}
                alt={`Before: ${baseAlt}`}
                label="Before"
              />
              <ImageFace
                src={comparison.after_image_url}
                alt={`After: ${baseAlt}`}
                label="After"
                isBack
              />
            </motion.div>
          )}

          <button
            type="button"
            className="absolute right-3 top-3 z-20 inline-flex size-11 items-center justify-center rounded-md border border-ivory/70 bg-ivory/90 text-noble-green-900 shadow-soft backdrop-blur transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-500"
            aria-label={`Open ${activeSide} image fullscreen`}
            onClick={(event) => {
              event.stopPropagation();
              openViewer(activeSide);
            }}
          >
            <Maximize2 className="size-4" />
          </button>
        </div>

        <div className="mt-3 flex items-start justify-between gap-3">
          <div>
            {comparison.title ? (
              <h3 className="font-serif text-2xl font-semibold text-noble-green-950">
                {comparison.title}
              </h3>
            ) : null}
            <p className="text-sm font-semibold text-sage-700">
              Tap to reveal the after result
            </p>
          </div>
          {comparison.is_featured ? (
            <span className="rounded-md bg-sage-100 px-2 py-1 text-xs font-semibold text-noble-green-800">
              Featured
            </span>
          ) : null}
        </div>
        {comparison.description ? (
          <p className="mt-2 text-sm leading-6 text-noble-green-700">
            {comparison.description}
          </p>
        ) : null}
      </div>

      {viewerSide ? (
        <GalleryLightbox
          beforeImageUrl={comparison.before_image_url}
          afterImageUrl={comparison.after_image_url}
          beforeAlt={`Before: ${baseAlt}`}
          afterAlt={`After: ${baseAlt}`}
          initialSide={viewerSide}
          title={comparison.title || project.title || "Noble Grounds gallery"}
          onClose={() => setViewerSide(null)}
        />
      ) : null}
    </>
  );
}

function ImageFace({
  src,
  alt,
  label,
  isBack = false,
}: {
  src: string;
  alt: string;
  label: string;
  isBack?: boolean;
}) {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        backfaceVisibility: "hidden",
        transform: isBack ? "rotateY(180deg)" : undefined,
      }}
    >
      {src ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
      ) : (
        <div
          className="h-full w-full bg-[linear-gradient(135deg,#0b2118,#123226_42%,#697a58_78%,#e8d7c2)]"
          role="img"
          aria-label={alt}
        />
      )}
      <span className="absolute left-3 top-3 rounded-md bg-ivory/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-noble-green-900 shadow-soft backdrop-blur">
        {label}
      </span>
    </div>
  );
}
