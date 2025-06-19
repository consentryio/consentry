# @consentry/ui

> Headless and fully customizable React components for consent management. Drop-in cookie banners, settings modals, and toggles — built for Next.js with zero configuration required.

---

## ✨ What You Get

- 🍪 **Complete cookie consent solution** — banner, modal, settings
- 🎨 **Fully customizable** — colors, text, positioning, behavior
- ⚡ **Zero config required** — works out of the box with sensible defaults
- 🧩 **Headless architecture** — style it your way or use built-in themes
- 🔄 **Smooth animations** — powered by Framer Motion
- ♿ **Accessibility first** — keyboard navigation, screen readers, focus management
- 📱 **Mobile optimized** — responsive design that works everywhere

---

## 📦 Installation

```bash
npm install @consentry/ui @consentry/next @consentry/core
```

---

## 🚀 Quick Start (5 minutes)

### Step 1: Create the Consent Provider

Create `providers/consent-provider.tsx`:

```tsx
"use client";
import { ConsentConfig, ConsentManagerProvider } from "@consentry/next";
import ConsentManager from "@consentry/ui";

const ConsentProvider = ({ children }: { children: React.ReactNode }) => {
  const consentConfig: ConsentConfig = {
    defaults: {
      functional: true,
      performance: false,
      advertising: false,
      social: false,
    },
    scripts: [
      {
        id: "gtag-js",
        category: "functional",
        consentRequired: false,
        strategy: "afterInteractive",
        src: "https://www.googletagmanager.com/gtag/js?id=YOUR_GA_ID",
      },
      {
        id: "gtag-init",
        category: "functional",
        consentRequired: false,
        strategy: "afterInteractive",
        content: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'YOUR_GA_ID');
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied'
          });
        `,
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

Create `app/providers.tsx`:

```tsx
"use client";
import ConsentProvider from "@/providers/consent-provider";
import { ReactNode } from "react";

export const Providers = ({ children }: { children: ReactNode }) => {
  return <ConsentProvider>{children}</ConsentProvider>;
};
```

### Step 3: Wrap Your App

Update `app/layout.tsx`:

```tsx
import { Providers } from "./providers";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

**That's it!** Your consent manager is now active. Users will see a banner on first visit and can manage preferences anytime.

---

## 🎛️ ConsentManager Component

The main UI component that handles everything automatically.

### Basic Usage

```tsx
<ConsentManager mode="modal" dark={false} />
```

### All Props

```tsx
interface ConsentManagerProps {
  // Layout & Positioning
  mode?: "modal" | "top" | "bottom"; // Banner position
  dark?: boolean; // Dark/light theme
  hideSettingsButton?: boolean; // Hide floating settings button

  // Customization
  colors?: ColorTheme; // Custom color scheme
  labels?: CustomLabels; // Custom text/translations
  classNames?: CustomClassNames; // CSS class overrides

  // Behavior
  categories?: ConsentCategory[]; // Override default categories
  autoShow?: boolean; // Auto-show banner (default: true)
  showDeclineAll?: boolean; // Show "Decline All" button
  showAcceptAll?: boolean; // Show "Accept All" button
}
```

---

## 🎨 Customization Examples

### Custom Colors

```tsx
<ConsentManager
  mode="modal"
  colors={{
    light: {
      primary: "#6B50A2",
      primaryHover: "#4A2F7F",
      primaryText: "#FFFFFF",
      settingsButton: "#645876",
      settingsButtonHover: "#403D57",
      settingsButtonText: "#FFFFFF",
      background: "#FFFFFF",
      text: "#403D57",
      border: "#D6D9E1",
    },
    dark: {
      primary: "#8B5FD6",
      primaryHover: "#A67EE5",
      primaryText: "#FFFFFF",
      settingsButton: "#6B7280",
      settingsButtonHover: "#9CA3AF",
      settingsButtonText: "#FFFFFF",
      background: "#1F2937",
      text: "#F9FAFB",
      border: "#374151",
    },
  }}
/>
```

### Custom Text/Labels

```tsx
<ConsentManager
  mode="modal"
  labels={{
    banner: {
      title: "We value your privacy",
      description: "We use cookies to enhance your experience and analyze our traffic.",
      acceptAll: "Accept All",
      declineAll: "Decline All",
      settings: "Customize",
    },
    modal: {
      title: "Cookie Preferences",
      description: "Choose which cookies you'd like to accept.",
      save: "Save Preferences",
      acceptAll: "Accept All",
      declineAll: "Decline All",
    },
    categories: {
      functional: {
        title: "Essential Cookies",
        description: "Required for basic site functionality.",
      },
      performance: {
        title: "Performance Cookies",
        description: "Help us analyze site usage and improve performance.",
      },
      advertising: {
        title: "Advertising Cookies",
        description: "Used to deliver relevant ads and measure campaign effectiveness.",
      },
      social: {
        title: "Social Media Cookies",
        description: "Enable social media features and content sharing.",
      },
    },
  }}
