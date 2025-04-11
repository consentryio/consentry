export type ConsentCategory = "functional" | "performance" | "advertising" | "social";

export type ConsentScript = {
  /**
   * Unique ID for your script tag (used for hydration and deduplication)
   */
  id: string;

  /**
   * Cookie category this script belongs to.
   * Used to determine whether to load based on user's consent.
   */
  category: ConsentCategory;

  /**
   * Should this script wait for explicit user consent?
   * If false, the script will load regardless of consent.
   */
  consentRequired?: boolean;

  /**
   * next/script strategy, defaults to "afterInteractive"
   */
  strategy?: "afterInteractive" | "lazyOnload" | "beforeInteractive";

  /**
   * Script source URL (external script)
   */
  src?: string;

  /**
   * Inline script content (if no external src)
   */
  content?: string;

  /**
   * Optional <noscript> fallback HTML
   */
  noscript?: string;

  /**
   * Toggles the default value (before the user accepts/declines explicitly).
   */
  default?: boolean;

  /**
   * Optional display name for logs, devtools, or UI
   */
  vendor?: string;
};

export type ConsentConfig = {
  debug?: boolean;
  defaults: Record<ConsentCategory, boolean>;
  scripts: ConsentScript[];
};
