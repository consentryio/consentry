import Cookies from "js-cookie";
import { CookiePreferences } from "./types";

const STORAGE_KEY = "cookiePreferences";

export const getConsentPreferences = (): CookiePreferences | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY) || Cookies.get(STORAGE_KEY) || "";
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to parse consent preferences:", e);
    return null;
  }
};

export const setConsentPreferences = (prefs: CookiePreferences) => {
  if (typeof window === "undefined") return;

  const json = JSON.stringify(prefs);

  try {
    localStorage.setItem(STORAGE_KEY, json);
  } catch (e) {
    console.warn("localStorage set failed, falling back to cookies", e);
    Cookies.set(STORAGE_KEY, json, { expires: 365 });
  }
};
