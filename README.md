# PagePilot AI

Voice-powered reading companion. Upload any PDF and have a real conversation with it — ask questions, request summaries, or listen as your book is read aloud through an AI voice assistant.

## Features

- **PDF Upload & Processing** — Upload books as PDFs; files are processed into segments for retrieval during conversations.
- **Voice Conversations** — Talk through your book with an AI assistant powered by [Vapi](https://vapi.ai), including natural-language book search.
- **Transcripts** — Session transcripts are recorded so you can review past conversations.
- **Authentication** — Secure sign-in managed by [Clerk](https://clerk.com).
- **Subscription Plans** — Tiered usage limits (books stored, sessions per month, session duration) backed by Clerk Billing:

  | Plan | Books | Sessions / month | Max session | History |
  | -------- | ----- | ---------------- | ----------- | ------- |
  | Free | 1 | 50 | 5 min | — |
  | Standard | 10 | 100 | 15 min | Yes |
  | Pro | 100 | Unlimited | 60 min | Yes |

## Tech Stack

| Layer | Technology |
| --------------- | --------------------------------------- |
| Framework | [Next.js](https://nextjs.org) 16 (App Router), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4, shadcn/ui, Base UI |
| Voice AI | [Vapi Web SDK](https://vapi.ai) |
| Authentication | [Clerk](https://clerk.com) (@clerk/nextjs) |
| Database | MongoDB with Mongoose |
| File Storage | [Vercel Blob](https://vercel.com/storage/blob) |
| PDF Parsing | pdfjs-dist |
| Forms & Validation | react-hook-form, Zod |
| Testing | Vitest, Testing Library |

## Getting Started

### Prerequisites

- Node.js 20+
- A MongoDB database
- [Vercel Blob](https://vercel.com/docs/storage/blob) store with a read/write token
- [Vapi](https://dashboard.vapi.ai) account with an API key and an assistant ID
- [Clerk](https://dashboard.clerk.com) application (with billing plans configured to match `lib/subscription-constants.ts`)

### Installation

1. Clone the repository and install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env.local` file in the project root:

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

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

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

The easiest way to deploy is on the [Vercel Platform](https://vercel.com/new). Configure all environment variables listed above in your project settings before deploying.
