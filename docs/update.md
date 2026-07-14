# WearWise — Complete Project Context & Progress Log

## Project Name

WearWise

---

# Objective

WearWise is a modern AI-powered wardrobe management web application.

The goal is to allow users to:

- Upload clothing items
- Organize their wardrobe
- Automatically detect clothing attributes using AI
- Generate outfit recommendations
- Track wear history
- Search wardrobe naturally
- Get weather-aware outfit suggestions
- Receive notifications
- View wardrobe analytics

This project is intended to be built as a **production-quality application** while deeply understanding every technology used.

---

# Development Philosophy

The project is intentionally **not** being built by blindly following tutorials.

Rules:

- Build one step at a time.
- Every command must be explained.
- Every library must be explained.
- Explain why it exists.
- Explain alternatives.
- Understand concepts before moving forward.
- Avoid unnecessary complexity.
- Keep the architecture scalable.
- Prefer official documentation over outdated tutorials.
- Never guess APIs for rapidly evolving libraries (Prisma, Better Auth, Next.js).

The assistant should continue teaching in this exact style.

---

# Tech Stack

## Runtime

- Node.js 24
- pnpm 11

---

## Frontend

- Next.js 16 (App Router, Turbopack)
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui (Radix + Nova)
- Lucide React
- Geist Sans + Geist Mono

Planned:

- Framer Motion
- Zustand
- React Hook Form
- Zod
- Recharts

---

## Backend

- Next.js Server Components
- Server Actions
- Prisma ORM 7
- Better Auth (email/password)
- Argon2 (preferred over bcrypt)
- Sharp

---

## Database

- Neon PostgreSQL

---

## Design System

Garment-domain token system. Airbnb-clean aesthetic.

### Palette

| Token | Hex | Role |
|---|---|---|
| `ink` | `#2c0703` | Body copy, headings |
| `crimson` | `#890620` | Pressed/active states, links |
| `rose` | `#b6465f` | Primary accent, CTA buttons |
| `dust` | `#da9f93` | Secondary accent, icons, avatar ring |
| `linen` | `#ebd4cb` | Borders, sidebar wash, tag stitching |
| `paper` | `#ffffff` | Page background |
| `canvas` | `#fdf9f7` | Sidebar/recessed panel background |
| `seam` | `#f1e4de` | Hairline dividers |
| `ash` | `#8a7a75` | Muted secondary text |

### Typography

- `--font-sans`: Geist Sans (body, headings)
- `--font-label`: Geist Mono (woven-label uppercase captions — stat labels, categories, dates)

### Shape

- `--radius-card`: 10px
- `--radius-pill`: 999px

### Design Principles

- White backgrounds, warm accent, generous whitespace
- No gradient blobs, no glow shadows, no dark mode
- Typography-driven hierarchy
- Domain-specific naming (seam, tape, tag, linen, dust)
- Garment metaphor throughout (hang-tags, closet rod, tape measure, stitched borders)

---

## Prisma

- Prisma ORM 7
- Prisma Client
- PostgreSQL Driver Adapter
- pg Driver

Packages:

- prisma
- @prisma/client
- @prisma/adapter-pg
- pg

---

## AI

Gemini 2.5 Flash

### Vision

- Clothing detection
- Category
- Color
- Pattern
- Sleeve length
- Material
- Season

### LLM

- Outfit recommendations
- Natural language search
- Packing assistant
- Shopping advice

---

## Storage

Cloudinary

---

## APIs

- Gemini
- Cloudinary
- OpenWeather
- Resend

Future:

- Google Calendar
- Google Maps

---

## Analytics

PostHog

---

## Testing

- Vitest
- Playwright
- Supertest

---

## Deployment

- Vercel
- Neon

---

# Current Folder Structure

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

docs/
├── Bible.md
├── PRD.md
├── TechReq.md
├── changelog.md
└── update.md

