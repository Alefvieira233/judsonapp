"use client";

// Smart inline embed for exercise + community videos. Detects YouTube,
// Instagram, Vimeo and falls back to a native <video> for direct files.
// CSP allows these origins via src/proxy.ts frame-src whitelist.

import { useState } from "react";
import { PlayIcon } from "lucide-react";

type EmbedKind = "youtube" | "instagram" | "vimeo" | "video" | "link";

function detectKind(url: string): EmbedKind {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtu.be") return "youtube";
    if (host === "instagram.com") return "instagram";
    if (host === "vimeo.com" || host === "player.vimeo.com") return "vimeo";
    if (/\.(mp4|webm|mov)(\?|$)/i.test(u.pathname)) return "video";
    return "link";
  } catch {
    return "link";
  }
}

function youtubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    let id: string | null = null;
    if (u.hostname === "youtu.be") id = u.pathname.slice(1);
    else if (u.pathname === "/watch") id = u.searchParams.get("v");
    else if (u.pathname.startsWith("/shorts/")) id = u.pathname.split("/")[2] ?? null;
    else if (u.pathname.startsWith("/embed/")) id = u.pathname.split("/")[2] ?? null;
    if (!id) return null;
    return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`;
  } catch {
    return null;
  }
}

function instagramEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname !== "www.instagram.com" && u.hostname !== "instagram.com") return null;
    // Strip trailing slash and append /embed.
    const clean = u.pathname.replace(/\/$/, "");
    return `https://www.instagram.com${clean}/embed`;
  } catch {
    return null;
  }
}

function vimeoEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const id = u.pathname.split("/").filter(Boolean).pop();
    if (!id || !/^\d+$/.test(id)) return null;
    return `https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0`;
  } catch {
    return null;
  }
}

export function VideoEmbed({
  url,
  poster,
  className,
}: {
  url: string;
  poster?: string | null;
  className?: string;
}) {
  const [active, setActive] = useState(false);
  const kind = detectKind(url);

  if (kind === "video") {
    return (
      <video
        className={className ?? "h-full w-full rounded-xl border border-border bg-black"}
        controls
        playsInline
        preload="metadata"
        poster={poster ?? undefined}
        src={url}
      />
    );
  }

  if (kind === "link") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer noopener"
        className={`inline-flex items-center gap-2 text-xs text-foreground underline-offset-2 hover:underline ${className ?? ""}`}
      >
        Abrir vídeo
      </a>
    );
  }

  // Lazy-load the iframe behind a click. Saves a third-party round-trip on
  // long lists (workout runner has many items, only 1-2 watched per session).
  const embedUrl =
    kind === "youtube"
      ? youtubeEmbedUrl(url)
      : kind === "instagram"
      ? instagramEmbedUrl(url)
      : kind === "vimeo"
      ? vimeoEmbedUrl(url)
      : null;

  if (!embedUrl) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer noopener"
        className={`inline-flex items-center gap-2 text-xs text-foreground underline-offset-2 hover:underline ${className ?? ""}`}
      >
        Abrir vídeo
      </a>
    );
  }

  if (!active) {
    return (
      <button
        type="button"
        onClick={() => setActive(true)}
        className={`group relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-black/60 ${className ?? "aspect-video"}`}
        aria-label="Reproduzir vídeo"
      >
        {poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={poster}
            alt=""
            className="absolute inset-0 size-full object-cover opacity-70 transition-opacity group-hover:opacity-90"
            loading="lazy"
          />
        ) : null}
        <span className="relative grid size-12 place-items-center rounded-full bg-[var(--brand-primary)] text-white shadow-lg transition-transform group-hover:scale-110">
          <PlayIcon className="size-5" />
        </span>
        <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] uppercase tracking-widest text-white">
          {kind}
        </span>
      </button>
    );
  }

  return (
    <iframe
      src={embedUrl}
      className={className ?? "aspect-video w-full rounded-xl border border-border bg-black"}
      allow="autoplay; encrypted-media; picture-in-picture"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
      title="Vídeo do exercício"
    />
  );
}
