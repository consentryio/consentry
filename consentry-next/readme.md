# @consentry/next

> Next.js integration for Consentry consent management. React hooks, providers, and automatic script injection — works seamlessly with [@consentry/ui](https://www.npmjs.com/package/@consentry/ui) for a complete solution.

---

## ✨ What You Get

- ⚛️ **React Context Provider** — manages consent state across your app
- 🪝 **Custom hooks** — `useConsentManager()` for easy state access
- 📜 **Automatic script injection** — loads scripts based on user consent
- 🔄 **Google Analytics integration** — automatic consent mode v2 updates
- 🎨 **UI component ready** — pairs perfectly with `@consentry/ui`
- 🚀 **Next.js optimized** — works with App Router and Pages Router

---

## 📦 Installation

### Complete Solution (Recommended)

```bash
npm install @consentry/next @consentry/ui @consentry/core
```

### Core Integration Only

```bash
npm install @consentry/next @consentry/core
```

---

## 🚀 Quick Start (Complete Solution)

**👑 This is the recommended approach** — using `@consentry/next` with `@consentry/ui` gives you a complete, plug-and-play consent management solution.

### Step 1: Create Consent Provider

Create `providers/consent-provider.tsx`:

```tsx
"use client";
import { ConsentConfig, ConsentManagerProvider } from "@consentry/next";
import ConsentManager from "@consentry/ui";

const ConsentProvider = ({ children }: { children: React.ReactNode }) => {
  const consentConfig: ConsentConfig = {
    debug: process.env.NODE_ENV === "development",
    defaults: {
      functional: true,
      performance: false,
      advertising: false,
      social: false,
    },
    scripts: [
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
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied'
          });
        `,
        vendor: "Google Analytics",
      },
    ],
  };

  return (
    <ConsentManagerProvider config={consentConfig}>
      <ConsentManager mode="modal" dark={false} />
      {children}
    </ConsentManagerProvider>
  );
};

export default ConsentProvider;
```

### Step 2: Add to Your App

**App Router (`app/layout.tsx`):**

```tsx
import ConsentProvider from "@/providers/consent-provider";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ConsentProvider>{children}</ConsentProvider>
      </body>
    </html>
  );
}
```

**Pages Router (`pages/_app.tsx`):**

```tsx
import ConsentProvider from "@/providers/consent-provider";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ConsentProvider>
      <Component {...pageProps} />
    </ConsentProvider>
  );
}
```

### Step 3: Use Anywhere in Your App

```tsx
"use client";
import { useConsentManager } from "@consentry/next";

