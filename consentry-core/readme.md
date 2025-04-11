# 🛡️ Consentry Monorepo

Welcome to the official **Consentry** monorepo — a developer-first, modular consent management system designed for modern frameworks like **Next.js**, with full support for **Google Consent Mode v2**, **cookie categories**, and plug-and-play script control.

---

## 📦 Packages

This repo uses a **monorepo layout** powered by `pnpm` workspaces and supports multiple packages:

| Package               | Description                                     |
|-----------------------|-------------------------------------------------|
| `@consentry/core`     | Core logic for managing consent preferences, cookie handling, and Consent Mode. |
| `@consentry/next`     | Next.js adapter using `<Script>` API, optimized for App Router. |
| (future) `@consentry/react` | Generic React version for non-Next.js projects. |
| (future) `@consentry/ui`    | Pre-built UI components and theme system. |
| (future) `dashboard`        | Self-hosted or SaaS config dashboard. |

---

## 📁 Folder Structure

```
.
├── packages/
│   ├── core/           # Consent logic, cookie storage, config schema
│   └── next/           # Next.js specific adapter
├── apps/               # (Optional) Dashboard or documentation
├── .gitignore
├── package.json
├── tsconfig.base.json
├── pnpm-workspace.yaml
```

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/consentryio/consentry.git
cd consentry
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Build all packages

```bash
pnpm run build
```

---

## 📜 Scripts

From the root:

- `pnpm build` – builds all packages
- `pnpm dev` – runs packages in dev/watch mode (if configured)
- `pnpm clean` – removes all dist folders

---

## 🤝 Contributing

1. Clone the repo
2. Create a new branch
3. Work inside `packages/your-package`
4. Submit a pull request

---

## 📄 License

MIT License © Mustafa ONAL  
SaaS dashboard may be dual-licensed under a Business Source License (BSL) later.

---

## 🌐 Learn More

- Website: coming soon
- Docs: coming soon
