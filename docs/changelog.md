# WearWise Development Log

## Date

July 15, 2026 (started) → July 25, 2026 (current)

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
├── analyze.ts          (Gemini Vision clothing analysis)
├── duplicate-check.ts  (AI duplicate detection)
├── wardrobe.ts         (CRUD server actions)
└── wear-log.ts         (wear logging)

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

lib/
├── prisma/client.ts
├── auth/auth.ts
├── auth.ts              (server-side session helper)
├── auth-client.ts
├── dashboard-data.ts
├── cloudinary.ts
├── validations/wardrobe.ts
├── generated/prisma/
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
* Stats query real database (totalItems, wornThisWeek)
* Checklist progresses as items are added
* Activity returns empty array (outfits not yet built)

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

## Dark Mode ✅

Theme toggle with full dark/light mode support.

### ThemeToggle (`components/layout/theme-toggle.tsx`)

* Sun/Moon icon button in navbar (next to profile)
* Toggles `.dark` class on `<html>`
* Persists preference to `localStorage`
* Respects OS preference on first visit
* Hydration-safe (starts as `null`, syncs after mount — no mismatch)

### Dark Palette (`globals.css`)

All 9 tokens swap under `.dark` class:

| Token | Light | Dark |
|---|---|---|
| ink | `#2c0703` | `#f0e6e0` |
| paper | `#ffffff` | `#1a1412` |
| canvas | `#fdf9f7` | `#140f0d` |
| linen | `#ebd4cb` | `#2a201c` |
| seam | `#f1e4de` | `#231c19` |
| ash | `#8a7a75` | `#9a8a84` |
| rose | `#b6465f` | `#d98a9e` |
| crimson | `#890620` | `#e04060` |
| dust | `#da9f93` | `#e8c0b5` |

### Flash Prevention (`app/layout.tsx`)

* Inline `<script>` in `<head>` reads `localStorage` before React renders
* Applies `dark` class instantly — no flash of wrong theme

---

# Phase 4: Wardrobe CRUD + AI Smart Upload ✅

## ClothingItem Model

Added to Prisma schema. Migrated to Neon.