hooks/
lib/
├── auth/
│   └── auth.ts
├── auth.ts                (server-side session helper)
├── auth-client.ts
├── dashboard-data.ts
├── cloudinary/
├── gemini/
├── generated/
│   └── prisma/
├── prisma/
│   └── client.ts
└── utils.ts

prisma/
├── schema.prisma
├── prisma.config.ts
└── migrations/

proxy.ts
actions/
store/
types/
```

---

# Progress

## ✅ Environment

Installed:

- Node.js (v24.14.1)
- pnpm (v11.10.0)

Learned:

- npm vs pnpm
- Corepack
- Lockfiles
- Global vs local packages

---

## ✅ Next.js

Created project.

Configuration:

- TypeScript
- ESLint
- Tailwind CSS v4
- App Router
- Turbopack
- No src directory
- Default alias

---

## ✅ Git

Completed:

- git init
- git add
- git commit
- GitHub remote
- push

---

## ✅ shadcn/ui

Installed successfully.

Selected:

- Radix
- Nova preset

Components added (manual — registry unreachable):

- Button
- Input
- Label
- Card
- Separator

Learned:

- shadcn generates source code
- Radix provides accessibility primitives
- Components become part of the project

---

## ✅ Folder Structure

Created manually.

---

## ✅ Prisma

Installed:

```bash
pnpm add prisma @prisma/client @prisma/adapter-pg pg dotenv
```

Resolved build approval issues:

```bash
pnpm approve-builds
```

Initialized Prisma:

```bash
pnpm prisma init
```

Generated Prisma Client:

```bash
pnpm prisma generate
```

Installed Prisma PostgreSQL Driver:

```bash
pnpm add @prisma/adapter-pg pg
```

Created Prisma singleton:

```
lib/prisma/client.ts
```

Learned:

- Prisma Client
- Driver Adapters
- Singleton Pattern
- Hot Reload issue
- Why Prisma 7 requires adapters
- Prisma 7 breaking changes (generate not auto-run after migrate)

---

## ✅ Neon

Created Neon project.

Configured:

```
DATABASE_URL
```

Successfully connected Prisma to Neon.

First migration applied:

```bash
pnpm prisma migrate dev --name init
```

4 tables created: user, session, account, verification

---

## ✅ Better Auth

Installed:

```bash
pnpm add better-auth
```

Installed Prisma Adapter:

```bash
pnpm add @better-auth/prisma-adapter
```

Installed CLI:

```bash
pnpm add -D @better-auth/cli
```

Generated Secret:

```bash
npx auth@latest secret
```

Added to `.env`:

```
DATABASE_URL="..."
BETTER_AUTH_SECRET="..."
BETTER_AUTH_URL="http://localhost:3000"
```

Created:

```
lib/auth/auth.ts
```

Generated auth schema:

```bash
npx auth@latest generate
```

Models generated: User, Session, Account, Verification

Created API route:

```
app/api/auth/[...all]/route.ts
```

Created client:

```
lib/auth-client.ts
```

Server-side session helper:

```
lib/auth.ts (requireSession)
```

---

## ✅ Design System

Garment-domain token system in `globals.css`.

Design direction:

- Airbnb-clean: white backgrounds, warm accent, generous whitespace
- Domain-specific naming (seam, tape, tag, linen, dust)
- No gradient blobs, no glow shadows, no dark mode
- Typography-driven hierarchy
- Geist Mono for woven-label uppercase captions

Palette:

- ink: `#2c0703` (body copy, headings)
- crimson: `#890620` (pressed/active, links)
- rose: `#b6465f` (primary accent, CTA)
- dust: `#da9f93` (secondary accent, icons)
- linen: `#ebd4cb` (borders, tag stitching)
- paper: `#ffffff` (page background)
- canvas: `#fdf9f7` (sidebar background)
- seam: `#f1e4de` (hairline dividers)
- ash: `#8a7a75` (muted text)

---

## ✅ Auth UI

Split layout auth pages built.

Layout: `app/(auth)/layout.tsx`

