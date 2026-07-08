# WearWise - Technical Requirements Specification (TRS)

## 1. Runtime

* Node.js 22 LTS
* pnpm (Preferred) or npm
* Git
* VS Code

---

# 2. Frontend

## Framework

* Next.js 15 (App Router)

## Language

* TypeScript

## Styling

* Tailwind CSS v4
* shadcn/ui
* Framer Motion

## State Management

* Zustand

## Forms & Validation

* React Hook Form
* Zod
* @hookform/resolvers

## Charts

* Recharts

## Icons

* Lucide React

## Utilities

* clsx
* class-variance-authority
* tailwind-merge
* date-fns

---

# 3. Backend

* Next.js Route Handlers
* Next.js Server Actions
* Prisma ORM
* Better Auth
* Zod
* bcrypt
* Sharp
* dotenv

---

# 4. Database

## Provider

* Neon PostgreSQL

## ORM

* Prisma

## Tables

* users
* clothing_items
* outfits
* outfit_items
* wear_history
* notifications
* recommendations
* sessions
* accounts
* verification_tokens

## Recommended Indexes

* user_id
* category
* color
* season
* favorite
* last_worn
* created_at

---

# 5. Artificial Intelligence

## Vision Model

Gemini 2.5 Flash

### Functions

* Clothing detection
* Category detection
* Color extraction
* Pattern detection
* Sleeve length
* Material detection
* Season detection
* Confidence score

### Output

JSON

## LLM

Gemini 2.5 Flash

### Functions

* Outfit recommendations
* Wardrobe search
* Packing assistant
* Shopping advice
* Natural language queries
* Clothing insights

---

# 6. Storage

Cloudinary

Store

* Clothing images
* Outfit images (optional)
* User profile images (future)

---

# 7. APIs

Required

* Gemini API
* Cloudinary API
* OpenWeather API
* Resend API

Optional

* Google Calendar API
* Google Maps API
* Firebase Cloud Messaging

---

# 8. Authentication

Provider

* Better Auth

Features

* Email & Password Login
* Session Management
* Password Reset
* Protected Routes
* Secure Cookies

Future

* Google Login
* GitHub Login

---

# 9. Security

* HTTPS
* bcrypt Password Hashing
* Secure Cookies
* CSRF Protection
* Rate Limiting
* Input Validation
* Environment Variables
* SQL Injection Protection (Prisma)
* XSS Protection
* Image Validation

---

# 10. Validation

Frontend

* React Hook Form
* Zod

Backend

* Zod

---

# 11. File Upload

Supported Formats

* JPG
* PNG
* WEBP

Maximum Size

* 10 MB

Processing Pipeline

1. Validate file
2. Resize
3. Compress
4. Upload to Cloudinary
5. Save metadata to database

---

# 12. Search

Current

* PostgreSQL Full Text Search

Future

* Meilisearch

---

# 13. Notifications

Current

* Browser Notifications
* Email Notifications

Future

* Push Notifications (Firebase)

---

# 14. Analytics

Platform

* PostHog

Track

* Daily Active Users
* Uploads
* Searches
* AI Recommendations
* Generated Outfits
* User Retention

---

# 15. Testing

Unit

* Vitest

Integration

* Supertest

End-to-End

* Playwright

Code Quality

* ESLint
* Prettier

---

# 16. DevOps

Repository

* GitHub

CI/CD

* GitHub Actions

Hosting

* Vercel

Database

* Neon PostgreSQL

Storage

* Cloudinary

---

# 17. Project Structure

```text
wearwise/
├── app/
│   ├── (auth)/
│   ├── (dashboard)/
│   ├── api/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── actions/
├── components/
│   ├── ui/
│   ├── shared/
│   ├── wardrobe/
│   ├── outfits/
│   └── dashboard/
├── hooks/
├── lib/
│   ├── auth/
│   ├── prisma/
│   ├── cloudinary/
│   ├── gemini/
│   ├── weather/
│   ├── resend/
│   ├── validations/
│   └── utils.ts
├── prisma/
├── public/
├── store/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── types/
├── docs/
├── middleware.ts
├── README.md
└── package.json
```

---

# 18. Environment Variables

```env
DATABASE_URL=

BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000

GEMINI_API_KEY=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

OPENWEATHER_API_KEY=

RESEND_API_KEY=

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

# 19. Browser Support

* Chrome
* Edge
* Firefox
* Safari

---

# 20. Performance Targets

* First Load < 2 seconds
* Lighthouse Score > 90
* API Response < 500 ms
* Image Lazy Loading
* Responsive Design
* Optimized Images
* Server Components by default

---

# 21. Recommended VS Code Extensions

* Prisma
* Tailwind CSS IntelliSense
* ESLint
* Prettier
* GitLens
* Error Lens
* Thunder Client
* Markdown All in One

---

# 22. Estimated Monthly Cost (MVP)

| Service    | Plan      |
| ---------- | --------- |
| Vercel     | Free      |
| Neon       | Free      |
| Cloudinary | Free      |
| Gemini API | Free Tier |
| Resend     | Free      |
| PostHog    | Free      |

**Estimated Cost:** ₹0/month (within free-tier limits)

---

# 23. Development Roadmap

### Phase 1

* Project Setup
* Database
* Authentication

### Phase 2

* Wardrobe CRUD
* Image Upload
* AI Clothing Detection

### Phase 3

* Outfit Generator
* Outfit History
* Weather Integration

### Phase 4

* Search
* Notifications
* Analytics

### Phase 5

* Testing
* Deployment
* Performance Optimization