export default function PrivacySettings() {
  const { preferences, updatePreferences, hasConsentedOnce } = useConsentManager();

  if (!hasConsentedOnce) {
    return <p>Please accept or decline cookies first.</p>;
  }

  return (
    <div>
      <h2>Your Privacy Settings</h2>
      <label>
        <input
          type="checkbox"
          checked={preferences.performance}
          onChange={e => updatePreferences({ ...preferences, performance: e.target.checked })}
        />
        Analytics & Performance
      </label>
      <label>
        <input
          type="checkbox"
          checked={preferences.advertising}
          onChange={e => updatePreferences({ ...preferences, advertising: e.target.checked })}
        />
        Advertising & Marketing
      </label>
    </div>
  );
}
```

**That's it!** You now have a complete consent management system with banner, modal, and programmatic control.

---

## 🎛️ Core Components

### ConsentManagerProvider

The main provider that manages all consent state and script injection.

```tsx
interface ConsentManagerProviderProps {
  config: ConsentConfig; // Your consent configuration
  children: React.ReactNode; // Your app content
  storageKey?: string; // Custom localStorage key (default: 'consentry-preferences')
  debug?: boolean; // Enable debug logging
}
```

### useConsentManager Hook

Access consent state and controls from any component.

```tsx
const {
  preferences, // Current user preferences
  updatePreferences, // Update all preferences
  setCategoryConsent, // Update single category
  hasConsentedTo, // Check specific category
  hasConsentedOnce, // Has user made any choice?
  acceptAll, // Accept all categories
  rejectAll, // Reject all (except functional)
  resetConsent, // Clear all consent data
} = useConsentManager();
```

---

## 📋 Complete API Reference

### ConsentConfig

```tsx
interface ConsentConfig {
  debug?: boolean; // Enable debug logging
  defaults: CookiePreferences; // Default consent state
  scripts: ConsentScript[]; // Scripts to manage
  storageKey?: string; // Custom storage key
  googleAnalyticsId?: string; // GA4 tracking ID for auto-setup
}
```

### CookiePreferences

```tsx
interface CookiePreferences {
  functional: boolean; // Always true (required for site function)
  performance: boolean; // Analytics, monitoring, A/B testing
  advertising: boolean; // Marketing pixels, retargeting
  social: boolean; // Social media embeds, sharing
}
```

### ConsentScript

```tsx
interface ConsentScript {
  id: string; // Unique identifier
  category: ConsentCategory; // Which consent category
  consentRequired?: boolean; // Require explicit consent
  strategy?: "afterInteractive" | "lazyOnload" | "beforeInteractive";
  src?: string; // External script URL
  content?: string; // Inline script content
  noscript?: string; // Fallback for no-JS
  vendor?: string; // Third-party service name
  default?: boolean; // Load by default
}
```

### Hook Return Type

```tsx
interface ConsentManagerHook {
  preferences: CookiePreferences;
  updatePreferences: (preferences: CookiePreferences) => void;
  setCategoryConsent: (category: ConsentCategory, granted: boolean) => void;
  hasConsentedTo: (category: ConsentCategory) => boolean;
  hasConsentedOnce: () => boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  resetConsent: () => void;
}
```

---

## 🔧 Configuration Examples

### Google Analytics 4

```tsx
const gaConfig: ConsentScript[] = [
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
      gtag('config', 'G-XXXXXXXXXX', {
        send_page_view: true,
        cookie_flags: 'SameSite=None;Secure'
      });
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

```tsx
const facebookPixel: ConsentScript = {
  id: "facebook-pixel",
  category: "advertising",
  consentRequired: true,
  strategy: "afterInteractive",
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
  noscript: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID&ev=PageView&noscript=1" />`,
  vendor: "Meta",
};
```

### Multiple Analytics Tools

```tsx
const consentConfig: ConsentConfig = {
  debug: process.env.NODE_ENV === "development",
  defaults: {
    functional: true,
    performance: false,
    advertising: false,
    social: false,
  },
  scripts: [
    // Google Analytics
    ...gaConfig,

    // Hotjar
    {
      id: "hotjar",
      category: "performance",
      consentRequired: true,
      strategy: "afterInteractive",
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
    },

    // Facebook Pixel
    facebookPixel,

    // Twitter Pixel
    {
      id: "twitter-pixel",
      category: "advertising",
      consentRequired: true,
      strategy: "afterInteractive",
      content: `
        !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
        },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
        a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
        twq('init','YOUR_TWITTER_PIXEL_ID');
        twq('track','PageView');
      `,
      vendor: "Twitter",
    },
  ],
};
```

---

## 💡 Usage Patterns

### Programmatic Control

```tsx
"use client";
import { useConsentManager } from "@consentry/next";
import { openConsentSettings } from "@consentry/ui";

export default function Footer() {
  const { hasConsentedOnce, acceptAll, rejectAll } = useConsentManager();

  return (
    <footer>
      <div>
        <button onClick={() => openConsentSettings()}>Cookie Settings</button>

        {!hasConsentedOnce && (
          <div>
            <button onClick={acceptAll}>Accept All Cookies</button>
            <button onClick={rejectAll}>Reject All</button>
          </div>
        )}
      </div>
    </footer>
  );
}
```

### Conditional Rendering

```tsx
"use client";
import { useConsentManager } from "@consentry/next";

export default function AnalyticsDashboard() {
  const { hasConsentedTo } = useConsentManager();

  if (!hasConsentedTo("performance")) {
    return (
      <div>
        <p>Analytics data requires performance cookies.</p>
        <button onClick={() => openConsentSettings()}>Enable Analytics</button>
      </div>
    );
  }

  return <div>{/* Your analytics dashboard */}</div>;
}
```

### Social Media Embeds

```tsx
"use client";
import { useConsentManager } from "@consentry/next";

export default function YouTubeEmbed({ videoId }: { videoId: string }) {
  const { hasConsentedTo, setCategoryConsent } = useConsentManager();

  if (!hasConsentedTo("social")) {
    return (
      <div className="consent-placeholder">
        <p>This content requires social media cookies.</p>
        <button onClick={() => setCategoryConsent("social", true)}>Enable Social Media</button>
      </div>
    );
  }

  return (
    <iframe
      src={`https://www.youtube.com/embed/${videoId}`}
      width="560"
      height="315"
      frameBorder="0"
      allowFullScreen
    />
  );
}
```

### Custom Hook

```tsx
import { useConsentManager } from "@consentry/next";
import { useCallback } from "react";

export function useAnalytics() {
  const { hasConsentedTo, setCategoryConsent } = useConsentManager();

  const trackEvent = useCallback(
    (event: string, data?: any) => {
      if (hasConsentedTo("performance") && typeof gtag !== "undefined") {
        gtag("event", event, data);
      }
    },
    [hasConsentedTo]
  );

  const enableAnalytics = useCallback(() => {
    setCategoryConsent("performance", true);
  }, [setCategoryConsent]);

  return {
    trackEvent,
    enableAnalytics,
    analyticsEnabled: hasConsentedTo("performance"),
  };
}

