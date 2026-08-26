<div align="center">

# PagePilot AI

**Turn any book into a conversation.**

Upload a PDF and speak with it in real time — ask questions, request summaries, or listen as your book is read aloud by an AI voice assistant.

[![Live Demo](https://img.shields.io/badge/Live_Demo-PagePilot_AI-0070f3?style=for-the-badge&logo=vercel&logoColor=white)](https://pagepilot-ai.vercel.app/)

![Next.js](https://img.shields.io/badge/Next.js%2016-black?style=flat-square&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React%2019-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Deployment](#deployment)

## Overview

PagePilot AI is a voice-powered reading companion built for people who learn better by talking than by skimming. Upload any PDF, and a real-time voice assistant reads it with you, answers questions grounded in the book's actual content, and keeps transcripts of every session so you can revisit key moments later.

> **Try it live:** [https://pagepilot-ai.vercel.app](https://pagepilot-ai.vercel.app/)

## Features

### 📄 PDF Ingestion & Retrieval
Upload books as PDFs. Files are stored securely and parsed into segments that are retrieved during conversations, so answers stay grounded in your material.

### 🎙️ Real-Time Voice Conversations
Talk through your book with an AI assistant powered by [Vapi](https://vapi.ai) — including natural-language search across your library.

### 📝 Session Transcripts
Every conversation is recorded and saved, letting you review past discussions anytime.

### 🔐 Authentication & Billing
Secure sign-in and subscription management handled by [Clerk](https://clerk.com), with tiered usage limits enforced server-side:

| Plan | Books | Sessions / month | Max session | History |
| -------- | ----- | ---------------- | ----------- | ------- |
| Free | 1 | 50 | 5 min | — |
| Standard | 10 | 100 | 15 min | ✓ |
| Pro | 100 | Unlimited | 60 min | ✓ |

## Tech Stack

| Layer | Technology |
| --------------- | --------------------------------------- |
| Framework | [Next.js](https://nextjs.org) 16 (App Router), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4, shadcn/ui, Base UI |
| Voice AI | [Vapi Web SDK](https://vapi.ai) |
| Authentication & Billing | [Clerk](https://clerk.com) (@clerk/nextjs) |
| Database | MongoDB with Mongoose |
| File Storage | [Vercel Blob](https://vercel.com/storage/blob) |
| PDF Parsing | pdfjs-dist |
| Forms & Validation | react-hook-form, Zod |
| Testing | Vitest, Testing Library |

## Getting Started

### Prerequisites

| Requirement | Source |
| ------------------------- | -------------------------------------------------------- |
| Node.js 20+ | [nodejs.org](https://nodejs.org) |
| MongoDB database | Local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) |
| Vercel Blob store | Read/write token from [Vercel Storage](https://vercel.com/docs/storage/blob) |
| Vapi account | API key + assistant ID from the [Vapi dashboard](https://dashboard.vapi.ai) |
| Clerk application | From the [Clerk dashboard](https://dashboard.clerk.com); billing plans must match `lib/subscription-constants.ts` |

### Installation

1. **Clone the repository and install dependencies:**

   ```bash
   git clone https://github.com/<your-org>/pagepilot_ai.git
   cd pagepilot_ai
   npm install
   ```

2. **Configure environment variables.** Create a `.env.local` file in the project root:

   ```bash
   # Clerk
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=

   # Database
   MONGODB_URI=

   # File storage
   BLOB_READ_WRITE_TOKEN=

   # Voice AI
   NEXT_PUBLIC_VAPI_API_KEY=
   NEXT_PUBLIC_ASSISTANT_ID=
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
| -------------- | ------------------------------------ |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production server |
| `npm run lint` | Lint the codebase with ESLint |
| `npm run test` | Run tests with Vitest |

## Project Structure

```
app/
├── (root)/            # Main application pages (library, book detail, subscriptions)
├── api/               # Route handlers (file upload, Vapi book search)
components/            # UI components (navbar, hero, upload form, Vapi controls)
Database/
├── models/            # Mongoose schemas (book, book segment, voice session)
└── mongoose.ts        # Database connection
hooks/                 # Client hooks (Vapi integration)
lib/
├── actions/           # Server actions (books, sessions)
└── subscription.ts    # Plan limit enforcement
```

## Deployment

PagePilot AI is deployed on the [Vercel Platform](https://vercel.com/new) and available live at [pagepilot-ai.vercel.app](https://pagepilot-ai.vercel.app/).

To deploy your own instance:

1. Push the repository to GitHub.
2. Import the project into Vercel.
3. Configure all environment variables listed above in **Project Settings → Environment Variables**.
4. Deploy.

---

<div align="center">

Built with Next.js · Powered by Vapi · Secured by Clerk

</div>
