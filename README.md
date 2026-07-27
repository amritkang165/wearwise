<div align="center">

# 👗 WearWise

**Your AI-powered wardrobe assistant.**

Snap a photo → AI identifies every piece → track what you wear → get outfit suggestions.

*Stop forgetting what's in your closet.*

<br />

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)](https://prisma.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://typescriptlang.org)

</div>

---

## ✨ What it does

<table>
<tr>
<td width="50%" valign="top">

### 📸 Smart Upload
Upload a photo of any outfit. Gemini Vision identifies **every item** — tops, bottoms, shoes, accessories — and auto-tags colors, season, occasion, material, and fit.

Already own something? It **detects duplicates** and just logs the wear.

</td>
<td width="50%" valign="top">

### 📅 Visual Calendar
See what you wore and when. A clean Apple Calendar–style grid with colored dots. Click any day to see outfits and items with thumbnails.

The more you log, the smarter your style insights become.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 👔 Outfit Builder
Mix and match items from your wardrobe into saved outfits. Give them names, tag occasions, and mark favorites. Log an outfit as worn with one tap.

</td>
<td width="50%" valign="top">

### 🤖 AI Outfit Suggestions
Tell the AI the occasion, season, or vibe — it suggests outfits from your actual wardrobe. Tells you what's missing, what's formal-level, and styling tips.

</td>
</tr>
</table>

---

## 🎨 Design System

Built with a **garment-domain color palette** — inspired by fabric, threads, and the warmth of a well-organized closet.

| Token | Hex | Usage |
|-------|-----|-------|
| `ink` | `#2c0703` | Primary text |
| `crimson` | `#890620` | Destructive actions |
| `rose` | `#b6465f` | Primary accent, CTAs |
| `dust` | `#da9f93` | Secondary accents |
| `linen` | `#ebd4cb` | Borders, dividers |
| `paper` | `#ffffff` | Card backgrounds |
| `canvas` | `#fdf9f7` | Page background |
| `seam` | `#f1e4de` | Hover states |
| `ash` | `#8a7a75` | Muted text |

Full dark mode support via CSS custom properties.

---

## 🛠 Tech Stack

```
Frontend    →  Next.js 16 (App Router) + React 19 + Tailwind CSS v4
Backend     →  Next.js Server Actions + Prisma 7
Database    →  PostgreSQL (Neon)
Auth        →  Better Auth (email/password)
AI          →  Google Gemini Vision (gemini-2.5-flash-lite)
Storage     →  Cloudinary (image hosting + optimization)
Fonts       →  Geist Sans + Geist Mono
Validation  →  Zod
Icons       →  Lucide React
```

---

## 📁 Project Structure

```
wearwise/
├── app/
│   ├── (auth)/              # Sign in / Sign up
│   ├── (dashboard)/
│   │   ├── dashboard/       # Home — stats, quick add, activity
│   │   ├── wardrobe/        # Browse, search, filter items
│   │   ├── outfits/         # Create, view, log outfits
│   │   ├── calendar/        # Visual wear history
│   │   └── analytics/       # Wardrobe insights
│   └── api/                 # API routes
├── actions/                 # Server actions
│   ├── analyze.ts           # Gemini AI: photo → items + duplicate check
│   ├── wardrobe.ts          # CRUD for clothing items
│   ├── outfit.ts            # CRUD for outfits + wear logging
│   ├── wear-log.ts          # Individual item wear tracking
│   ├── calendar.ts          # Calendar data fetching
│   └── outfit-suggest.ts    # AI outfit suggestions
├── components/
│   ├── wardrobe/            # SmartUploader, ItemCard, ItemForm
│   ├── outfits/             # OutfitBuilder, OutfitCard, OutfitPhotoUploader
│   ├── calendar/            # CalendarView
│   ├── dashboard/           # StatTag, TapeProgress, GettingStarted
│   ├── layout/              # Sidebar, Navbar, ThemeToggle
│   └── ui/                  # Button, Input, Card, Separator
├── lib/
│   ├── auth.ts              # Session helpers
│   ├── prisma/              # Prisma client singleton
│   ├── cloudinary.ts        # Cloudinary config
│   ├── compress-image.ts    # Client-side image compression
│   └── validations/         # Zod schemas
├── prisma/
│   └── schema.prisma        # 9 models: User, Session, ClothingItem, WearLog, Outfit, OutfitItem, OutfitLog
└── proxy.ts                 # Route protection
```

---

## 🚀 Getting Started

### 1. Clone & install

```bash
git clone https://github.com/amritkang165/wearwise.git
cd wearwise
pnpm install
```

### 2. Set up environment

Create a `.env` file:

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://..."

# Better Auth
BETTER_AUTH_SECRET="your-secret-here"
BETTER_AUTH_URL="http://localhost:3000"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Gemini AI
GEMINI_API_KEY="your-gemini-api-key"
```

### 3. Run migrations

```bash
npx prisma migrate dev
npx prisma generate
```

### 4. Start dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 📸 How It Works

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────────┐
│  Upload      │ ──→ │  Gemini AI   │ ──→ │  Review     │ ──→ │  Save to     │
│  Photo(s)    │     │  Analyzes    │     │  Edit tags  │     │  Wardrobe    │
│              │     │  items       │     │  Fix colors │     │  + Cloudinary│
└─────────────┘     │  + duplicates│     └─────────────┘     └──────────────┘
                    └──────────────┘
                           │
                    ┌──────┴──────┐
                    │  Duplicate? │
                    │  → Log wear │
                    │  → Skip     │
                    └─────────────┘
```

---

## 📊 Database Schema

```
User ─┬─ Session
      ├─ Account
      ├─ ClothingItem ─┬─ WearLog
      │                └─ OutfitItem ── Outfit ─┬─ OutfitLog
      ├─ WearLog                                 │
      ├─ Outfit ────────────────────────────────┘
      └─ OutfitLog
```

**9 tables** covering auth, wardrobe inventory, wear tracking, and outfit management.

---

## 🧠 AI Pipeline

1. **Image compression** — Client-side resize to 800px + JPEG 80% quality
2. **Gemini Vision** — Single API call analyzes photo + checks against existing wardrobe
3. **Duplicate detection** — Compares category, color, and structural features
4. **Cross-batch dedup** — Multiple photos of same item detected and merged

---

## 🌙 Dark Mode

Full dark mode with 9 CSS custom properties that swap via `.dark` class on `<html>`. Theme preference persisted in localStorage with OS preference detection.

---

## 📝 License

Private — All rights reserved.

---

<div align="center">

**Built with care** ✂️

*Stop impulse-buying clothes you already own.*

</div>
