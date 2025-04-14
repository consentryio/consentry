"use client";

import { type ReactNode, useEffect, useState, createContext, useContext } from "react";

import {
  fallbackDefaults,
  getConsentPreferences,
  setConsentPreferences,
  updateConsentSettings,
  type CookiePreferences,
  type ConsentConfig,
} from "@consentry/core";

import { Scripts } from "./Scripts";

interface ConsentManagerContextValue {
  cookiePreferences: CookiePreferences;
  setCookiePreferences: (prefs: CookiePreferences) => void;
  showConsentBanner: boolean;
  isConsentKnown: boolean;
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

  const [showConsentBanner, setShowConsentBanner] = useState(false);
  const [isConsentKnown, setIsConsentKnown] = useState(false); // 👈 key for clean loading

  // On mount: load saved preferences if they exist
  useEffect(() => {
    const saved = getConsentPreferences();

    if (saved) {
      setCookiePreferencesState(saved);
      setShowConsentBanner(false);
    } else {
      setShowConsentBanner(true);
    }

    setIsConsentKnown(true); // 👈 mark loading complete
  }, []);

  // When user accepts or updates preferences
  const setCookiePreferences = (prefs: CookiePreferences) => {
    setCookiePreferencesState(prefs);
    setConsentPreferences(prefs);
    setShowConsentBanner(false);

    // Optional: sync with Google Consent Mode
    const { performance, advertising, social } = prefs;
    updateConsentSettings("update", {
      analytics_storage: performance ? "granted" : "denied",
      ad_storage: advertising ? "granted" : "denied",
      ad_user_data: advertising ? "granted" : "denied",
      ad_personalization: social ? "granted" : "denied",
    });
  };

  return (
    <ConsentManagerContext.Provider
      value={{
        cookiePreferences,
        setCookiePreferences,
        showConsentBanner,
        isConsentKnown,
      }}
    >
      <Scripts config={config} />
      {children}
    </ConsentManagerContext.Provider>
  );
};

// Hook
export const useConsentManager = () => {
  const ctx = useContext(ConsentManagerContext);
  if (!ctx) {
    throw new Error("useConsentManager must be used within a ConsentManagerProvider");
  }

  const { cookiePreferences, setCookiePreferences, showConsentBanner, isConsentKnown } = ctx;

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
    showConsentBanner,
    isConsentKnown,
  };
};
