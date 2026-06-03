"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { Minus, Plus, RotateCcw, X } from "lucide-react";

type GalleryLightboxProps = {
  beforeImageUrl: string;
  afterImageUrl: string;
  beforeAlt: string;
  afterAlt: string;
  initialSide: "before" | "after";
  title: string;
  onClose: () => void;
};

export function GalleryLightbox({
  beforeImageUrl,
  afterImageUrl,
  beforeAlt,
  afterAlt,
  initialSide,
  title,
  onClose,
}: GalleryLightboxProps) {
  const [side, setSide] = useState(initialSide);
  const [zoom, setZoom] = useState(1);
  const imageUrl = side === "after" ? afterImageUrl : beforeImageUrl;
  const imageAlt = side === "after" ? afterAlt : beforeAlt;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] h-[100dvh] w-screen overflow-hidden bg-noble-green-950/95"
      role="dialog"
      aria-modal="true"
      aria-label="Fullscreen before and after gallery viewer"
    >
      <div className="fixed inset-x-0 top-0 z-[10000] px-3 pb-3 pt-[calc(env(safe-area-inset-top)+0.75rem)] md:px-6 md:pt-6">
        <div className="mx-auto flex min-h-12 max-w-[calc(100vw-24px)] items-center justify-between gap-3 rounded-2xl border border-ivory/15 bg-noble-green-950/75 px-3 py-2 shadow-[0_18px_70px_rgb(0_0_0_/_0.28)] backdrop-blur-xl md:max-w-6xl">
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold uppercase tracking-[0.16em] text-ivory/70">
              {side === "after" ? "After" : "Before"}
            </p>
            <p className="truncate text-sm font-semibold text-ivory">{title}</p>
          </div>
          <ViewerIconButton label="Close fullscreen viewer" onClick={onClose}>
            <X className="size-4" />
          </ViewerIconButton>
        </div>
      </div>

      <div className="flex h-[100dvh] w-screen items-center justify-center overflow-hidden px-3 pb-[calc(env(safe-area-inset-bottom)+10.5rem)] pt-[calc(env(safe-area-inset-top)+5.75rem)] md:px-6 md:pb-28 md:pt-28">
        <div className="max-h-full max-w-[calc(100vw-24px)] overflow-auto rounded-2xl bg-noble-green-950/40 p-2 shadow-[0_24px_90px_rgb(0_0_0_/_0.35)] md:max-w-[calc(100vw-48px)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={imageAlt}
            className="max-h-[calc(100dvh-15rem)] max-w-none rounded-xl object-contain transition-transform md:max-h-[calc(100dvh-14rem)]"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "center",
              width: "min(calc(100vw - 24px), 1100px)",
            }}
          />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-[10000] px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 md:px-6 md:pb-6">
        <div className="mx-auto grid max-w-[calc(100vw-24px)] gap-2 rounded-2xl border border-ivory/15 bg-noble-green-950/80 p-2 shadow-[0_-18px_70px_rgb(0_0_0_/_0.24)] backdrop-blur-xl md:flex md:max-w-3xl md:items-center md:justify-between">
          <div
            className="grid grid-cols-2 rounded-xl border border-ivory/20 bg-ivory/10 p-1"
            role="group"
            aria-label="Choose before or after image"
          >
            <ViewerToggle
              active={side === "before"}
              onClick={() => {
                setZoom(1);
                setSide("before");
              }}
            >
              Before
            </ViewerToggle>
            <ViewerToggle
              active={side === "after"}
              onClick={() => {
                setZoom(1);
                setSide("after");
              }}
            >
              After
            </ViewerToggle>
          </div>

          <div className="grid grid-cols-3 gap-2" role="group" aria-label="Zoom controls">
            <ViewerIconButton
              label="Zoom out"
              onClick={() => setZoom((current) => Math.max(1, current - 0.25))}
            >
              <Minus className="size-4" />
            </ViewerIconButton>
            <ViewerIconButton label="Reset zoom" onClick={() => setZoom(1)}>
              <RotateCcw className="size-4" />
            </ViewerIconButton>
            <ViewerIconButton
              label="Zoom in"
              onClick={() => setZoom((current) => Math.min(3, current + 0.25))}
            >
              <Plus className="size-4" />
            </ViewerIconButton>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function ViewerToggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={`min-h-11 min-w-0 rounded-lg px-4 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-300 ${
        active ? "bg-ivory text-noble-green-950" : "text-ivory hover:bg-ivory/10"
      }`}
      aria-pressed={active}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function ViewerIconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-ivory/20 bg-ivory/10 px-3 text-ivory backdrop-blur transition hover:bg-ivory/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-300"
      aria-label={label}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
