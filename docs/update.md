# WearWise — Complete Project Context & Progress Log

## Project Name

WearWise

---

# Objective

WearWise is a modern AI-powered wardrobe management web application.

The goal is to allow users to:

* Upload clothing items
* Organize their wardrobe
* Automatically detect clothing attributes using AI
* Generate outfit recommendations
* Track wear history
* Search wardrobe naturally
* Get weather-aware outfit suggestions
* Receive notifications
* View wardrobe analytics

This is intended to be built as a production-quality project while learning every technology used.

---

# Development Philosophy

The project is intentionally **not** being built by blindly following tutorials.

Rules:

* Build one step at a time.
* Every command must be explained.
* Every library must be explained.
* Explain why it exists.
* Explain alternatives.
* Understand concepts before moving forward.
* Avoid unnecessary complexity.
* Keep the architecture scalable.

The assistant should continue teaching in this style.

---

# Tech Stack

## Runtime

* Node.js
* pnpm

## Frontend

* Next.js 16 (App Router)
* React
* TypeScript
* Tailwind CSS v4
* shadcn/ui
* Framer Motion
* Zustand
* React Hook Form
* Zod
* Recharts
* Lucide React

## Backend

* Next.js Route Handlers
* Server Actions
* Prisma ORM
* Better Auth
* bcrypt
* Sharp

## Database

* Neon PostgreSQL

## AI

Gemini 2.5 Flash

Vision

* Clothing detection
* Category
* Color
* Pattern
* Sleeve length
* Material
* Season

LLM

* Outfit recommendations
* Search
* Packing assistant
* Shopping advice
* Natural language queries

## Storage

Cloudinary

## APIs

* Gemini
* Cloudinary
* OpenWeather
* Resend

Future

* Google Calendar
* Google Maps

## Analytics

PostHog

## Testing

* Vitest
* Playwright
* Supertest

## Deployment

* Vercel

---

# Current Folder Structure

```text
components/
├── ui/
├── layout/
├── wardrobe/
├── outfit/
└── shared/

lib/
├── prisma/
├── auth/
├── gemini/
├── cloudinary/
└── utils.ts

actions/

store/

hooks/

types/

app/

docs/
```

---

# Documentation

The project already contains:

* Bible.md
* PRD.md
* TechReq.md

inside

```text
docs/
```

---

# What Has Been Completed

## 1. Environment

Installed:

* Node.js
* pnpm

Learned:

* Why pnpm is preferred.
* Difference between npm and pnpm.
* Corepack.
* Global installation.

---

## 2. Next.js Project

Created project.

Configuration:

* TypeScript
* ESLint
* Tailwind CSS
* App Router
* Turbopack
* No src directory
* Default alias
* No AGENTS.md

We decided to use Next.js 16 instead of 15 because it is the current stable version.

---

## 3. Git

Initialized Git.

Created first commit.

Connected repository to GitHub.

Everything is pushed.

---

## 4. shadcn/ui

Installed successfully.

Selected:

* Radix
* Nova preset

Learned:

* shadcn is not a UI library.
* It generates components.
* Components become part of the project.
* Radix provides accessibility primitives.

---

## 5. Folder Structure

Created folders manually.

No code yet.

---

# Current Blocker

## Prisma

Installed:

```bash
pnpm add prisma @prisma/client
```

Installation failed because pnpm blocked build scripts.

Error:

```text
ERR_PNPM_IGNORED_BUILDS

Ignored build scripts:

@prisma/engines
prisma
```

Earlier, the same issue occurred with:

* sharp
* unrs-resolver

Those were fixed using:

```bash
pnpm approve-builds
```

However Prisma still isn't installed correctly.

Running

```bash
pnpm prisma init
```

fails because the required Prisma build scripts haven't executed.

This is the first thing that needs to be fixed before continuing.

Possible reason:

Could be related to:

* Node 24
* pnpm 11
* Prisma 7

Need to investigate instead of guessing.

---

# Things Learned

* pnpm install
* pnpm dlx
* Git workflow
* git init
* git add
* git commit
* GitHub remote
* Why lockfiles exist
* Why shadcn exists
* Difference between package generators and installed packages
* Why pnpm blocks build scripts
* Why Sharp needs native binaries

---

# Teaching Style

Continue teaching exactly like this:

For every command:

Explain:

* what it does
* every argument
* why it is needed
* alternatives
* internal working
* when not to use it

Only after understanding should the next step begin.

No rushing.

---

# Planned Development Order

## Phase 1

Project Foundation

* Fix Prisma
* Initialize Prisma
* Create Neon database
* Connect Prisma
* Create first schema
* Run first migration
* Open Prisma Studio

---

## Phase 2

Authentication

* Better Auth
* Sessions
* Login
* Register
* Password reset

---

## Phase 3

UI Foundation

* Dashboard layout
* Sidebar
* Navbar
* Theme
* Responsive layout

---

## Phase 4

Wardrobe

* Upload clothing
* Cloudinary
* Sharp image processing
* Clothing CRUD
* Categories
* Search

---

## Phase 5

AI

Gemini Vision

* Detect clothing
* Detect colors
* Detect material
* Detect sleeves
* Detect season

Save results to database.

---

## Phase 6

Recommendations

Generate outfits using:

* weather
* clothing history
* season
* user wardrobe

---

## Phase 7

History

* Wear history
* Calendar
* Outfit history

---

## Phase 8

Notifications

* Browser notifications
* Email reminders

---

## Phase 9

Analytics

PostHog

Track:

* uploads
* recommendations
* searches
* DAU

---

## Phase 10

Testing

* Unit
* Integration
* E2E

---

## Phase 11

Deployment

Deploy:

* Vercel
* Neon
* Cloudinary

---

# Goal

The goal is **not only to build WearWise**.

The goal is to fully understand:

* Next.js
* React
* TypeScript
* Prisma
* PostgreSQL
* Better Auth
* AI Integration
* Production architecture

by building a real-world application.

The assistant should continue exactly from the Prisma installation issue and maintain the same teaching style without repeating previously covered topics unless needed.
