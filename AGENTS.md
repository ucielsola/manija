# AGENTS.md

## Project

Manija TV - SvelteKit app for managing/streaming video sources (YouTube channels).

## Stack

- **Framework:** Svelte 5 (runes), SvelteKit
- **Styling:** Tailwind CSS v4, DaisyUI
- **Language:** TypeScript
- **Package Manager:** pnpm 10.30.3
- **Node:** 24.14.0

## Commands

```bash
pnpm dev           # Dev server
pnpm build         # Production build
pnpm check         # Type check (svelte-check)
pnpm lint          # Prettier + ESLint
pnpm format        # Format with Prettier
```

## Architecture

**Models (Svelte 5 runes):** `src/lib/models/*.svelte.ts` - `UserSources`, `ManijaSources`, `App`, `ToastStore`

**Services:** `src/lib/services/` - API integrations (`streamsService.ts`)

**Components:** `src/lib/components/` - UI components with icon subdirectory

**Stores:** Exposed from `src/lib/stores/index.ts` - `app`, `userSources`, `manijaSources`, `toastStore`

## Key Dependencies

- `youtube-iframe-ctrl` - YouTube embed control
- `zod` - Schema validation
- `@vercel/analytics` - Analytics