/>
```

### Banner Positions

```tsx
// Modal overlay (recommended)
<ConsentManager mode="modal" />

// Top banner
<ConsentManager mode="top" />

// Bottom banner
<ConsentManager mode="bottom" />
```

---

## ⚙️ Configuration Types

### ConsentConfig

```tsx
interface ConsentConfig {
  debug?: boolean; // Enable debug logging
  defaults: CookiePreferences; // Default consent state
  scripts: ConsentScript[]; // Scripts to manage
}
```

### CookiePreferences

```tsx
interface CookiePreferences {
  functional: boolean; // Always true (required for site to work)
  performance: boolean; // Analytics, monitoring
  advertising: boolean; // Ads, marketing pixels
  social: boolean; // Social media embeds, sharing
}
```

### ConsentScript

```tsx
interface ConsentScript {
  id: string; // Unique identifier
  category: ConsentCategory; // Cookie category
  consentRequired?: boolean; // Require explicit consent
  strategy?: "afterInteractive" | "lazyOnload" | "beforeInteractive";
  src?: string; // External script URL
  content?: string; // Inline script content
  noscript?: string; // Fallback for no-JS
  vendor?: string; // Third-party service name
  default?: boolean; // Load by default
}
```

---

## 📜 Script Examples

### Google Analytics 4

```tsx
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
      gtag('config', 'G-XXXXXXXXXX', {
        send_page_view: true,
        cookie_flags: 'SameSite=None;Secure'
      });
      // Required for Google Analytics v2 consent mode - must start with 'denied'
      // These will be updated to 'granted' when user provides consent
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
{
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
}
```

### Hotjar

```tsx
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
}
```

### YouTube Embeds

```tsx
{
  id: "youtube-embeds",
  category: "social",
  consentRequired: true,
  strategy: "lazyOnload",
  content: `
    // Enable YouTube embeds when social cookies are accepted
    document.querySelectorAll('[data-youtube-consent]').forEach(el => {
      el.style.display = 'block';
    });
  `,
  vendor: "YouTube",
}
```

### Twitter/X Embeds

```tsx
{
  id: "twitter-widgets",
  category: "social",
  consentRequired: true,
  strategy: "lazyOnload",
  src: "https://platform.twitter.com/widgets.js",
  vendor: "Twitter/X",
}
```

---

## 🎛️ Programmatic Control

### Open Settings Modal

```tsx
import { openConsentSettings } from "@consentry/ui";

function PrivacyPage() {
  return (
    <div>
      <h1>Privacy Policy</h1>
      <button onClick={() => openConsentSettings()}>Manage Cookie Preferences</button>
    </div>
  );
}
```

### Get Current Preferences

```tsx
import { useConsentManager } from "@consentry/next";

function MyComponent() {
  const { preferences, updatePreferences } = useConsentManager();

  return (
    <div>
      <p>Analytics enabled: {preferences.performance ? "Yes" : "No"}</p>
      <button onClick={() => updatePreferences({ performance: !preferences.performance })}>
        Toggle Analytics
      </button>
    </div>
  );
}
```

---

## 🎨 Advanced Styling

### CSS Classes Available

```tsx
classNames={{
  // Banner
  banner: "custom-banner",
  bannerTitle: "custom-banner-title",
  bannerDescription: "custom-banner-description",
  bannerButtons: "custom-banner-buttons",

  // Modal
  modal: "custom-modal",
  modalOverlay: "custom-modal-overlay",
  modalTitle: "custom-modal-title",
  modalDescription: "custom-modal-description",

  // Settings Button
  settingsButton: "custom-settings-button",

  // Category Toggles
  categoryItem: "custom-category-item",
  categoryTitle: "custom-category-title",
  categoryDescription: "custom-category-description",
  toggle: "custom-toggle",
}}
```

### CSS-in-JS Styling

```tsx
import styled from "@emotion/styled";

