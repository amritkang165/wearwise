<div align="center">

<img src="https://img.shields.io/badge/👗-WearWise-pink?style=for-the-badge&labelColor=ffb6c1" />

# ✂️ WearWise <3 >

<img src="https://img.shields.io/badge/AI—Powered-Wardrobe-Management-pink?style=flat-square&labelColor=ffe4e1&color=ffb6c1" />

<br />

**Snap a photo. AI identifies every piece. Track what you wear. Get outfit suggestions.**

*Stop impulse-buying clothes you already own.* 🛍️

<br />

<img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white&labelColor=171717" />
<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black&labelColor=61DAFB" />
<img src="https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white&labelColor=06B6D4" />
<img src="https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma&logoColor=white&labelColor=2D3748" />
<img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white&labelColor=3178C6" />
<img src="https://img.shields.io/badge/Gemini-AI-FF6D00?style=for-the-badge&logo=googlegemini&logoColor=white&labelColor=FF6D00" />
<img src="https://img.shields.io/badge/Cloudinary-F6821F?style=for-the-badge&logo=cloudinary&logoColor=white&labelColor=F6821F" />

<br />
<br />

<img src="https://img.shields.io/badge/License-Private-pink?style=flat-square&labelColor=ffe4e1&color=ffb6c1" />
<img src="https://img.shields.io/badge/Version-0.1.0-pink?style=flat-square&labelColor=ffe4e1&color=ffb6c1" />

</div>

---

<p align="center">
  <img src="https://img.shields.io/badge/✨_Features-FFE4E1?style=for-the-badge&labelColor=FFB6C1&color=FF69B4" />
</p>

<table>
<tr>
<td width="50%" valign="top">

### 📸 Smart Upload

Upload a photo of any outfit. **Gemini Vision** identifies every item — tops, bottoms, shoes, accessories — and auto-tags:

- 🎨 Colors & patterns
- 🌿 Season & occasion
- 🧵 Material & fit
- 📏 Distinguishing details

Already own something? It **detects duplicates** and just logs the wear.

</td>
<td width="50%" valign="top">

### 📅 Visual Calendar

Apple Calendar–style grid showing **what you wore and when**.

- 🟢 Colored dots mark worn days
- 👗 Outfit thumbnails on click
- 🔄 Auto-refreshes when you return
- ⏰ Timezone-aware logging

The more you log, the smarter your insights become.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 👔 Outfit Builder

Mix and match items from your wardrobe into saved outfits.

- ✏️ Name outfits & tag occasions
- ⭐ Mark favorites
- 📷 Create outfits from photos
- 🔄 One-tap "Log as worn"

</td>
<td width="50%" valign="top">

### 🤖 AI Outfit Suggestions

Tell the AI the occasion, season, or vibe — it suggests outfits from **your actual wardrobe**.

- 💡 Missing item recommendations
- 🎭 Formality level analysis
- 🌡️ Season appropriateness
- 💅 Styling tips

</td>
</tr>
</table>

---

<p align="center">
  <img src="https://img.shields.io/badge/🎨_Design_System-FFE4E1?style=for-the-badge&labelColor=FFB6C1&color=FF69B4" />
</p>

> *Inspired by fabric, threads, and the warmth of a well-organized closet.*

<br />

<div align="center">

| | Token | Hex | Role |
|:-:|:---:|:---:|:---|
| 🖤 | `ink` | `#2c0703` | Primary text |
| ❤️ | `crimson` | `#890620` | Destructive actions |
| 🌹 | `rose` | `#b6465f` | Primary accent & CTAs |
| 🩰 | `dust` | `#da9f93` | Secondary accents |
| 🧶 | `linen` | `#ebd4cb` | Borders & dividers |
| 🤍 | `paper` | `#ffffff` | Card backgrounds |
| 🩵 | `canvas` | `#fdf9f7` | Page background |
| 🩷 | `seam` | `#f1e4de` | Hover states |
| 🩶 | `ash` | `#8a7a75` | Muted text |

</div>

<br />

> ☁️ Full **dark mode** support — all 9 tokens swap via CSS custom properties.
> Theme preference saved to `localStorage` with OS detection.

---

<p align="center">
  <img src="https://img.shields.io/badge/🛠_Tech_Stack-FFE4E1?style=for-the-badge&labelColor=FFB6C1&color=FF69B4" />
</p>

<div align="center">

| Layer | Tech |
|:---:|:---|
| 🖥️ **Frontend** | Next.js 16 · React 19 · Tailwind CSS v4 |
| ⚙️ **Backend** | Next.js Server Actions · Prisma 7 |
| 🗄️ **Database** | PostgreSQL (Neon) |
| 🔐 **Auth** | Better Auth (email/password) |
| 🧠 **AI** | Google Gemini Vision (`gemini-2.5-flash-lite`) |
| ☁️ **Storage** | Cloudinary (image hosting + optimization) |
| 🔤 **Fonts** | Geist Sans + Geist Mono |
| ✅ **Validation** | Zod |
| 🎨 **Icons** | Lucide React |

</div>

---

<p align="center">
  <img src="https://img.shields.io/badge/📁_Project_Structure-FFE4E1?style=for-the-badge&labelColor=FFB6C1&color=FF69B4" />
</p>

