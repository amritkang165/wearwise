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

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Lucide React

Planned:

- Framer Motion
- Zustand
- React Hook Form
- Zod
- Recharts

---

## Backend

- Next.js Route Handlers
- Server Actions
- Prisma ORM 7
- Better Auth
- Argon2 (preferred over bcrypt)
- Sharp

---

## Database

- Neon PostgreSQL

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

actions/

components/
├── layout/
├── outfit/
├── shared/
├── ui/
└── wardrobe/

docs/
├── Bible.md
├── PRD.md
└── TechReq.md

hooks/

lib/
├── auth/
│   └── auth.ts
├── cloudinary/
├── gemini/
├── generated/
│   └── prisma/
├── prisma/
│   └── client.ts
└── utils.ts

prisma/
├── schema.prisma
└── prisma.config.ts

store/

types/
```

---

# Documentation

Already created:

```
docs/
├── Bible.md
├── PRD.md
└── TechReq.md
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

Generated:

```
prisma/
schema.prisma

prisma.config.ts

.env
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

---

## ✅ Theme

Custom rich dark theme configured in `globals.css`.

Design direction:

- Rich dark (deep blacks with warm tint)
- Warm amber accent (primary color)
- Apple Health warmth meets bold modern aesthetic

---

## ✅ Auth UI

Split layout auth pages built.

Layout: `app/(auth)/layout.tsx`

- Left panel: Brand area with dark gradient, grid pattern, amber glow
- Right panel: Clean form area
- Mobile: Brand collapses to header

Sign-In: `app/(auth)/sign-in/page.tsx`

- Email + password form
- Show/hide password toggle
- Error handling, loading states

Sign-Up: `app/(auth)/sign-up/page.tsx`

- Name + email + password form
- Live password validation
- Error handling, loading states

---

# Current Blocker

None. Auth flow is ready to test.

Next steps:

1. Create a test user via `/sign-up`
2. Sign in via `/sign-in`
3. Verify session is created
4. Build dashboard layout
5. Add middleware to protect dashboard routes

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
- Dark theme design (oklch color space)
- Hydration warnings (suppressHydrationWarning)
- Split layout auth design

---

# Planned Development Order

## Phase 1 — Foundation

- ✅ Install Prisma
- ✅ Initialize Prisma
- ✅ Create Neon Database
- ✅ Connect Prisma
- ✅ Generate Prisma Client
- ✅ Configure Prisma Driver Adapter
- ✅ Generate Better Auth Schema
- ✅ First Migration
- ✅ Theme + Auth UI

---

## Phase 2 — Authentication

- ✅ Better Auth
- ✅ Sessions
- ✅ Register
- ✅ Login
- ⏳ Logout
- ⏳ Password Reset
- ⏳ Email Verification
- ⏳ Google OAuth
- ⏳ Middleware (protect routes)

---

## Phase 3 — UI Foundation

- Dashboard
- Sidebar
- Navbar
- Theme
- Responsive Layout

---

## Phase 4 — Wardrobe

- Upload Clothing
- Cloudinary
- Sharp
- CRUD
- Categories
- Search

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
- Calendar

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

The assistant should continue from the **current Better Auth generation issue**, use the latest official documentation for Prisma 7 and Better Auth, avoid outdated tutorials, explain every command in detail, and proceed one step at a time.