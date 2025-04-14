"use client";

import Script from "next/script";
import React from "react";
import { useConsentManager } from "./ConsentManagerProvider";
import { getAllowedScripts } from "@consentry/core";
import type { ConsentScript, ConsentConfig } from "@consentry/core";

export function Scripts({ config }: { config: ConsentConfig }) {
  const { cookiePreferences, isConsentKnown } = useConsentManager();
  const debug = config.debug ?? false;

  if (!isConsentKnown) return null; // 👈 Prevent premature script evaluation

  const allowedScripts: ConsentScript[] = getAllowedScripts(config, cookiePreferences, debug);

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