```prisma
model ClothingItem {
  id            String   @id @default(cuid())
  userId        String
  name          String
  category      String        // "tops", "bottoms", "shoes", "outerwear", "accessories"
  subcategory   String?       // "t-shirt", "jeans", "sneakers"
  brand         String?
  colors        String[]      // ["blue", "white"]
  purchaseDate  DateTime?
  purchasePrice Float?
  size          String?
  seasons       String[]      // ["Spring", "Summer", "Fall", "Winter"]
  occasions     String[]      // ["Casual", "Formal", "Work", "Athletic", "Date Night"]
  notes         String?
  images        String[]      // Cloudinary URLs
  wearCount     Int      @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

Indexes: `userId` for fast per-user queries.
Cascade delete: deleting user removes all their items.

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

Indexes: `userId`, `clothingItemId`, `date` for fast queries.
Cascade delete: deleting user or item removes wear logs.

---

## Cloudinary + Sharp

### Cloudinary (image hosting)

* Cloud name: (from .env)
* Free tier: 25GB storage, 25GB bandwidth/month
* Auto-format delivery (WebP), CDN worldwide
* Transformation URLs for resizing

### Sharp (image processing)

* Resizes uploads to max 800x800
* Converts to WebP (30-50% smaller than JPEG)
* Strips EXIF data (privacy)
* Runs server-side before Cloudinary upload

### Config (`lib/cloudinary.ts`)

```typescript
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export { cloudinary };
```

---

## Gemini Vision AI

### Package

```bash
pnpm add @google/genai
```

### Analysis Action (`actions/analyze.ts`)

`analyzeClothingImage(buffer, mimeType)` — sends photo to Gemini 2.0 Flash.

**Multi-item detection:** One photo can return multiple items. A mirror selfie with a full outfit returns an array of items (top, bottom, shoes, etc.).

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

**Distinguishing features:** Prompt specifically asks for neckline, sleeve length, fit, texture, and details to differentiate similar items (e.g. two pink tops with different necklines).

### Duplicate Detection (`actions/duplicate-check.ts`)

`checkForDuplicate(buffer, mimeType)` — compares each detected item against existing wardrobe.

Returns: `DuplicateCheckResult[]` — one result per item detected.

**Smart comparison:** AI compares structural features, not just category and color:

- Same category + same color + similar style = duplicate
- Same category + same color + different design = NOT a duplicate
- Different category or color = NOT a duplicate

Example: "Pink V-neck ribbed sweater" vs existing "Pink crew-neck cotton t-shirt" → NOT a duplicate (different neckline, different material).

---

## Smart Upload Flow

### Component (`components/wardrobe/SmartUploader.tsx`)

Three-step flow:

**Step 1 — Upload**

* Drag & drop zone (or click to browse)
* Supports multiple files (up to 5)
* Works with single-item photos OR multi-item photos (outfits, flat lays)
* Preview thumbnails with remove button
* "Analyze with AI" button

**Step 2 — Analyzing**

* Shows progress: "Photo 1 of 3" with detail: "Found 3 items. Checking for duplicates..."
* Progress dots for each image
* Spinning loader

**Step 3 — Review**

* Duplicates section: "Already in wardrobe — will log as worn"
* New items section: "Review AI tags"
* Each new item shows:
  * Photo thumbnail (same photo if multiple items from one image)
  * Editable name (pre-filled with specific AI description)
  * Material, fit, and detail tags
  * Category dropdown
  * Color pills
  * Season pills
  * Occasion pills
  * Remove button per item
* Final button: "Log 2 wears & add 3 new items"

### Multi-item detection

1. Upload mirror selfie wearing: blue t-shirt, black jeans, white sneakers
2. AI analyzes → detects 3 items in one photo
3. Each item checked for duplicates separately
4. Review shows 3 cards — edit/save each one
5. Same source photo used as thumbnail for all 3

### Duplicate detection examples

| Photo shows | Wardrobe has | Result |
|---|---|---|
| Pink V-neck ribbed sweater | Pink crew-neck cotton t-shirt | NOT duplicate (different neckline, material) |
| Blue slim-fit jeans | Blue slim-fit jeans | DUPLICATE (same item) |
| White sneakers | White leather sneakers | DUPLICATE (likely same) |
| Black blazer | Black leather jacket | NOT duplicate (different category/style) |
6. User confirms → new ClothingItem created + first wear logged

---

## Wardrobe CRUD Actions (`actions/wardrobe.ts`)

### `createClothingItem(formData)`

1. Validates session (requireSession)
2. Parses FormData with Zod schema
3. Processes images with Sharp
4. Uploads to Cloudinary
5. Creates ClothingItem in database
6. Redirects to /wardrobe

### `updateClothingItem(id, formData)`

1. Validates session + ownership
2. Parses FormData
3. If new images uploaded: deletes old from Cloudinary, uploads new
4. Updates ClothingItem in database
5. Redirects to /wardrobe/[id]

### `deleteClothingItem(id)`

1. Validates session + ownership
2. Deletes all images from Cloudinary
3. Deletes ClothingItem from database
4. Redirects to /wardrobe

---

## Wear Logging Actions (`actions/wear-log.ts`)

### `logWear(clothingItemId)`

1. Validates session + ownership
2. Creates WearLog entry (timestamp)
3. Increments clothingItem.wearCount
4. Returns success + item name

### `logWearForItems(clothingItemIds)`

Batch version — logs wear for multiple items at once.
Used by SmartUploader when handling duplicates.

---

## Wardrobe Pages

### `/wardrobe` — Grid View

* Server component fetches all items for current user
* Client component (`client.tsx`) handles search + filtering
* Search: filters by name, brand, subcategory
* Category buttons: All, Tops, Bottoms, Shoes, Outerwear, Accessories
* Responsive grid: 2 cols mobile, 3 tablet, 4 desktop
* Empty state with "Add your first item" CTA

### `/wardrobe/new` — Smart Upload

* Uses SmartUploader component
* AI-powered: drop photo → analyze → review → save
* No manual form filling required

### `/wardrobe/[id]` — Detail View

* Large main image
* Thumbnail gallery (if multiple images)
* Item name, category, brand, size
* Color/season/occasion pills
* Purchase price + date
* Wear count
* Created date
* Notes
* Edit + Delete buttons

### `/wardrobe/[id]/edit` — Edit Form

* Pre-filled ItemForm with existing data
* Photo replacement (new uploads replace old)
* Same Zod validation as create
* Cancel → back to detail view

### `/wardrobe/[id]/delete-button` — Delete Confirmation

* Client component with inline confirmation
* "Delete [name]?" → "Yes, delete" / "Cancel"
* Removes images from Cloudinary + deletes from DB

---

## Wardrobe Components

### `SmartUploader.tsx`

AI-powered upload flow (described above).

### `ItemForm.tsx`

* Used by edit page (pre-filled) and create page
* Photo dropzone
* Name input (required)
* Category select (required)
* Type/brand/size inputs
* Color pills (multi-select from 16 colors)
* Season pills (multi-select: Spring, Summer, Fall, Winter)
* Occasion pills (multi-select: Casual, Formal, Work, Athletic, Date Night)
* Purchase price ($ prefix) + date picker
* Notes textarea
* Save + Cancel buttons

### `ItemCard.tsx`

* Photo (or shirt icon placeholder)
* Wear count badge
* Item name + category + brand
* Quick "Log wear" `+` button (bottom right)
* Click card → detail view
* `+` button → instant wear log (no photo needed)

### `UploadDropzone.tsx`

* Drag & drop area
* Click to browse
* Preview thumbnails with remove button
* File size/type validation
* Max 5 images

---

## Validation (`lib/validations/wardrobe.ts`)

Zod schema for clothing items:

```typescript
clothingItemSchema = z.object({
  name: z.string().min(1).max(100),
  category: z.enum(["tops", "bottoms", "shoes", "outerwear", "accessories"]),
  subcategory: z.string().max(50).optional(),
  brand: z.string().max(50).optional(),
  colors: z.array(z.string()).max(5).default([]),
  size: z.string().max(20).optional(),
  seasons: z.array(z.string()).max(4).default([]),
  occasions: z.array(z.string()).max(5).default([]),
  purchaseDate: z.string().optional(),
  purchasePrice: z.coerce.number().min(0).max(10000).optional(),
  notes: z.string().max(500).optional(),
});
```

Constants: `CATEGORIES`, `COLORS` (16), `SEASONS` (4), `OCCASIONS` (5)

---

## Dashboard Stats (Updated)

`lib/dashboard-data.ts` now queries real database:

```typescript
const totalItems = await prisma.clothingItem.count({ where: { userId } });
const wornThisWeek = await prisma.clothingItem.count({
  where: { userId, wearCount: { gt: 0 } },
});
```

Checklist progresses as items are added (first item → first task checked).

---

# Packages Installed

## Dependencies

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
* cloudinary
* sharp
* zod
* @google/genai

## Dev Dependencies

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
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GEMINI_API_KEY=your_gemini_api_key
```

