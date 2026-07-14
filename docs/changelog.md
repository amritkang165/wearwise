# WearWise Development Log

## Date

July 15, 2026

---

# Current Status

## Project Setup ✅

* Installed Node.js (v24.14.1)
* Enabled Corepack
* Installed pnpm (v11.10.0)
* Created Next.js project
* Using:

  * Next.js 16
  * React 19
  * TypeScript
  * Tailwind CSS v4
  * shadcn/ui (Radix + Nova)
  * App Router
  * ESLint
  * No src directory
  * Default import alias (@/*)

---

## Git ✅

Initialized Git repository. Connected to GitHub.

---

## shadcn/ui ✅

Installed successfully.

Selected preset:

* Radix
* Nova

Components added (manual — registry unreachable):

* Button
* Input
* Label
* Card
* Separator

---

## Folder Structure ✅

Created:

```text
app/
├── (auth)/
│   ├── layout.tsx
│   ├── sign-in/page.tsx
│   └── sign-up/page.tsx
├── (dashboard)/
│   ├── layout.tsx
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   └── error.tsx
│   ├── wardrobe/page.tsx
│   ├── outfits/page.tsx
│   ├── calendar/page.tsx
│   └── analytics/page.tsx
├── api/auth/[...all]/route.ts
├── globals.css
├── layout.tsx
└── page.tsx

components/
├── dashboard/
│   ├── StatTag.tsx
│   ├── TapeProgress.tsx
│   ├── GettingStarted.tsx
│   ├── ActivityRail.tsx
│   └── QuickAddButton.tsx
├── layout/
│   ├── sidebar.tsx
│   └── navbar.tsx
├── ui/
│   ├── button.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── card.tsx
│   └── separator.tsx
├── wardrobe/
├── outfit/
└── shared/

lib/
├── prisma/
│   └── client.ts
├── auth/
│   └── auth.ts
├── auth.ts              (server-side session helper)
├── auth-client.ts
├── dashboard-data.ts    (server data fetcher)
├── gemini/
├── cloudinary/
├── generated/prisma/
└── utils.ts

prisma/
├── schema.prisma
├── prisma.config.ts
└── migrations/

proxy.ts
actions/
store/
hooks/
types/
docs/
```

---

## Prisma ✅

Fully installed and configured.

```bash
pnpm add prisma @prisma/client @prisma/adapter-pg pg dotenv
```

Configuration:

* Prisma ORM 7
* PostgreSQL driver adapter (`@prisma/adapter-pg`)
* Custom output path (`lib/generated/prisma/`)
* Singleton pattern in `lib/prisma/client.ts`
* `prisma.config.ts` with `dotenv/config`

---

## Neon PostgreSQL ✅

Created Neon project. Connected Prisma.

```bash
pnpm prisma migrate dev --name init
```

First migration applied successfully. 4 tables created:

* user
* session
* account
* verification

---

## Better Auth ✅

Fully installed and configured.

```bash
pnpm add better-auth @better-auth/prisma-adapter @better-auth/cli -D
```

Configuration:

* Prisma adapter (built-in `better-auth/adapters/prisma`)
* Email & password authentication enabled
* Auth secret generated and added to `.env`
* Server config: `lib/auth/auth.ts`
* Client config: `lib/auth-client.ts`
* API route: `app/api/auth/[...all]/route.ts`
* Server-side session: `lib/auth.ts` (requireSession helper)

Schema generated via `npx auth@latest generate`. Models:

* User (id, name, email, emailVerified, image, createdAt, updatedAt)
* Session (id, expiresAt, token, userId, ipAddress, userAgent)
* Account (id, accountId, providerId, userId, password, tokens)
* Verification (id, identifier, value, expiresAt)

---

## Design System ✅

Garment-domain design token system. Airbnb-clean aesthetic.

### Palette

| Token | Hex | Usage |
|---|---|---|
| `ink` | `#2c0703` | Body copy, headings |
| `crimson` | `#890620` | Pressed/active states, links |
| `rose` | `#b6465f` | Primary accent, fills, CTA buttons |
| `dust` | `#da9f93` | Secondary accent, icons, avatar ring |
| `linen` | `#ebd4cb` | Borders, sidebar wash, tag stitching |
| `paper` | `#ffffff` | Page background |
| `canvas` | `#fdf9f7` | Sidebar/recessed panel background |
| `seam` | `#f1e4de` | Hairline dividers |
| `ash` | `#8a7a75` | Muted secondary text |

### Typography

* `--font-sans`: Geist Sans (body, headings)
* `--font-label`: Geist Mono (woven-label uppercase captions — stat labels, categories, dates)

### Shape

* `--radius-card`: 10px
* `--radius-pill`: 999px

---

## Auth UI ✅

Split layout auth pages built.

### Layout (`app/(auth)/layout.tsx`)

* Left panel: Linen background, brand logo, tagline, copyright
* Right panel: Clean white form area
* Mobile: Brand collapses to compact header

### Sign-In (`app/(auth)/sign-in/page.tsx`)

* Email + password form
* Error handling
* Loading states
* Link to sign-up

### Sign-Up (`app/(auth)/sign-up/page.tsx`)

* Name + email + password form
* Error handling
* Loading states
* Link to sign-in

---

## Dashboard ✅

Server-rendered dashboard with custom components.

### Page (`app/(dashboard)/dashboard/page.tsx`)

* Server component — fetches real session data
* Dynamic greeting (morning/afternoon/evening) with user's first name
* Today's date in uppercase label format
* QuickAddButton (client component)
* 3 StatTag cards
* GettingStarted checklist
* ActivityRail feed

### Loading State (`loading.tsx`)

* Skeleton placeholders matching exact layout
* Pulse animation
* Same max-width and spacing as real page

### Error Boundary (`error.tsx`)

* Client component with `reset()` callback
* Clear error message
* "Try again" button with rose CTA

### Components

**StatTag** (`components/dashboard/StatTag.tsx`)

* Garment hang-tag shape (die-cut top-left corner via clipPath)
* Grommet hole detail (small circle top-left)
* Dashed stitched inner border
* Large number + uppercase label + optional trend
* Lucide icon in corner

**TapeProgress** (`components/dashboard/TapeProgress.tsx`)

* Tape measure progress bar
* Tick marks at every step
* Numbered stops like measurement marks
* Rose fill for completed portion

**GettingStarted** (`components/dashboard/GettingStarted.tsx`)

* Checklist with TapeProgress at top
* Completed/X-out-of-total counter
* Checkbox items with done/undone states
* Line-through on completed items

**ActivityRail** (`components/dashboard/ActivityRail.tsx`)

* Closet rod timeline (vertical rail line on left)
* Circular dots at each entry (like hangers on a rod)
* Hairline seam dividers between entries
* Outfit name + piece count + date
* Empty state with "Log an outfit and it will hang here."

**QuickAddButton** (`components/dashboard/QuickAddButton.tsx`)

* Rose CTA button ("Quick add")
* Dropdown with two options: "Add an item" / "Create an outfit"
* Click-outside-to-close behavior
* Links to `/wardrobe/new` and `/outfits/new`

---

## Dashboard Data ✅

Server-side data fetching with real session.

### `lib/auth.ts`

* `requireSession()` — reads session from request headers server-side
* Throws "Unauthorized" if no session

### `lib/dashboard-data.ts`

* `getDashboardData()` — returns real first name from session
* Stats return 0 (until wardrobe models are created)
* Checklist returns all items undone
* Activity returns empty array

No hardcoded/mock data anywhere in the application.

---

## Sidebar ✅

Section-grouped navigation.

* Canvas background (`#fdf9f7`)
* Linen border right
* Brand logo with rose sparkle icon
* 5 nav items with icons
* Active state: rose tint background + rose text
* Inactive: ash text, hover to ink
* Sign out with crimson hover
* Mobile: overlay + slide-in + backdrop

---

## Navbar ✅

Top bar.

* White background, linen border bottom
* Hamburger menu (mobile)
* User name (ash text)
* Rose avatar circle with first initial

---

## Route Protection ✅

`proxy.ts` at project root.

* Checks session cookie via Better Auth
* Redirects unauthenticated users to `/sign-in`
* Redirects authenticated users away from `/sign-in` and `/sign-up`

---

## Packages Installed

### Dependencies

* next
* react
* react-dom
* prisma
* @prisma/client
* @prisma/adapter-pg
* pg
* better-auth
* @better-auth/prisma-adapter
* shadcn
* radix-ui
* lucide-react
* class-variance-authority
* clsx
* tailwind-merge
* tw-animate-css

### Dev Dependencies

* @better-auth/cli
* dotenv
* typescript
* eslint
* eslint-config-next
* tailwindcss
* @tailwindcss/postcss
* @types/node
* @types/react
* @types/react-dom
* babel-plugin-react-compiler

---

## Environment Variables

```env
DATABASE_URL="postgresql://...@neon.tech/neondb?sslmode=require"
BETTER_AUTH_SECRET="..."
BETTER_AUTH_URL="http://localhost:3000"
```

---

## What Works

* `pnpm dev` starts successfully
* `/sign-in` — login page with linen/rose theme
* `/sign-up` — register page
* `/` — redirects to `/sign-in`
* `/dashboard` — server-rendered with real session name, stat tags, getting started, activity rail
* `/wardrobe` — empty state with category filters and add button
* `/outfits` — empty state with create button
* `/calendar` — month nav with empty state
* `/analytics` — stat placeholders with empty state
* Prisma Client connected to Neon
* Better Auth API routes at `/api/auth/*`
* Server-side session helper (`requireSession`)
* Sign out works from sidebar
* All pages have loading skeletons and error boundaries
* No hardcoded/mock data

---

# Next Task

Build wardrobe CRUD:

1. Add ClothingItem model to Prisma schema
2. Run migration
3. Build upload form with photo dropzone
4. Connect Cloudinary for image storage
5. Build wardrobe grid with real data

---

# Development Philosophy

We are building the project one step at a time.

For every command:

* Explain what it does.
* Explain why it is needed.
* Explain alternatives (if any).
* Understand before moving forward.

No copy-pasting tutorials.
No skipping concepts.

---

# Goal

Build WearWise as a production-quality application while understanding every tool used.
