# Product Requirements Document (PRD)

# Project Name

**ClosetMind** *(working title)*

**Tagline:**
Your AI wardrobe companion that helps you wear more of what you already own.

---

# Version

v1.0

---

# Author

Amrit

---

# Problem Statement

Most people own significantly more clothes than they actually wear.

Common problems include:

* Forgetting what they own
* Wearing the same outfits repeatedly
* Buying clothes that don't match anything
* Decision fatigue every morning
* Poor wardrobe utilization
* Overspending on fashion
* Difficulty packing for trips

Current wardrobe apps mostly focus on inventory management rather than helping users make better clothing decisions.

---

# Vision

Build an AI-powered wardrobe assistant that understands a user's wardrobe, learns their preferences, tracks wear habits, and provides intelligent outfit recommendations while promoting sustainable fashion.

---

# Mission

Help users maximize the value of the clothes they already own.

---

# Success Metrics

Primary KPIs

* Weekly Active Users
* Clothes Added
* Outfit Recommendations Used
* Average Wear Count per Clothing Item
* User Retention (30 days)

Secondary KPIs

* Outfit Saves
* AI Recommendation Acceptance Rate
* Shopping Assistant Usage
* Packing List Usage

---

# Target Audience

Primary

18–35 years

Students

Young professionals

Fashion-conscious users

Minimalists

---

Secondary

Frequent travelers

Working professionals

Fashion enthusiasts

Sustainability-focused users

---

# User Personas

## Student

Needs

* Quick outfit suggestions
* Budget-conscious
* Limited wardrobe

Pain Points

"I wear the same hoodie every day."

---

## Professional

Needs

* Formal outfit planning
* Calendar integration

Pain Points

"I forget what I wore to my last meeting."

---

## Fashion Enthusiast

Needs

* Outfit inspiration
* Closet analytics

Pain Points

"I own many clothes but never know what to wear."

---

# User Stories

As a user...

* I want to upload my clothes.
* I want AI to categorize them automatically.
* I want to know what I wore recently.
* I want outfit suggestions.
* I want reminders to wash clothes.
* I want packing recommendations.
* I want to discover forgotten clothes.

---

# Functional Requirements

## Authentication

* Sign Up
* Login
* Logout
* Password Reset
* OAuth (optional)

---

## Wardrobe

* Upload images
* Capture from camera
* Edit item
* Delete item
* Archive item

---

## Clothing Information

Every clothing item stores:

* Name
* Category
* Color
* Pattern
* Material
* Brand
* Season
* Occasion
* Purchase Date
* Purchase Price
* Wear Count
* Last Worn
* Favorite
* Image

---

## AI Auto Detection

When uploading:

AI identifies

* Clothing Type
* Color
* Sleeve Length
* Material
* Style
* Pattern
* Gender Neutral Classification

Confidence score included.

---

## Outfit Builder

Create outfits.

Add

Top

Bottom

Shoes

Accessories

Save outfit.

Favorite outfit.

---

## Wear Tracker

Mark outfit as worn.

Automatically updates

* Wear Count
* Last Worn
* Weekly Statistics

---

## Calendar

Calendar View

Tap any date.

See

* Outfit
* Clothes Worn

---

## AI Outfit Generator

User inputs

* Weather
* Occasion
* Mood
* Color Preference

AI generates outfit.

---

## Analytics Dashboard

Most worn

Least worn

Unused clothes

Average wear frequency

Favorite colors

Favorite categories

Wardrobe utilization

Cost per wear

---

## Laundry

Track

Number of wears since wash.

Notify when washing is recommended.

---

## Shopping Assistant

Upload product screenshot.

AI checks

* Existing matching items
* Duplicate clothes
* Purchase recommendation

---

## Packing Assistant

Input

Destination

Days

Weather

Occasion

Generate packing checklist.

---

## Smart Search

Natural language.

Examples

"Show black hoodies."

"Formal shirts."

"Things I haven't worn recently."

---

## Notifications

Morning outfit suggestion

Laundry reminder

Unused clothing reminder

Weather alerts

Trip reminders

---

# Non Functional Requirements

Fast

<300ms UI interactions

Reliable

99.9% uptime

Secure

Encrypted authentication

Private

User controls all data

Accessible

WCAG compliant

Responsive

Desktop

Tablet

Mobile

---

# Tech Stack

Frontend

Next.js

TypeScript

TailwindCSS

Backend

Node.js

Express

Database

PostgreSQL

ORM

Prisma

Authentication

Better Auth / Clerk

Storage

Cloudinary

AI

Vision model for image analysis

LLM for recommendations

Deployment

Vercel

Database Hosting

Supabase / Neon

---

# Database Tables

Users

ClothingItems

Outfits

OutfitItems

WearHistory

LaundryHistory

Recommendations

PackingLists

Notifications

---

# APIs

Weather API

Calendar API

Cloudinary

Vision AI

LLM

Maps API (future)

---

# Security

JWT Sessions

Rate Limiting

Image Validation

HTTPS

Input Validation

Role-Based Access

---

# UX Principles

One tap to upload

No manual tagging whenever possible

Minimal data entry

Large clothing images

Fast search

Apple-inspired clean interface

---

# MVP Scope

Authentication

Upload clothes

Wardrobe

Wear tracking

Calendar

Basic recommendations

Analytics

---

# Future Features

Virtual try-on

AR wardrobe

Friend outfit voting

Social wardrobe

Marketplace integration

Smart mirror

Apple Watch support

Wearable integrations

Closet sharing

AI fashion stylist

---

# Risks

Poor AI detection

Large image storage costs

Privacy concerns

Weather API limitations

Cold-start recommendation quality

---

# Out of Scope (v1)

E-commerce

Social media feed

Live chat

Influencer features

NFTs

Fashion marketplace

---

# Milestones

Week 1

Authentication

Database

Upload

Week 2

Wardrobe

Wear tracking

Week 3

AI tagging

Recommendations

Week 4

Analytics

Packing

Shopping assistant

Polish

Testing

Deployment

---

# Definition of Done

* All core features functional
* No critical bugs
* Mobile responsive
* Unit tests for core logic
* Accessible UI
* Performance optimized
* Production deployment complete