---

## What Works

* `pnpm dev` starts successfully
* `/sign-in` — login page with linen/rose theme
* `/sign-up` — register page
* `/` — redirects to `/sign-in`
* `/dashboard` — server-rendered with real session name, real stats, getting started, activity rail
* `/wardrobe` — grid with real data, search, category filters
* `/wardrobe/new` — AI-powered smart upload (photo → analyze → review → save)
* `/wardrobe/[id]` — detail view with all info, edit/delete
* `/wardrobe/[id]/edit` — pre-filled edit form
* `/outfits` — empty state (not yet built)
* `/calendar` — month nav with empty state (not yet built)
* `/analytics` — stat placeholders (not yet built)
* Prisma Client connected to Neon (6 tables)
* Better Auth API routes at `/api/auth/*`
* Server-side session helper (`requireSession`)
* Sign out works from sidebar
* All pages have loading skeletons and error boundaries
* Dark/light mode toggle with localStorage persistence
* Duplicate detection — same item won't be added twice
* Wear logging — automatic (via upload) or manual (+ button)
* Dashboard stats query real database
* No hardcoded/mock data

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

# Next Tasks

## Phase 5 — Outfits

1. Add Outfit + OutfitItem models
2. Create outfit from wardrobe items
3. AI outfit suggestions based on weather/occasion
4. Outfit detail view

## Phase 6 — Calendar

1. Visual timeline of what was worn when
2. Click date → see outfit worn that day
3. Log outfit for specific date

## Phase 7 — Analytics

1. Cost per wear calculation
2. Least/most worn items
3. Category/color distribution charts
4. Wear frequency over time

## Phase 8 — Notifications

1. Browser push notifications
2. "You haven't worn X in 30 days"
3. Weather-based suggestions

## Phase 9 — AI Suggestions

1. Weather API integration
2. Occasion-based suggestions
3. Style learning from wear patterns

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