- Left panel: Linen background, brand logo, tagline, copyright
- Right panel: Clean white form area
- Mobile: Brand collapses to header

Sign-In: `app/(auth)/sign-in/page.tsx`

- Email + password form
- Error handling, loading states
- Link to sign-up

Sign-Up: `app/(auth)/sign-up/page.tsx`

- Name + email + password form
- Error handling, loading states
- Link to sign-in

---

## ✅ Dashboard Layout

Shell with sidebar + navbar.

`app/(dashboard)/layout.tsx`

- Sidebar (240px, canvas background)
- Navbar (white, linen border)
- Scrollable main content area
- Client component managing sidebar open/close state

---

## ✅ Sidebar

`components/layout/sidebar.tsx`

- Canvas background, linen right border
- Brand logo with rose sparkle icon
- 5 nav items: Dashboard, Wardrobe, Outfits, Calendar, Analytics
- Active state: rose tint background + rose text
- Inactive: ash text, hover to ink
- Sign out button with crimson hover
- Mobile: overlay + slide-in + close button

---

## ✅ Navbar

`components/layout/navbar.tsx`

- White background, linen border bottom
- Hamburger menu (mobile)
- User name + rose avatar circle with first initial
- Real session data via useSession()

---

## ✅ Route Protection

`proxy.ts` at project root.

- Checks session cookie via Better Auth
- Redirects unauthenticated users to `/sign-in`
- Redirects authenticated users away from auth pages

---

## ✅ Dashboard

Server-rendered with real session data.

`app/(dashboard)/dashboard/page.tsx`

- Server component
- Dynamic greeting (morning/afternoon/evening) with real first name
- Today's date in uppercase label format
- QuickAddButton
- 3 StatTag cards (hang-tag shape)
- GettingStarted checklist with TapeProgress
- ActivityRail feed

`app/(dashboard)/dashboard/loading.tsx`

- Skeleton placeholders matching exact layout
- Pulse animation

`app/(dashboard)/dashboard/error.tsx`

- Client component with reset callback
- "Try again" button

Components:

- **StatTag**: Hang-tag shape (clipPath), grommet hole, stitched border, large number + label
- **TapeProgress**: Tape measure progress bar with tick marks and numbered stops
- **GettingStarted**: Checklist with tape progress, checkbox items
- **ActivityRail**: Closet rod timeline with vertical rail, dot markers, seam dividers
- **QuickAddButton**: Rose CTA with dropdown (Add an item / Create an outfit)

---

## ✅ Dashboard Data

`lib/dashboard-data.ts`

- `getDashboardData()` fetches real session via `requireSession()`
- Returns real first name
- Stats return 0 (until wardrobe models exist)
- No hardcoded/mock data

`lib/auth.ts`

- `requireSession()` reads session from request headers server-side

---

## ✅ Placeholder Pages

All built with same design system (tokens, typography, spacing).

`/wardrobe`

- Category filter pills (All, Tops, Bottoms, Shoes, Outerwear, Accessories)
- Search bar
- Empty state with "Add your first item" CTA

`/outfits`

- Empty state with "Create your first outfit" CTA

`/calendar`

- Month navigation with chevrons
- Empty state

`/analytics`

- 4 stat placeholder cards in hang-tag style
- Empty state

---

# Current Blocker

None. Auth flow works. Dashboard renders with real session data.

---

# Next Steps

1. Add ClothingItem model to Prisma schema
2. Run migration
3. Build upload form with photo dropzone
4. Connect Cloudinary for image storage
5. Build wardrobe CRUD with real data

---

# Installed Packages

## Dependencies

- next
- react
- react-dom
- prisma
- @prisma/client
- @prisma/adapter-pg
- pg
- better-auth
- @better-auth/prisma-adapter
- shadcn
- radix-ui
- lucide-react
- class-variance-authority
- clsx
- tailwind-merge
- tw-animate-css

---

## Dev Dependencies

