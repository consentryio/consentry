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
  setCookiePreferences: (prefs: CookiePreferences) => void;
}

const ConsentManagerContext = createContext<ConsentManagerContextValue | undefined>(undefined);

export const ConsentManagerProvider = ({
  children,
  config,
}: {
  children: ReactNode;
  config: ConsentConfig;
}) => {
  const defaultPreferences: CookiePreferences = {
    ...fallbackDefaults,
    ...config.defaults,
  };

  const [cookiePreferences, setCookiePreferences] = useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
    const saved = getConsentPreferences();
    if (saved) {
      setCookiePreferences({ ...defaultPreferences, ...saved });
    }
  }, []);

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
      <Scripts config={config} />
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
