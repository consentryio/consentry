# @consentry/core

> Framework-agnostic consent management engine. Handles preferences, script filtering, and analytics integration — the foundation for all Consentry SDKs.

---

## ✨ What This Does

- 🧠 **Core consent logic** — preference storage, script filtering, category management
- 🔧 **Framework-agnostic** — works with React, Vue, vanilla JS, or any frontend
- 📊 **Analytics integration** — Google Analytics consent mode v2 support
- 💾 **Flexible storage** — localStorage, cookies, or custom storage adapters
- ⚡ **Lightweight** — minimal dependencies, tree-shakeable functions
- 🛡️ **Privacy-first** — GDPR/CCPA compliant by design

---

## 📦 Installation

```bash
npm install @consentry/core
```

---

## 🚀 Quick Start

### Basic Usage

```ts
import {
  getConsentPreferences,
  setConsentPreferences,
  getAllowedScripts,
  updateConsentSettings,
} from "@consentry/core";

// Get current user preferences
const preferences = getConsentPreferences();
console.log(preferences);
// { functional: true, performance: false, advertising: false, social: false }

// Update preferences
setConsentPreferences({
  functional: true,
  performance: true,
  advertising: false,
  social: false,
});

// Filter scripts based on consent
const config = {
  defaults: { functional: true, performance: false, advertising: false, social: false },
  scripts: [
    { id: "analytics", category: "performance", src: "https://analytics.example.com/script.js" },
    { id: "ads", category: "advertising", src: "https://ads.example.com/pixel.js" },
  ],
};

const allowedScripts = getAllowedScripts(config, preferences, true);
// Returns only scripts the user has consented to

// Update Google Analytics consent
updateConsentSettings("update", {
  analytics_storage: "granted",
  ad_storage: "denied",
});
```

---

## 🧠 Core Concepts

### Consent Categories

Consentry organizes cookies and scripts into 4 standard categories:

```ts
type ConsentCategory = "functional" | "performance" | "advertising" | "social";
```

- **`functional`** — Essential for site operation (always true)
- **`performance`** — Analytics, monitoring, A/B testing
- **`advertising`** — Marketing pixels, retargeting, ad networks
- **`social`** — Social media embeds, sharing buttons

### Preference Storage

User preferences are stored as a simple object:

```ts
interface CookiePreferences {
  functional: boolean; // Always true (required)
  performance: boolean; // User's choice
  advertising: boolean; // User's choice
  social: boolean; // User's choice
}
```

### Script Management

Scripts are defined with metadata for filtering:

```ts
interface ConsentScript {
  id: string; // Unique identifier
  category: ConsentCategory; // Which consent category
  consentRequired?: boolean; // Require explicit consent (default: true)
  strategy?: LoadingStrategy; // When to load the script
  src?: string; // External script URL
  content?: string; // Inline script content
  noscript?: string; // Fallback for no-JS
  vendor?: string; // Third-party service name
  default?: boolean; // Load by default regardless of consent
}
```

---

## 📋 Complete API Reference

### Preference Management

#### `getConsentPreferences()`

Gets current user preferences from storage.

```ts
const preferences = getConsentPreferences();
// Returns: CookiePreferences | null
```

#### `setConsentPreferences(preferences)`

Saves user preferences to storage.

```ts
setConsentPreferences({
  functional: true,
  performance: true,
  advertising: false,
  social: false,
});
```

#### `hasConsentedTo(category)`

Check if user has consented to a specific category.

```ts
const hasAnalytics = hasConsentedTo("performance");
// Returns: boolean
```

#### `hasConsentedOnce()`

Check if user has made any consent choice (not first visit).

```ts
const hasChosenBefore = hasConsentedOnce();
// Returns: boolean
```

### Script Filtering

#### `getAllowedScripts(config, preferences, hasConsented)`

Filters scripts based on user consent.

```ts
const allowedScripts = getAllowedScripts(
  config, // ConsentConfig
  preferences, // CookiePreferences
  hasConsented // boolean - has user made a choice?
);
// Returns: ConsentScript[]
```

#### `shouldLoadScript(script, preferences, hasConsented)`

Check if a single script should be loaded.

```ts
const shouldLoad = shouldLoadScript(
  { id: "analytics", category: "performance" },
  preferences,
  hasConsented
);
// Returns: boolean
```

### Google Analytics Integration

#### `updateConsentSettings(command, settings)`

Updates Google Analytics consent mode.

```ts
// Update consent after user makes choice
updateConsentSettings("update", {
  analytics_storage: "granted",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
});

// Set default (denied) state
updateConsentSettings("default", {
  analytics_storage: "denied",
  ad_storage: "denied",
});
```

