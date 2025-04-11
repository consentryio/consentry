// types.ts

/**
 * All consent categories supported by the SDK.
 * Can be extended later if you support TCF or custom categories.
 */
export type ConsentCategory = "functional" | "performance" | "advertising" | "social";

/**
 * User preferences mapped to each cookie category.
 */
export type CookiePreferences = Record<ConsentCategory, boolean>;

/**
 * Individual script definition for injection and control.
 */
export type ConsentScript = {
  /**
   * Unique ID for your script tag (used for hydration and deduplication).
   */
  id: string;

  /**
   * Cookie category this script belongs to.
   * Determines whether the script loads based on consent.
   */
  category: ConsentCategory;

  /**
   * If true (or undefined), the script will wait for consent.
   * If false, it will load regardless of user's consent.
   */
  consentRequired?: boolean;

  /**
   * Script loading strategy (from next/script).
   * Defaults to "afterInteractive".
   */
  strategy?: "afterInteractive" | "lazyOnload" | "beforeInteractive";

  /**
   * External script URL. Mutually exclusive with `content`.
   */
  src?: string;

  /**
   * Inline JavaScript content (if not using `src`).
   */
  content?: string;

  /**
   * Optional <noscript> fallback HTML for non-JS environments.
   */
  noscript?: string;

  /**
   * Optional display label for developer tools or UI.
   */
  vendor?: string;

  /**
   * Sets whether this script's category should be accepted by default,
   * before the user has made a choice. Overridden by stored preferences.
   */
  default?: boolean;
};

/**
 * Overall configuration passed to the Consent Manager.
 */
export type ConsentConfig = {
  /**
   * If true, enables detailed console logs.
   */
  debug?: boolean;

  /**
   * Fallback default values per category, used before user gives explicit consent.
   */
  defaults: CookiePreferences;

  /**
   * All scripts managed by the SDK.
   */
  scripts: ConsentScript[];
};
