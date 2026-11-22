import { createFileRoute } from "@tanstack/react-router";

/**
 * Serves the illustration for a single piece of content (a yoga pose or a
 * recipe). Images are generated once, cached in storage, and then served from
 * the cache forever. The prompt is resolved server-side from the content
 * library so the image always matches the item it belongs to.
 */
export const Route = createFileRoute("/api/image")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const key = new URL(request.url).searchParams.get("key") ?? "";
        const [kind, ...rest] = key.split(":");
        const id = rest.join(":");
        if (!kind || !id) return new Response("Bad key", { status: 400 });

        const prompt = await resolvePrompt(kind, id);
        if (!prompt) return new Response("Unknown content", { status: 404 });

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const objectPath = `${kind}/${id}.png`;

        const cached = await supabaseAdmin.storage.from("content-images").download(objectPath);
        if (cached.data) return imageResponse(await cached.data.arrayBuffer());

        const bytes = await generateImage(prompt);
        if (!bytes) return new Response("Image unavailable", { status: 502 });

        await supabaseAdmin.storage
          .from("content-images")
          .upload(objectPath, bytes, { contentType: "image/png", upsert: true });
        await supabaseAdmin
          .from("generated_images")
          .upsert({ slug: key, url: objectPath, prompt }, { onConflict: "slug" });

        return imageResponse(bytes);
      },
    },
  },
});

function imageResponse(body: ArrayBuffer | Uint8Array) {
  return new Response(body as BodyInit, {
    headers: {
      "content-type": "image/png",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}

async function resolvePrompt(kind: string, id: string): Promise<string | null> {
  if (kind === "pose") {
    const { ALL_POSES } = await import("@/data/yoga");
    const pose = ALL_POSES.find((p) => p.id === id);
    return pose ? `${pose.imagePrompt}` : null;
  }
  if (kind === "recipe") {
    const { RECIPES } = await import("@/data/nutrition");
    const recipe = RECIPES.find((r) => r.id === id);
    return recipe ? recipe.imagePrompt : null;
  }
  if (kind === "practice") {
    const { WARMUP_STEPS, COOLDOWN_STEPS } = await import("@/data/practice");
    const step = [...WARMUP_STEPS, ...COOLDOWN_STEPS].find((s) => s.id === id);
    return step?.imagePrompt ?? null;
  }
  return null;
}

async function generateImage(prompt: string): Promise<Uint8Array | null> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) return null;
  try {
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Lovable-API-Key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3.1-flash-image",
        messages: [
          {
            role: "user",
            content: `${prompt}. Soft natural light, calm muted blue and cream palette, clean minimal background, photographic, no text, no watermark, no logos.`,
          },
        ],
        modalities: ["image", "text"],
      }),
    });
    if (!res.ok) {
      console.error("image generation failed", res.status, await res.text().catch(() => ""));
      return null;
    }
    const json = (await res.json()) as {
      choices?: { message?: { images?: { image_url?: { url?: string } }[] } }[];
    };
    const url = json.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    const b64 = url?.includes(",") ? url.split(",")[1] : undefined;
    if (!b64) return null;
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return bytes;
  } catch (error) {
    console.error("image generation error", error);
    return null;
  }
}
