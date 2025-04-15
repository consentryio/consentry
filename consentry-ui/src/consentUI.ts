// consentUI.ts
let opener: (() => void) | null = null;

export function setConsentOpener(fn: () => void) {
  opener = fn;
}

export function openConsentSettings() {
  if (opener) {
    opener();
  } else {
    console.warn("[consentry] ConsentManager is not mounted yet.");
  }
}
