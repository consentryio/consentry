# @consentry/ui

> Headless and fully customizable React components for the Consentry consent manager. Includes modals, banners, toggles, and more — built for flexibility and themeability.

---

## ✨ Overview

`@consentry/ui` is the official component library for [`@consentry/core`](https://www.npmjs.com/package/@consentry/core) and [`@consentry/next`](https://www.npmjs.com/package/@consentry/next). It provides:

- 🎨 Customizable cookie banner and settings modal
- ⚙️ Headless, themeable, and styled with Emotion + Framer Motion
- 🧩 Fully controlled or automatic modes
- 🔄 Animations and accessibility baked-in
- 🧑‍💻 Easy integration with any config or hook-based logic

---

## 📦 Installation

```bash
npm install @consentry/ui @consentry/core @consentry/next
```

---

## ⚙️ Usage

### 1. Wrap your app with `ConsentManagerProvider` (from `@consentry/next`)

```tsx
"use client";
import { ConsentManagerProvider } from "@consentry/next";
import ConsentManager from "@consentry/ui";
import consentConfig from "./consent.config";

export default function RootLayout({ children }) {
  return (
    <ConsentManagerProvider config={consentConfig}>
      <ConsentManager mode="modal" dark={false} />
      {children}
    </ConsentManagerProvider>
  );
}
```

---

## 🧠 Features

### 🧱 `ConsentManager` Component

The main UI component. Renders:

- ✅ A floating settings button (optional)
- ✅ A cookie banner (auto-displayed if no prior consent)
- ✅ A settings modal with toggleable cookie categories

#### Props

| Prop                 | Type                           | Default    | Description                        |
| -------------------- | ------------------------------ | ---------- | ---------------------------------- |
| `mode`               | `"modal" \| "top" \| "bottom"` | —          | Defines banner layout              |
| `dark`               | `boolean`                      | `false`    | Enables dark mode styling          |
| `hideSettingsButton` | `boolean`                      | `false`    | Hides the floating button          |
| `categories`         | `CookieCategory[]`             | predefined | Override default cookie categories |
| `labels`             | `object`                       | predefined | Customize banner and modal text    |
| `classNames`         | `object`                       | —          | Customize class names per section  |

---

## 🪝 Control from Anywhere

To open the settings modal programmatically (e.g., from a Privacy page):

```tsx
import { openConsentSettings } from "@consentry/ui";

<button onClick={() => openConsentSettings()}>Open Cookie Settings</button>;
```

---

## 🎨 Customization

You can customize:

- Text (`labels.banner`, `labels.modal`)
- Style (`classNames.container`, `classNames.title`, etc.)
- Behavior (`dark`, `mode`, `hideSettingsButton`)

---

## 📄 License

MIT — Copyright © 2025  
[Mustafa ONAL](https://github.com/neddl)  
[github.com/consentryio](https://github.com/consentryio)