```
👗 wearwise/
├── 📂 app/
│   ├── (auth)/                 🔐  Sign in / Sign up
│   └── (dashboard)/
│       ├── dashboard/          🏠  Home — stats, quick add, activity
│       ├── wardrobe/           👕  Browse, search, filter items
│       ├── outfits/            👔  Create, view, log outfits
│       ├── calendar/           📅  Visual wear history
│       └── analytics/          📊  Wardrobe insights
│
├── 📂 actions/                 ⚡  Server Actions
│   ├── analyze.ts              🧠  Gemini: photo → items + duplicates
│   ├── wardrobe.ts             👕  CRUD for clothing items
│   ├── outfit.ts               👔  CRUD for outfits + wear logging
│   ├── outfit-suggest.ts       🤖  AI outfit suggestions
│   ├── wear-log.ts             📝  Individual item wear tracking
│   └── calendar.ts             📅  Calendar data fetching
│
├── 📂 components/
│   ├── wardrobe/               📸  SmartUploader, ItemCard, ItemForm
│   ├── outfits/                🎨  OutfitBuilder, OutfitCard, PhotoUploader
│   ├── calendar/               📅  CalendarView
│   ├── dashboard/              🏠  StatTag, TapeProgress, GettingStarted
│   ├── layout/                 🧭  Sidebar, Navbar, ThemeToggle
│   └── ui/                     🧩  Button, Input, Card, Separator
│
├── 📂 lib/
│   ├── auth.ts                 🔐  Session helpers
│   ├── prisma/                 🗄️  Prisma client singleton
│   ├── cloudinary.ts           ☁️  Cloudinary config
│   ├── compress-image.ts       🗜️  Client-side image compression
│   └── validations/            ✅  Zod schemas
│
├── 📂 prisma/
│   └── schema.prisma           📊  9 models — full wardrobe data layer
│
└── 🛡️ proxy.ts                 🔒  Route protection
```

---

<p align="center">
  <img src="https://img.shields.io/badge/🚀_Getting_Started-FFE4E1?style=for-the-badge&labelColor=FFB6C1&color=FF69B4" />
</p>

### 1️⃣ Clone & install

```bash
git clone https://github.com/amritkang165/wearwise.git
cd wearwise
pnpm install
```

### 2️⃣ Set up environment

Create a `.env` file:

```env
# 🗄️ Database (Neon PostgreSQL)
DATABASE_URL="postgresql://..."

# 🔐 Better Auth
BETTER_AUTH_SECRET="your-secret-here"
BETTER_AUTH_URL="http://localhost:3000"

# ☁️ Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# 🧠 Gemini AI
GEMINI_API_KEY="your-gemini-api-key"
```

### 3️⃣ Run migrations

```bash
npx prisma migrate dev
npx prisma generate
```

### 4️⃣ Start dev server

```bash
pnpm dev
```

<p align="center">
  <a href="http://localhost:3000">
    <img src="https://img.shields.io/badge/Open_localhost:3000-FF69B4?style=for-the-badge&labelColor=FFB6C1&color=FF69B4" />
  </a>
</p>

---

<p align="center">
  <img src="https://img.shields.io/badge/📸_How_It_Works-FFE4E1?style=for-the-badge&labelColor=FFB6C1&color=FF69B4" />
</p>

```
    📸                  🧠                  ✏️                  💾
┌──────────┐       ┌──────────┐       ┌──────────┐       ┌──────────┐
│  Upload   │ ───→ │  Gemini  │ ───→ │  Review   │ ───→ │  Save    │
│  Photo(s) │       │  Vision  │       │  Edit     │       │  to DB   │
│           │       │          │       │  Tags     │       │  + CDN   │
└──────────┘       └──────────┘       └──────────┘       └──────────┘
                         │
                    ┌────┴────┐
                    │ Duplicate│
                    │ detected │
                    │ → Log    │
                    │   wear   │
                    └─────────┘
```

---

<p align="center">
  <img src="https://img.shields.io/badge/📊_Database_Schema-FFE4E1?style=for-the-badge&labelColor=FFB6C1&color=FF69B4" />
</p>

```
    👤 User
    ├──── 🔑 Session
    ├──── 🔑 Account
    ├──── 👕 ClothingItem ────── 📝 WearLog
    │     └──── 👔 OutfitItem ── 👔 Outfit ── 📅 OutfitLog
    ├──── 📝 WearLog
    ├──── 👔 Outfit
    └──── 📅 OutfitLog
```

> **9 tables** · Auth · Wardrobe inventory · Wear tracking · Outfit management

---

<p align="center">
  <img src="https://img.shields.io/badge/🧠_AI_Pipeline-FFE4E1?style=for-the-badge&labelColor=FFB6C1&color=FF69B4" />
</p>

<div align="center">

| Step | What happens |
|:---:|:---|
| 1️⃣ | 🗜️ **Compress** — Client-side resize to 800px + JPEG 80% |
| 2️⃣ | 🧠 **Analyze** — Single Gemini call: identify items + check wardrobe |
| 3️⃣ | 🔍 **Dedup** — Compare category, color, structural features |
| 4️⃣ | 🔄 **Cross-batch** — Multiple photos of same item merged |

</div>

---

<p align="center">
  <img src="https://img.shields.io/badge/🌙_Dark_Mode-FFE4E1?style=for-the-badge&labelColor=FFB6C1&color=FF69B4" />
</p>

<div align="center">

All **9 design tokens** swap via CSS custom properties on `.dark` class.

Preference saved to `localStorage` · OS preference auto-detected · Hydration-safe.

</div>

---

<br />

<div align="center">

<img src="https://img.shields.io/badge/✂️_Made_with_love-pink?style=for-the-badge&labelColor=FFE4E1&color=FF69B4" />

<br />

*Your closet is smarter than you think.* 💕

<br />

<img src="https://img.shields.io/badge/License-Private-pink?style=flat-square&labelColor=ffe4e1&color=ffb6c1" />

</div>
