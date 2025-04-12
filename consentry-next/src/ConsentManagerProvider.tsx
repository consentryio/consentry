// @ts-ignore
"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Scripts } from "./Scripts";

import {
  CookiePreferences,
  fallbackDefaults,
  getConsentPreferences,
  setConsentPreferences,
  updateConsentSettings,
  ConsentConfig,
} from "@consentry/core";

import path from "path";
import { existsSync } from "fs";

let consentConfig: ConsentConfig;

// Dynamically load /consent.config.(js|ts) at runtime
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

const defaultPreferences: CookiePreferences = {
  ...fallbackDefaults,
  ...consentConfig.defaults,
};

interface ConsentManagerContextValue {
  cookiePreferences: CookiePreferences;
  setCookiePreferences: (prefs: CookiePreferences) => void;
}

const ConsentManagerContext = createContext<ConsentManagerContextValue | undefined>(undefined);

export const ConsentManagerProvider = ({ children }: { children: ReactNode }) => {
  const [cookiePreferences, setCookiePreferences] = useState<CookiePreferences>(defaultPreferences);

  // Load initial state from storage on mount
  useEffect(() => {
    const saved = getConsentPreferences();
    if (saved) {
      setCookiePreferences({
        ...defaultPreferences,
        ...saved,
      });
    }
  }, []);

  // Persist preferences + update gtag consent when changed
  useEffect(() => {
    setConsentPreferences(cookiePreferences);

    const { performance, advertising, social } = cookiePreferences;

    updateConsentSettings("update", {
      analytics_storage: performance ? "granted" : "denied",
      ad_storage: advertising ? "granted" : "denied",
      ad_user_data: advertising ? "granted" : "denied",
      ad_personalization: social ? "granted" : "denied",
    });
  }, [cookiePreferences]);

  return (
    <ConsentManagerContext.Provider
      value={{
        cookiePreferences,
        setCookiePreferences,
      }}
    >
      <Scripts />
      {children}
    </ConsentManagerContext.Provider>
  );
};

export const useConsentManager = () => {
  const ctx = useContext(ConsentManagerContext);
  if (!ctx) {
    throw new Error("useConsentManager must be used within a ConsentManagerProvider");
  }

  const { cookiePreferences, setCookiePreferences } = ctx;

  const setCategoryConsent = (category: keyof CookiePreferences, value: boolean) => {
    setCookiePreferences({
      ...cookiePreferences,
      [category]: value,
    });
  };

  const hasConsentedTo = (category: keyof CookiePreferences) =>
    cookiePreferences[category] === true;

  const hasConsentedOnce = Object.values(cookiePreferences).some(Boolean);

  return {
    cookiePreferences,
    setCookiePreferences,
    setCategoryConsent,
    hasConsentedTo,
    hasConsentedOnce,
  };
};
