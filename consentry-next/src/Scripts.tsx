"use client";

import Script from "next/script";
import React from "react";
import { useConsentManager } from "./ConsentManagerProvider";
import { getAllowedScripts } from "@consentry/core";
import type { ConsentScript, ConsentConfig } from "@consentry/core";
import { extractScriptTagAttrs } from "./utils/extractScriptTagAttrs";

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
      {allowedScripts.map(script => {
        let parsed = null;

        // Try parsing content if it looks like a <script> tag
        if (script.content?.trim().startsWith("<script")) {
          parsed = extractScriptTagAttrs(script.content);

          if (parsed) {
            if (debug) {
              console.warn(
                `[consentry] Script "${script.id}" used <script> in content. Parsed as src-based script for safety.`
              );
            }
          }
        }

        const isInline = !parsed && script.content;

        return (
          <React.Fragment key={script.id}>
            <Script
              id={script.id}
              strategy={script.strategy || "afterInteractive"}
              src={parsed?.src || script.src}
              dangerouslySetInnerHTML={isInline ? { __html: script.content as string } : undefined}
              onError={() => handleScriptError(script.id, parsed?.src || script.src)}
              {...(parsed?.attrs || script.attributes || {})}
            />
            {script.noscript && <noscript dangerouslySetInnerHTML={{ __html: script.noscript }} />}
          </React.Fragment>
        );
      })}
    </>
  );
}
