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

- Neon PostgreSQL (6 tables)

---

## AI

Gemini 2.0 Flash

### Vision

- Clothing detection
- Category classification
- Color detection
- Material detection
- Pattern detection
- Season suitability
- Occasion suitability

### LLM

- Duplicate detection (comparing new uploads against existing wardrobe)
- Outfit recommendations (planned)
- Natural language search (planned)

---

## Storage

- Cloudinary (image hosting, CDN, transformations)
- Sharp (server-side image optimization)

---

## APIs

- Gemini (Google GenAI)
- Cloudinary
- OpenWeather (planned)
- Resend (planned)

---

## Deployment

- Vercel (planned)
- Neon (connected)
- Cloudinary (connected)

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
│   ├── wardrobe/
│   │   ├── page.tsx
│   │   ├── client.tsx
│   │   ├── new/page.tsx
│   │   └── [id]/
│   │       ├── page.tsx
│   │       ├── delete-button.tsx
│   │       └── edit/page.tsx
│   ├── outfits/page.tsx
│   ├── calendar/page.tsx
│   └── analytics/page.tsx
├── api/auth/[...all]/route.ts
├── globals.css
├── layout.tsx
└── page.tsx

actions/
├── analyze.ts
├── duplicate-check.ts
├── wardrobe.ts
└── wear-log.ts

components/
├── dashboard/
│   ├── StatTag.tsx
│   ├── TapeProgress.tsx
│   ├── GettingStarted.tsx
│   ├── ActivityRail.tsx
│   └── QuickAddButton.tsx
├── layout/
│   ├── sidebar.tsx
│   ├── navbar.tsx
│   └── theme-toggle.tsx
├── ui/
│   ├── button.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── card.tsx
│   └── separator.tsx
└── wardrobe/
    ├── SmartUploader.tsx
    ├── ItemForm.tsx
    ├── ItemCard.tsx
    └── UploadDropzone.tsx

docs/
├── Bible.md
├── PRD.md
├── TechReq.md
├── changelog.md
└── update.md

lib/
├── auth/
│   └── auth.ts
├── auth.ts
├── auth-client.ts
├── dashboard-data.ts
├── cloudinary.ts
├── validations/wardrobe.ts
├── generated/prisma/
├── prisma/client.ts
└── utils.ts

prisma/
├── schema.prisma
├── prisma.config.ts
└── migrations/
    ├── 20260724183709_add_clothing_item/
    └── 20260724190926_add_wear_log/

proxy.ts
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
- Typography-driven hierarchy
- Geist Mono for woven-label uppercase captions
- Dark/light mode with CSS custom properties

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
- ThemeToggle (sun/moon icon)

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
- Stats query real database (totalItems, wornThisWeek)
- Checklist progresses as items are added
- No hardcoded/mock data

`lib/auth.ts`

- `requireSession()` reads session from request headers server-side

---

## ✅ Dark Mode

Theme toggle with full dark/light mode support.

`components/layout/theme-toggle.tsx`

- Sun/Moon icon button in navbar
- Toggles `.dark` class on `<html>`
- Persists preference to `localStorage`
- Respects OS preference on first visit
- Hydration-safe (null-initializer pattern)

Dark palette swaps all 9 tokens under `.dark` class.

Flash prevention: inline `<script>` in `<head>` reads localStorage before React renders.

---

# Phase 4: Wardrobe CRUD + AI Smart Upload ✅

## ClothingItem Model

Added to Prisma schema. Migrated to Neon.

