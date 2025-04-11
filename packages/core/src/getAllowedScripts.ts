import type { ConsentConfig, ConsentScript, CookiePreferences } from "./types";

/**
 * Filters scripts that should be loaded based on current user preferences.
 *
 * @param config - Consent configuration object
 * @param prefs - Current cookie preferences
 * @param debug - Enable logging
 * @returns Filtered array of allowed scripts
 */
export function getAllowedScripts(
  config: ConsentConfig,
  prefs: CookiePreferences,
  debug: boolean = false
): ConsentScript[] {
  return config.scripts.filter(script => {
    const requiresConsent = script.consentRequired ?? true;
    const userConsented = prefs[script.category];

    const shouldLoad = requiresConsent ? !!userConsented : true;

    if (debug || config.debug) {
      console.debug(
        `[consentry] Script "${script.id}" (${script.vendor || "no vendor"}) - category "${script.category}" → ${
          shouldLoad ? "✅ ALLOWED" : "🚫 BLOCKED"
        }`
      );
    }

    return shouldLoad;
  });
}