const StyledConsentManager = styled(ConsentManager)`
  .custom-banner {
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .custom-banner-title {
    font-weight: 700;
    font-size: 1.2rem;
  }
`;
```

---

## 🌍 Internationalization

### Multi-language Support

```tsx
const getLabels = (locale: string) => {
  const translations = {
    en: {
      banner: {
        title: "We value your privacy",
        description: "We use cookies to enhance your experience.",
        acceptAll: "Accept All",
        declineAll: "Decline All",
        settings: "Settings",
      },
    },
    es: {
      banner: {
        title: "Valoramos tu privacidad",
        description: "Utilizamos cookies para mejorar tu experiencia.",
        acceptAll: "Aceptar Todo",
        declineAll: "Rechazar Todo",
        settings: "Configuración",
      },
    },
  };

  return translations[locale] || translations.en;
};

// Usage
<ConsentManager labels={getLabels("es")} />;
```

---

## 🔧 Environment-Specific Configs

### Development vs Production

```tsx
const consentConfig: ConsentConfig = {
  debug: process.env.NODE_ENV === "development",
  defaults: {
    functional: true,
    performance: process.env.NODE_ENV === "production",
    advertising: false,
    social: false,
  },
  scripts: process.env.NODE_ENV === "production" ? productionScripts : [],
};
```

---

## 🚨 Common Issues & Solutions

### Scripts Not Loading

```tsx
// ❌ Wrong - script won't be managed
<Script src="https://analytics.example.com/script.js" />;

// ✅ Correct - add to consent config
scripts: [
  {
    id: "analytics",
    category: "performance",
    consentRequired: true,
    strategy: "afterInteractive",
    src: "https://analytics.example.com/script.js",
  },
];
```

### Styling Not Applied

```tsx
// ❌ Wrong - CSS loaded after component
import ConsentManager from "@consentry/ui";
import "./consent-styles.css";

// ✅ Correct - CSS loaded first
import "./consent-styles.css";
import ConsentManager from "@consentry/ui";
```

### Hydration Issues

```tsx
// ❌ Wrong - server/client mismatch
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
if (!mounted) return null;

// ✅ Correct - use dynamic import
import dynamic from "next/dynamic";
const ConsentManager = dynamic(() => import("@consentry/ui"), { ssr: false });
```

---

## 📚 Full Example

Complete setup with custom styling, multiple analytics, and internationalization:

```tsx
"use client";
import { ConsentConfig, ConsentManagerProvider } from "@consentry/next";
import ConsentManager from "@consentry/ui";
import { useRouter } from "next/navigation";

const ConsentProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

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
            ad_storage: 'denied'
          });
        `,
        vendor: "Google Analytics",
      },

      // Facebook Pixel
      {
        id: "facebook-pixel",
        category: "advertising",
        consentRequired: true,
        strategy: "afterInteractive",
        content: `
          // Facebook Pixel code here
        `,
        vendor: "Meta",
      },

      // Hotjar
      {
        id: "hotjar",
        category: "performance",
        consentRequired: true,
        strategy: "afterInteractive",
        content: `
          // Hotjar code here
        `,
        vendor: "Hotjar",
      },
    ],
  };

  return (
    <ConsentManagerProvider config={consentConfig}>
      <ConsentManager
        mode="modal"
        dark={false}
        colors={{
          light: {
            primary: "#6B50A2",
            primaryHover: "#4A2F7F",
            primaryText: "#FFFFFF",
            settingsButton: "#645876",
            settingsButtonHover: "#403D57",
            settingsButtonText: "#FFFFFF",
            background: "#FFFFFF",
            text: "#403D57",
            border: "#D6D9E1",
          },
        }}
        labels={{
          banner: {
            title: "We respect your privacy",
            description:
              "We use cookies to improve your experience and analyze our website traffic. You can customize your preferences below.",
            acceptAll: "Accept All Cookies",
            declineAll: "Decline All",
            settings: "Customize Settings",
          },
          modal: {
            title: "Cookie Preferences",
            description:
              "We use different types of cookies to optimize your experience on our website. You can customize your preferences for each category below.",
            save: "Save My Preferences",
            acceptAll: "Accept All",
            declineAll: "Decline All",
          },
        }}
        classNames={{
          banner: "rounded-lg shadow-xl",
          bannerTitle: "text-xl font-bold",
          settingsButton: "rounded-full shadow-lg",
        }}
      />
      {children}
    </ConsentManagerProvider>
  );
};

export default ConsentProvider;
```

---

## 🔗 Related Packages

- [`@consentry/core`](https://www.npmjs.com/package/@consentry/core) — Core consent logic (framework-agnostic)
- [`@consentry/next`](https://www.npmjs.com/package/@consentry/next) — Next.js integration hooks and providers

---

## 📄 License

MIT — Copyright © 2025 [Mustafa ONAL](https://github.com/neddl)
