"use client";

import Script from "next/script";
import React from "react";
import { useConsentManager } from "./ConsentManagerProvider";
import { getAllowedScripts } from "@consentry/core";
import type { ConsentScript, ConsentConfig } from "@consentry/core";

// ✅ Dynamically load config instead of static import
let consentConfig: ConsentConfig;

try {
  consentConfig = require("consent.config").default;
} catch {
  throw new Error(
    `[consentry] Missing "consent.config.ts" at the project root. Please create one to configure scripts.`
  );
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
