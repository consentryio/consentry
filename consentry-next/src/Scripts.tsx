// @ts-ignore
"use client";

import Script from "next/script";
import React from "react";
import { useConsentManager } from "./ConsentManagerProvider";
import { getAllowedScripts } from "@consentry/core";
import type { ConsentScript, ConsentConfig } from "@consentry/core";

import path from "path";
import { existsSync } from "fs";

// 🔧 Dynamically load config from root path
let consentConfig: ConsentConfig;

try {
  const cwd = process.cwd();
  const tsPath = path.join(cwd, "consent.config.ts");
  const jsPath = path.join(cwd, "consent.config.js");

  if (existsSync(jsPath)) {
    consentConfig = require(jsPath).default;
  } else if (existsSync(tsPath)) {
    consentConfig = require(tsPath).default;
  } else {
    throw new Error("No consent.config.ts or consent.config.js found at root.");
  }
} catch (err) {
  throw new Error(
    `[consentry] Failed to load consent.config at the project root.\n${(err as Error).message}`
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
