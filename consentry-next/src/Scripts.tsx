// @ts-ignore
"use client";

import Script from "next/script";
import React from "react";
import { useConsentManager } from "./ConsentManagerProvider";
import { getAllowedScripts } from "@consentry/core";
import type { ConsentScript, ConsentConfig } from "@consentry/core";

let consentConfig: ConsentConfig;

// ✅ Load config only on server — return fallback on client
if (typeof window === "undefined") {
  try {
    // IMPORTANT: this will be resolved at build-time or SSR only
    consentConfig = require("../../../../consent.config").default;
  } catch (err) {
    throw new Error(
      `[consentry] Failed to load consent.config at the project root.\n${(err as Error).message}`
    );
  }
} else {
  // Client fallback if hydration happens before full mount
  consentConfig = {
    debug: false,
    defaults: {
      functional: true,
      performance: false,
      advertising: false,
      social: false,
    },
    scripts: [],
  };
}

export function Scripts() {
  const { cookiePreferences } = useConsentManager();
  const debug = consentConfig.debug ?? false;

  const allowedScripts: ConsentScript[] = getAllowedScripts(
    consentConfig,
    cookiePreferences,
    debug
  );

  const handleScriptError = (id: string, src?: string) => {
    console.warn(`[consentry] Script "${id}" failed to load.`, { src });
  };

  return (
    <>
      {allowedScripts.map(script => (
        <React.Fragment key={script.id}>
          <Script
            id={script.id}
            strategy={script.strategy || "afterInteractive"}
            src={script.src}
            dangerouslySetInnerHTML={script.content ? { __html: script.content } : undefined}
            onError={() => handleScriptError(script.id, script.src)}
          />
          {script.noscript && <noscript dangerouslySetInnerHTML={{ __html: script.noscript }} />}
        </React.Fragment>
      ))}
    </>
  );
}