```prisma
model ClothingItem {
  id            String   @id @default(cuid())
  userId        String
  name          String
  category      String
  subcategory   String?
  brand         String?
  colors        String[]
  purchaseDate  DateTime?
  purchasePrice Float?
  size          String?
  seasons       String[]
  occasions     String[]
  notes         String?
  images        String[]
  wearCount     Int      @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

Indexes: `userId`
Cascade delete: deleting user removes all items

---

## WearLog Model

Tracks every time an item is worn.

```prisma
model WearLog {
  id              String   @id @default(cuid())
  userId          String
  clothingItemId  String
  date            DateTime @default(now())
  createdAt       DateTime @default(now())
}
```

Indexes: `userId`, `clothingItemId`, `date`
Cascade delete: deleting user or item removes wear logs

---

## Cloudinary + Sharp

### Cloudinary

- Cloud name: (from .env)
- Free tier: 25GB storage, 25GB bandwidth/month
- Auto-format delivery (WebP), CDN worldwide

### Sharp

- Resizes to max 800x800
- Converts to WebP (30-50% smaller)
- Strips EXIF data (privacy)
- Runs server-side before Cloudinary upload

---

## Gemini Vision AI

### Package

```bash
pnpm add @google/genai
```

### Analysis (`actions/analyze.ts`)

`analyzeClothingImage(buffer, mimeType)` → sends photo to Gemini 2.0 Flash.

**Multi-item detection:** One photo can return multiple items. A mirror selfie with a full outfit returns an array of items.

Returns:

```typescript
AnalyzedClothing[]  // array — one object per item detected
```

Each item:

```typescript
{
  name: string;        // "Pink V-neck ribbed knit sweater"
  category: string;    // "tops"
  subcategory: string; // "sweater"
  colors: string[];    // ["pink"]
  seasons: string[];   // ["Fall", "Winter"]
  occasions: string[]; // ["Casual", "Date Night"]
  material: string;    // "wool"
  pattern: string;     // "solid"
  fit: string;         // "fitted"
  details: string;     // "V-neck, ribbed texture, no logo"
  confidence: number;  // 0.0 - 1.0
}
```

**Distinguishing features:** Prompt asks for neckline, sleeve length, fit, texture, and details to differentiate similar items.

### Duplicate Detection (`actions/duplicate-check.ts`)

`checkForDuplicate(buffer, mimeType)` → compares each detected item against existing wardrobe.

Returns: `DuplicateCheckResult[]` — one result per item detected.

**Smart comparison:** Compares structural features, not just category/color:

- Same category + same color + similar style = duplicate
- Same category + same color + different design = NOT a duplicate
- Different category or color = NOT a duplicate

Example: "Pink V-neck ribbed sweater" vs existing "Pink crew-neck cotton t-shirt" → NOT a duplicate.

---

## Smart Upload Flow

### Component (`components/wardrobe/SmartUploader.tsx`)

Three-step flow:

**Step 1 — Upload**

- Drag & drop zone (or click to browse)
- Multiple files (up to 5)
- Works with single-item OR multi-item photos (outfits, flat lays)
- Preview thumbnails with remove
- "Analyze with AI" button

**Step 2 — Analyzing**

- Progress: "Photo 1 of 3" with detail: "Found 3 items. Checking for duplicates..."
- Progress dots
- Spinning loader

**Step 3 — Review**

- Duplicates: "Already in wardrobe — will log as worn"
- New items: "Review AI tags" with editable fields
- Each item shows material, fit, detail tags
- Remove button per item
- Final button: "Log 2 wears & add 3 new items"

### Multi-item detection

1. Upload mirror selfie wearing: blue t-shirt, black jeans, white sneakers
2. AI analyzes → detects 3 items in one photo
3. Each item checked for duplicates separately
4. Review shows 3 cards — edit/save each one
5. Same source photo used as thumbnail for all 3

### Duplicate detection examples

| Photo shows | Wardrobe has | Result |
|---|---|---|
| Pink V-neck ribbed sweater | Pink crew-neck cotton t-shirt | NOT duplicate |
| Blue slim-fit jeans | Blue slim-fit jeans | DUPLICATE |
| White sneakers | White leather sneakers | DUPLICATE |
| Black blazer | Black leather jacket | NOT duplicate |

---

## Wardrobe CRUD Actions (`actions/wardrobe.ts`)

### `createClothingItem(formData)`

1. Validate session
2. Parse FormData with Zod
3. Process images (Sharp)
4. Upload to Cloudinary
5. Create ClothingItem
6. Redirect to /wardrobe

### `updateClothingItem(id, formData)`

1. Validate session + ownership
2. Parse FormData
3. Replace images if new ones uploaded
4. Update ClothingItem
5. Redirect to /wardrobe/[id]

### `deleteClothingItem(id)`

1. Validate session + ownership
2. Delete images from Cloudinary
3. Delete ClothingItem
4. Redirect to /wardrobe

---

## Wear Logging Actions (`actions/wear-log.ts`)

### `logWear(clothingItemId)`

1. Validate session + ownership
2. Create WearLog entry
3. Increment wearCount

### `logWearForItems(clothingItemIds)`

Batch version for handling multiple duplicates at once.

---

## Wardrobe Pages

### `/wardrobe` — Grid View

- Server component fetches all items
- Client component handles search + filtering
- Search: name, brand, subcategory
- Category buttons: All, Tops, Bottoms, Shoes, Outerwear, Accessories
- Responsive grid: 2/3/4 columns
- Empty state

### `/wardrobe/new` — Smart Upload

- SmartUploader component
- AI-powered flow

### `/wardrobe/[id]` — Detail View

- Large main image
- Thumbnail gallery
- All item info (name, category, brand, size, colors, seasons, occasions, price, date, wear count, notes)
- Edit + Delete buttons

### `/wardrobe/[id]/edit` — Edit Form

- Pre-filled ItemForm
- Photo replacement
- Zod validation

### `/wardrobe/[id]/delete-button` — Delete Confirmation

- Inline confirmation
- Removes from Cloudinary + DB

---

## Wardrobe Components

### `SmartUploader.tsx`

AI-powered upload flow.

### `ItemForm.tsx`

- Photo dropzone
- Name, category, type, brand, size inputs
- Color pills (16 colors)
- Season pills (4)
- Occasion pills (5)
- Price + date
- Notes textarea

### `ItemCard.tsx`

- Photo (or placeholder)
- Wear count badge
- Item name + category + brand
- Quick "Log wear" `+` button
- Click → detail view

### `UploadDropzone.tsx`

- Drag & drop
- Click to browse
- Preview thumbnails
- File validation

---

## Validation (`lib/validations/wardrobe.ts`)

Zod schema + constants:

- `clothingItemSchema`
- `CATEGORIES` (5)
- `COLORS` (16)
- `SEASONS` (4)
- `OCCASIONS` (5)

---

## Dashboard Stats (Updated)

`lib/dashboard-data.ts` queries real database:

```typescript
const totalItems = await prisma.clothingItem.count({ where: { userId } });
const wornThisWeek = await prisma.clothingItem.count({
  where: { userId, wearCount: { gt: 0 } },
});
```

Checklist progresses as items are added.

---

# Database Schema (Current)

6 tables in Neon PostgreSQL:

```
user
├── session (1:many)
├── account (1:many)
├── clothing_item (1:many)
└── wear_log (1:many)

