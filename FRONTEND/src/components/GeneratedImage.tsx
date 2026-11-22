import { useState } from "react";

/**
 * Renders the illustration that belongs to one specific pose or recipe.
 * If the picture cannot be produced, an explicit "Image unavailable" panel is
 * shown instead of a mismatched stock photo.
 */
export default function GeneratedImage({
  contentKey,
  alt,
  className = "",
  rounded = "rounded-2xl",
  fit = "cover",
}: {
  contentKey: string;
  alt: string;
  className?: string;
  rounded?: string;
  fit?: "cover" | "contain";
}) {
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [kind, ...idParts] = contentKey.split(":");
  const id = idParts.join(":");
  const staticSource =
    kind === "pose"
      ? `/images/fitness/yoga/${id}.webp`
      : kind === "practice"
        ? `/images/fitness/practice/${id}.webp`
        : kind === "exercise"
          ? `/images/fitness/exercises/${id}.webp`
          : null;

  if (status === "error") {
    return (
      <div
        className={`${rounded} ${className} flex flex-col items-center justify-center bg-muted text-muted-foreground text-center px-3`}
      >
        <span className="text-lg">🖼️</span>
        <span className="text-[11px] font-medium mt-1">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className={`${rounded} ${className} relative overflow-hidden bg-muted`}>
      {status === "loading" && (
        <div className="absolute inset-0 animate-pulse bg-secondary/60" aria-hidden="true" />
      )}
      <img
        src={staticSource ?? `/api/image?key=${encodeURIComponent(contentKey)}`}
        alt={alt}
        loading="lazy"
        onLoad={() => setStatus("ok")}
        onError={() => setStatus("error")}
        className={`h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"} object-center transition-opacity duration-500 ${
          status === "ok" ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