### Storage Management

#### `clearConsentData()`

Removes all stored consent data.

```ts
clearConsentData();
```

#### `migrateConsentData()`

Migrates data from old storage format (if needed).

```ts
migrateConsentData();
```

---

## 🔧 Configuration Examples

### Basic Config

```ts
const config = {
  debug: process.env.NODE_ENV === "development",
  defaults: {
    functional: true,
    performance: false,
    advertising: false,
    social: false,
  },
  scripts: [
    {
      id: "essential-analytics",
      category: "functional",
      consentRequired: false, // Always load
      content: "console.log('Essential tracking loaded');",
    },
  ],
};
```

### Google Analytics 4

```ts
const gaScripts = [
  {
    id: "gtag-js",
    category: "performance",
    consentRequired: true,
    strategy: "afterInteractive",
    src: "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX",
    vendor: "Google Analytics",
  },
  {
    id: "gtag-init",
    category: "performance",
    consentRequired: true,
    strategy: "afterInteractive",
    content: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-XXXXXXXXXX');
      // Required for Google Analytics v2 consent mode - must start with 'denied'
      gtag('consent', 'default', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      });
    `,
    vendor: "Google Analytics",
  },
];
```

### Facebook Pixel

```ts
const facebookScript = {
  id: "facebook-pixel",
  category: "advertising",
  consentRequired: true,
  content: `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', 'YOUR_PIXEL_ID');
    fbq('track', 'PageView');
  `,
  vendor: "Meta",
};
```

### Hotjar

```ts
const hotjarScript = {
  id: "hotjar",
  category: "performance",
  consentRequired: true,
  content: `
    (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:YOUR_HOTJAR_ID,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
  `,
  vendor: "Hotjar",
};
```

---

## 💡 Usage Patterns

### Vanilla JavaScript

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Consent Example</title>
  </head>
  <body>
    <button id="accept-analytics">Accept Analytics</button>
    <button id="reject-all">Reject All</button>

    <script type="module">
      import {
        getConsentPreferences,
        setConsentPreferences,
        getAllowedScripts,
        updateConsentSettings,
      } from "@consentry/core";

      const config = {
        defaults: { functional: true, performance: false, advertising: false, social: false },
        scripts: [
          {
            id: "analytics",
            category: "performance",
            content: "console.log('Analytics loaded!');",
          },
        ],
      };

      // Load allowed scripts
      function loadScripts() {
        const preferences = getConsentPreferences();
        const allowedScripts = getAllowedScripts(config, preferences, true);

        allowedScripts.forEach(script => {
          if (script.content) {
            eval(script.content); // In production, use proper script injection
          }
        });
      }

      // Handle user choices
      document.getElementById("accept-analytics").onclick = () => {
        setConsentPreferences({
          functional: true,
          performance: true,
          advertising: false,
          social: false,
        });

        updateConsentSettings("update", {
          analytics_storage: "granted",
        });

        loadScripts();
      };

      document.getElementById("reject-all").onclick = () => {
        setConsentPreferences({
          functional: true,
          performance: false,
          advertising: false,
          social: false,
        });

        updateConsentSettings("update", {
          analytics_storage: "denied",
          ad_storage: "denied",
        });
      };

      // Initial load
      loadScripts();
    </script>
  </body>
</html>
```

### React Hook

```tsx
import { useState, useEffect } from "react";
import {
  getConsentPreferences,
  setConsentPreferences,
  updateConsentSettings,
  type CookiePreferences,
} from "@consentry/core";

export function useConsent() {
  const [preferences, setPrefs] = useState<CookiePreferences | null>(null);

  useEffect(() => {
    setPrefs(getConsentPreferences());
  }, []);

  const updatePreferences = (newPrefs: CookiePreferences) => {
    setConsentPreferences(newPrefs);
    setPrefs(newPrefs);

    // Update Google Analytics
    updateConsentSettings("update", {
      analytics_storage: newPrefs.performance ? "granted" : "denied",
      ad_storage: newPrefs.advertising ? "granted" : "denied",
    });
  };

  const acceptAll = () => {
    updatePreferences({
      functional: true,
      performance: true,
      advertising: true,
      social: true,
    });
  };

  const rejectAll = () => {
    updatePreferences({
      functional: true,
      performance: false,
      advertising: false,
      social: false,
    });
  };

  return {
    preferences,
    updatePreferences,
    acceptAll,
    rejectAll,
  };
}
```

### Vue Composable

