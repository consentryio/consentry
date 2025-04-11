declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export interface ConsentSettings {
  analytics_storage?: "granted" | "denied";
  ad_storage?: "granted" | "denied";
  ad_user_data?: "granted" | "denied";
  ad_personalization?: "granted" | "denied";
}

export const updateConsentSettings = (type: "default" | "update", settings: ConsentSettings) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("consent", type, settings);
  } else {
    console.warn("Google Analytics is not loaded yet.");
  }
};
