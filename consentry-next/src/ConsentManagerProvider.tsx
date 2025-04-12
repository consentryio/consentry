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

interface ConsentManagerContextValue {
  cookiePreferences: CookiePreferences;
  setCookiePreferences: (prefs: CookiePreferences, userHasConsented?: boolean) => void;
  hasUserConsented: boolean;
}

const ConsentManagerContext = createContext<ConsentManagerContextValue | undefined>(undefined);

export const ConsentManagerProvider = ({
  config,
  children,
}: {
  config: ConsentConfig;
  children: ReactNode;
}) => {
  const [cookiePreferences, setCookiePreferencesState] = useState<CookiePreferences>({
    ...fallbackDefaults,
    ...config.defaults,
  });

  const [hasUserConsented, setHasUserConsented] = useState(false);

  // Load saved preferences on mount
  useEffect(() => {
    const saved = getConsentPreferences();
    if (saved && typeof saved === "object") {
      const { functional, performance, advertising, social } = saved;
      setCookiePreferencesState({
        functional,
        performance,
        advertising,
        social,
      });
      setHasUserConsented(true); // User has previously consented
    }
  }, []);

  // Only persist when user explicitly consents or updates
  const setCookiePreferences = (prefs: CookiePreferences, userHasConsented = true) => {
    setCookiePreferencesState(prefs);

    if (userHasConsented) {
      setHasUserConsented(true);
      setConsentPreferences(prefs); // Persist to storage

      const { performance, advertising, social } = prefs;

      updateConsentSettings("update", {
        analytics_storage: performance ? "granted" : "denied",
        ad_storage: advertising ? "granted" : "denied",
        ad_user_data: advertising ? "granted" : "denied",
        ad_personalization: social ? "granted" : "denied",
      });
    }
  };

  return (
    <ConsentManagerContext.Provider
      value={{
        cookiePreferences,
        setCookiePreferences,
        hasUserConsented,
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

  const { cookiePreferences, setCookiePreferences, hasUserConsented } = ctx;

  const setCategoryConsent = (category: keyof CookiePreferences, value: boolean) => {
    setCookiePreferences({
      ...cookiePreferences,
      [category]: value,
    });
  };

  const hasConsentedTo = (category: keyof CookiePreferences) =>
    cookiePreferences[category] === true;

  return {
    cookiePreferences,
    setCookiePreferences,
    setCategoryConsent,
    hasConsentedTo,
    hasUserConsented,
  };
};