// Usage
function MyComponent() {
  const { trackEvent, analyticsEnabled } = useAnalytics();

  const handleClick = () => {
    trackEvent("button_click", { button_id: "header_cta" });
  };

  return <button onClick={handleClick}>Click me {analyticsEnabled && "(tracked)"}</button>;
}
```

---

## 🛠️ Advanced Configuration

### Environment-Specific Setup

```tsx
const getConsentConfig = (): ConsentConfig => {
  const isProd = process.env.NODE_ENV === "production";

  return {
    debug: !isProd,
    defaults: {
      functional: true,
      performance: isProd, // Auto-enable in production
      advertising: false,
      social: false,
    },
    scripts: isProd ? productionScripts : developmentScripts,
  };
};
```

### Custom Storage Key

```tsx
<ConsentManagerProvider config={consentConfig} storageKey="my-app-consent">
  {children}
</ConsentManagerProvider>
```

### Server-Side Rendering Considerations

```tsx
"use client";
import dynamic from "next/dynamic";

// Avoid hydration issues
const ConsentManager = dynamic(() => import("@consentry/ui"), {
  ssr: false,
});

const ConsentProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ConsentManagerProvider config={consentConfig}>
      <ConsentManager mode="modal" />
      {children}
    </ConsentManagerProvider>
  );
};
```

---

## 🧪 Testing

### Mock the Hook

```tsx
// __mocks__/@consentry/next.ts
export const useConsentManager = () => ({
  preferences: {
    functional: true,
    performance: true,
    advertising: false,
    social: false,
  },
  updatePreferences: jest.fn(),
  setCategoryConsent: jest.fn(),
  hasConsentedTo: jest.fn(() => true),
  hasConsentedOnce: jest.fn(() => true),
  acceptAll: jest.fn(),
  rejectAll: jest.fn(),
  resetConsent: jest.fn(),
});
```

### Test Components

```tsx
import { render, screen } from "@testing-library/react";
import { useConsentManager } from "@consentry/next";
import MyComponent from "./MyComponent";

jest.mock("@consentry/next");

test("shows analytics when performance cookies enabled", () => {
  (useConsentManager as jest.Mock).mockReturnValue({
    hasConsentedTo: (category: string) => category === "performance",
  });

  render(<MyComponent />);
  expect(screen.getByText("Analytics Dashboard")).toBeInTheDocument();
});
```

---

## 🔒 Privacy & Compliance

### GDPR Compliance

- **Consent before tracking** — Scripts only load after explicit consent
- **Granular control** — Users choose specific categories
- **Easy withdrawal** — One-click preference changes
- **Data portability** — Export/import consent settings

### Google Consent Mode v2

The provider automatically handles Google's consent mode v2:

```tsx
// Automatically called when preferences change
gtag("consent", "update", {
  analytics_storage: preferences.performance ? "granted" : "denied",
  ad_storage: preferences.advertising ? "granted" : "denied",
  ad_user_data: preferences.advertising ? "granted" : "denied",
  ad_personalization: preferences.advertising ? "granted" : "denied",
});
```

---

## 🚨 Common Issues & Solutions

### Hydration Mismatch

```tsx
// ❌ Wrong - causes hydration issues
export default function Layout({ children }) {
  return (
    <ConsentManagerProvider config={config}>
      <ConsentManager />
      {children}
    </ConsentManagerProvider>
  );
}

// ✅ Correct - use dynamic import
const ConsentManager = dynamic(() => import("@consentry/ui"), { ssr: false });
```

### Scripts Not Loading

```tsx
// ❌ Wrong - bypasses consent management
<Script src="https://analytics.example.com/script.js" />;

// ✅ Correct - managed by consent system
scripts: [
  {
    id: "analytics",
    category: "performance",
    src: "https://analytics.example.com/script.js",
  },
];
```

### Hook Outside Provider

```tsx
// ❌ Wrong - hook used outside provider
function App() {
  const { preferences } = useConsentManager(); // Error!
  return <div>...</div>;
}

// ✅ Correct - hook used inside provider
function App() {
  return (
    <ConsentManagerProvider config={config}>
      <MyComponent />
    </ConsentManagerProvider>
  );
}

function MyComponent() {
  const { preferences } = useConsentManager(); // Works!
  return <div>...</div>;
}
```

---

## 🔗 Related Packages

- [`@consentry/core`](https://www.npmjs.com/package/@consentry/core) — Framework-agnostic consent logic
- [`@consentry/ui`](https://www.npmjs.com/package/@consentry/ui) — React components for banners and modals

### Complete Setup Guide

For the full experience with UI components, check out the [`@consentry/ui` documentation](https://www.npmjs.com/package/@consentry/ui) which includes:

- 🎨 Customizable cookie banners and modals
- 🌈 Color themes and styling options
- 🌍 Multi-language support
- 📱 Mobile-optimized responsive design
- ♿ Full accessibility support

---

## 📄 License

MIT — Copyright © 2025 [Mustafa ONAL](https://github.com/neddl)
