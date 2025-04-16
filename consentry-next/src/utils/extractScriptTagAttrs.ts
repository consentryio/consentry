export function extractScriptTagAttrs(
  html: string
): { src?: string; attrs?: Record<string, string> } | null {
  if (typeof window === "undefined") return null; // SSR safety

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const scriptEl = doc.querySelector("script");

    if (!scriptEl) return null;

    const src = scriptEl.getAttribute("src") || undefined;

    const attrs: Record<string, string> = {};
    for (const attr of Array.from(scriptEl.attributes)) {
      attrs[attr.name] = attr.value;
    }

    return { src, attrs };
  } catch (e) {
    console.warn("[consentry] Failed to parse script content:", e);
    return null;
  }
}
