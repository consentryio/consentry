# @consentry/core

> Core consent management logic for Consentry SDK — handles preferences, script filtering, and integration with tools like Google Analytics.

---

## ✨ Overview

`@consentry/core` provides all the underlying logic required for consent management in your web applications. It helps filter scripts based on user preferences, manage consent storage via `localStorage` or cookies, and update analytics frameworks like Google Analytics.

This package is **framework-agnostic** and intended to be used alongside frontend-specific wrappers like [`@consentry/next`](https://www.npmjs.com/package/@consentry/next).

---

## 📦 Installation

```bash
npm install @consentry/core
```

---

## 🔧 Usage

### 1. Define fallback preferences

```ts
import { fallbackDefaults } from "@consentry/core";

console.log(fallbackDefaults);
// { functional: true, performance: false, advertising: false, social: false }
```

### 2. Filter allowed scripts

```ts
import { getAllowedScripts } from "@consentry/core";

const scripts = getAllowedScripts(config, userPrefs, true);
// → returns only scripts the user has consented to
```

### 3. Store & retrieve preferences

```ts
import { getConsentPreferences, setConsentPreferences } from "@consentry/core";

const currentPrefs = getConsentPreferences();
setConsentPreferences({ functional: true, performance: true, advertising: false, social: false });
```

### 4. Send consent updates to Google Analytics

```ts
import { updateConsentSettings } from "@consentry/core";

updateConsentSettings("update", {
  analytics_storage: "granted",
  ad_storage: "denied",
});
```

---

## 🧠 Types

### `ConsentCategory`

```ts
"functional" | "performance" | "advertising" | "social"
```

---

### `CookiePreferences`

```ts
type CookiePreferences = Record<ConsentCategory, boolean>;
```

---

### `ConsentScript`

```ts
{
  id: string;
  category: ConsentCategory;
  consentRequired?: boolean;
  strategy?: "afterInteractive" | "lazyOnload" | "beforeInteractive";
  src?: string;
  content?: string;
  noscript?: string;
  vendor?: string;
  default?: boolean;
}
```

---

### `ConsentConfig`

```ts
{
  debug?: boolean;
  defaults: CookiePreferences;
  scripts: ConsentScript[];
}
```

---

### `ConsentSettings` (Google Analytics V4)

```ts
{
  analytics_storage?: "granted" | "denied";
  ad_storage?: "granted" | "denied";
  ad_user_data?: "granted" | "denied";
  ad_personalization?: "granted" | "denied";
}
```

---

## 🚀 Coming soon

- ⚙️ Config validation with `defineConsentConfig()`
- 📚 Config file loader (`consent.config.ts`)
- 🔌 Integration hooks for third-party tools (FB Pixel, Hotjar, etc.)

---

## 📄 License

MIT — Copyright © 2025 [Mustafa Onal](https://github.com/mustafa-onal)