clothing_item
└── wear_log (1:many)
```

---

# What Works

- `pnpm dev` starts successfully
- `/sign-in` — login
- `/sign-up` — register
- `/` — redirects to `/sign-in`
- `/dashboard` — real session, real stats, getting started, activity
- `/wardrobe` — grid with real data, search, filters
- `/wardrobe/new` — AI smart upload (photo → analyze → review → save)
- `/wardrobe/[id]` — detail view, edit, delete
- `/outfits` — empty state (not yet built)
- `/calendar` — empty state (not yet built)
- `/analytics` — empty state (not yet built)
- Prisma connected to Neon (6 tables)
- Better Auth API routes
- Server-side session
- Sign out from sidebar
- Loading skeletons + error boundaries
- Dark/light mode toggle
- Duplicate detection via AI
- Wear logging (automatic + manual)
- Dashboard stats from real database
- No hardcoded/mock data

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
- cloudinary
- sharp
- zod
- @google/genai

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

- pnpm, Corepack, Lockfiles
- pnpm approve-builds
- Git workflow
- App Router (route groups, loading.tsx, error.tsx)
- shadcn architecture (Radix primitives)
- Prisma 7 (generators, Client, singleton, driver adapters, breaking changes)
- Neon PostgreSQL
- Better Auth (adapters, client API, server-side sessions)
- Server Components vs Client Components
- Server-only data fetching
- Tailwind v4 @theme inline design tokens
- Garment-domain naming (seam, tape, tag, linen, dust)
- Hang-tag clipPath shape
- Closet rod timeline metaphor
- Tape measure progress visualization
- Woven-label typography (tracked uppercase mono)
- Dark mode (CSS custom properties, hydration-safe, flash prevention)
- localStorage theme persistence
- OS prefers-color-scheme detection
- Server Actions (mutations)
- Zod validation (client + server)
- Cloudinary (image hosting, CDN, transformations)
- Sharp (server-side image optimization, WebP conversion)
- Gemini Vision AI (structured JSON output, clothing analysis, multi-item detection)
- AI duplicate detection (structural feature comparison — neckline, fit, material, not just category/color)
- Multi-item photos (one photo → multiple items detected and processed separately)
- Wear tracking (WearLog model, automatic + manual logging)
- FormData handling in Server Actions

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
- ✅ Dashboard components
- ✅ Loading states
- ✅ Error boundaries
- ✅ Placeholder pages (wardrobe, outfits, calendar, analytics)
- ✅ No hardcoded/mock data
- ✅ Dark/light mode toggle

---

## Phase 4 — Wardrobe CRUD + AI ✅

- ✅ ClothingItem model
- ✅ WearLog model
- ✅ Cloudinary + Sharp setup
- ✅ Gemini Vision integration
- ✅ AI clothing analysis
- ✅ AI duplicate detection
- ✅ Smart upload flow (photo → analyze → review → save)
- ✅ Wear logging (automatic + manual)
- ✅ Wardrobe grid with search + filters
- ✅ Item detail view
- ✅ Item edit/delete
- ✅ Dashboard stats from real DB

---

## Phase 5 — Outfits (next)

- Add Outfit + OutfitItem models
- Create outfit from wardrobe items
- AI outfit suggestions
- Outfit detail view

---

## Phase 6 — Calendar

- Visual timeline of what was worn when
- Click date → see outfit
- Log outfit for specific date

---

## Phase 7 — Analytics

- Cost per wear
- Least/most worn items
- Category/color distribution
- Wear frequency over time

---

## Phase 8 — Notifications

- Browser push notifications
- "You haven't worn X in 30 days"
- Weather-based suggestions

---

## Phase 9 — AI Suggestions

- Weather API integration
- Occasion-based suggestions
- Style learning from wear patterns

---

## Phase 10 — Testing

- Unit
- Integration
- End-to-End

---

## Phase 11 — Deployment

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
