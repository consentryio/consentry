# @consentry/next

> React + Next.js integration for the Consentry consent manager. Provides a plug-and-play Consent Manager Provider and dynamic script loader based on user preferences.

---

## ✨ Overview

`@consentry/next` is the official Next.js wrapper for [`@consentry/core`](https://www.npmjs.com/package/@consentry/core). It offers:

- ✅ A React Context provider for managing cookie consent
- ✅ Automatic script filtering and injection via `<Script />`
- ✅ Google Analytics consent synchronization (`gtag`)
- ✅ Support for external `consent.config` files

---

## 📦 Installation

```bash
npm install @consentry/next @consentry/core
```

---

## ⚙️ Setup

### 1. Create a `consent.config.ts` file in your app root:

```ts
import { defineConsentConfig } from "@consentry/core";

export default defineConsentConfig({
  debug: true,
  defaults: {
    functional: true,
    performance: false,
    advertising: false,
    social: false,
  },
  scripts: [
    {
      id: "ga4",
      category: "performance",
      strategy: "afterInteractive",
      src: "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX",
      vendor: "Google Analytics",
    },
    {
      id: "fb-pixel",
      category: "advertising",
      content: "console.log('Facebook Pixel loaded')",
      vendor: "Facebook",
    }
  ]
});
```

---

### 2. Wrap your app with the `ConsentManagerProvider`

```tsx
// app/layout.tsx or _app.tsx

import { ConsentManagerProvider } from "@consentry/next";

export default function RootLayout({ children }) {
  return <ConsentManagerProvider>{children}</ConsentManagerProvider>;
}
```

---

### 3. Use the hook to manage preferences

```tsx
import { useConsentManager } from "@consentry/next";

const { cookiePreferences, setCategoryConsent } = useConsentManager();

return (
  <button onClick={() => setCategoryConsent("performance", true)}>
    Enable Performance Cookies
  </button>
);
```

---

## 🧠 Features

### ✅ `ConsentManagerProvider`

- Initializes state from `localStorage` or cookies
- Applies default values from `consent.config.ts`
- Syncs changes to `gtag()` for analytics/ads
- Injects scripts using `<Scripts />`

### ✅ `useConsentManager()` hook

Returns:

```ts
{
  cookiePreferences,
  setCookiePreferences,
  setCategoryConsent,
  hasConsentedTo,
  hasConsentedOnce
}
```

### ✅ `<Scripts />` component

Automatically injects only allowed scripts based on config + preferences.

---

## 📄 License

MIT — Copyright © 2025 [Mustafa ONAL](https://github.com/neddl)