```ts
import { ref, onMounted } from "vue";
import {
  getConsentPreferences,
  setConsentPreferences,
  updateConsentSettings,
  type CookiePreferences,
} from "@consentry/core";

export function useConsent() {
  const preferences = ref<CookiePreferences | null>(null);

  onMounted(() => {
    preferences.value = getConsentPreferences();
  });

  const updatePreferences = (newPrefs: CookiePreferences) => {
    setConsentPreferences(newPrefs);
    preferences.value = newPrefs;

    updateConsentSettings("update", {
      analytics_storage: newPrefs.performance ? "granted" : "denied",
      ad_storage: newPrefs.advertising ? "granted" : "denied",
    });
  };

  return {
    preferences: readonly(preferences),
    updatePreferences,
  };
}
```

---

## 🛠️ Advanced Features

### Custom Storage Adapter

```ts
import { setStorageAdapter } from "@consentry/core";

// Custom storage implementation
const customStorage = {
  getItem: (key: string) => {
    // Your storage logic (e.g., database, API)
    return myDatabase.get(key);
  },
  setItem: (key: string, value: string) => {
    myDatabase.set(key, value);
  },
  removeItem: (key: string) => {
    myDatabase.delete(key);
  },
};

setStorageAdapter(customStorage);
```

### Debug Mode

```ts
import { setDebugMode } from "@consentry/core";

// Enable detailed logging
setDebugMode(process.env.NODE_ENV === "development");
```

### Consent Events

```ts
import { onConsentChange } from "@consentry/core";

// Listen for consent changes
onConsentChange(preferences => {
  console.log("Consent updated:", preferences);

  // Update third-party tools
  if (preferences.performance) {
    loadAnalytics();
  }

  if (preferences.advertising) {
    loadAdvertising();
  }
});
```

---

## 🧪 Testing

### Mock Functions

```ts
import { vi } from "vitest";
import * as consentry from "@consentry/core";

// Mock storage for tests
vi.spyOn(consentry, "getConsentPreferences").mockReturnValue({
  functional: true,
  performance: true,
  advertising: false,
  social: false,
});

// Test your consent logic
test("should load analytics when performance is enabled", () => {
  const preferences = consentry.getConsentPreferences();
  expect(preferences?.performance).toBe(true);
});
```

### Test Utilities

```ts
import { resetConsentState, setTestPreferences } from "@consentry/core/testing";

beforeEach(() => {
  resetConsentState();
});

test("analytics consent flow", () => {
  setTestPreferences({ performance: true });

  const shouldLoad = shouldLoadScript(
    { id: "ga", category: "performance" },
    getConsentPreferences(),
    true
  );

  expect(shouldLoad).toBe(true);
});
```

---

## 🌍 Browser Support

- **Modern browsers** — Chrome 91+, Firefox 88+, Safari 14+, Edge 91+
- **Legacy support** — IE11+ (with polyfills)
- **Mobile** — iOS Safari 14+, Chrome Mobile 91+

### Polyfills Needed for IE11

```bash
npm install core-js
```

```ts
import "core-js/stable";
import "core-js/features/object/assign";
import "@consentry/core";
```

---

## 🔒 Privacy & Compliance

### GDPR Compliance

- **Consent-first approach** — Nothing loads without explicit consent
- **Granular controls** — Users can choose specific categories
- **Right to withdraw** — Easy preference updates
- **Data minimization** — Only essential data collection

### CCPA Compliance

- **Opt-out mechanism** — "Do Not Sell" functionality
- **Clear disclosures** — Transparent data usage
- **User control** — Preference management interface

### Google Consent Mode v2

```ts
// Required initialization for Google services
updateConsentSettings("default", {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  functionality_storage: "denied",
  personalization_storage: "denied",
  security_storage: "granted", // Usually always granted
});
```

---

## 🔗 Ecosystem

### Framework Integrations

- [`@consentry/next`](https://www.npmjs.com/package/@consentry/next) — Next.js integration with hooks and providers
- [`@consentry/ui`](https://www.npmjs.com/package/@consentry/ui) — React components for banners and modals
- `@consentry/vue` — Vue.js integration (coming soon)
- `@consentry/svelte` — Svelte integration (coming soon)

### Third-Party Tools

- **Google Analytics** — Full consent mode v2 support
- **Google Tag Manager** — Automatic consent variable updates
- **Facebook Pixel** — Consent-aware event tracking
- **Hotjar** — Privacy-compliant session recording
- **Intercom** — GDPR-compliant chat widgets

---

## 📄 License

MIT — Copyright © 2025 [Mustafa ONAL](https://github.com/neddl)