- @better-auth/cli
- dotenv
- typescript
- eslint
- eslint-config-next
- tailwindcss
- @tailwindcss/postcss
- @types/node
- @types/react
- @types/react-dom
- babel-plugin-react-compiler

---

# Concepts Learned

- pnpm
- Corepack
- Lockfiles
- pnpm approve-builds
- Git workflow
- App Router
- shadcn architecture
- Prisma generators
- Prisma Client
- Prisma singleton
- Driver adapters
- PostgreSQL adapters
- Neon
- Environment variables
- Better Auth architecture
- Better Auth adapters
- CLI vs Runtime dependencies
- Prisma 7 breaking changes
- Better Auth client API (signIn, signUp, signOut, useSession)
- Better Auth server-side sessions (auth.api.getSession with headers)
- Server Components vs Client Components
- Server-only data fetching with `server-only` package
- Loading states (loading.tsx convention)
- Error boundaries (error.tsx convention)
- Route groups (parenthesized folders don't add URL segments)
- Tailwind v4 @theme inline for design tokens
- Custom CSS properties as Tailwind utilities
- Garment-domain design token naming
- Hang-tag clipPath shape
- Closet rod timeline metaphor
- Tape measure progress visualization
- Woven-label typography (tracked uppercase mono)

---

# Planned Development Order

## Phase 1 — Foundation ✅

- ✅ Install Prisma
- ✅ Initialize Prisma
- ✅ Create Neon Database
- ✅ Connect Prisma
- ✅ Generate Prisma Client
- ✅ Configure Prisma Driver Adapter
- ✅ Generate Better Auth Schema
- ✅ First Migration
- ✅ Design System + Auth UI

---

## Phase 2 — Authentication ✅

- ✅ Better Auth
- ✅ Sessions
- ✅ Register
- ✅ Login
- ✅ Sign out (sidebar)
- ✅ Route protection (proxy.ts)
- ✅ Server-side session helper
- ⏳ Password Reset
- ⏳ Email Verification
- ⏳ Google OAuth

---

## Phase 3 — UI Foundation ✅

- ✅ Dashboard layout (sidebar + navbar)
- ✅ Dashboard page (server-rendered, real session)
- ✅ Dashboard components (StatTag, TapeProgress, GettingStarted, ActivityRail, QuickAddButton)
- ✅ Loading states (skeletons)
- ✅ Error boundaries
- ✅ Wardrobe page (empty state + filters)
- ✅ Outfits page (empty state)
- ✅ Calendar page (month nav + empty state)
- ✅ Analytics page (stat placeholders + empty state)
- ✅ No hardcoded/mock data

---

## Phase 4 — Wardrobe

- Add ClothingItem model to Prisma
- Run migration
- Upload Clothing (Cloudinary + Sharp)
- CRUD operations (Server Actions)
- Categories + Subcategories
- Search
- Filter by color, season, occasion

---

## Phase 5 — AI

Gemini Vision

- Clothing Detection
- Color Detection
- Material Detection
- Sleeve Detection
- Season Detection

Persist results in PostgreSQL.

---

## Phase 6 — Recommendations

Generate outfits using:

- Weather
- Wear History
- Wardrobe Inventory
- Season

---

## Phase 7 — History

- Wear History
- Outfit History
- Calendar integration

---

## Phase 8 — Notifications

- Browser Notifications
- Email Reminders

---

## Phase 9 — Analytics

PostHog

Track:

- Uploads
- Recommendations
- Searches
- DAU

---

## Phase 10 — Testing

- Unit
- Integration
- End-to-End

---

## Phase 11 — Deployment

Deploy:

- Vercel
- Neon
- Cloudinary

---

# Goal

The goal is **not only to build WearWise**.

The goal is to deeply understand:

- Next.js
- React
- TypeScript
- Prisma 7
- PostgreSQL
- Better Auth
- Authentication Architecture
- AI Integration
- Production Architecture

while building a real-world production-ready application.
