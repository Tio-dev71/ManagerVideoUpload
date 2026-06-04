# AutoReel Lite

A minimalist web app for auto-posting short videos to **Facebook Reels**, **Instagram Reels**, and **YouTube Shorts**.

Built with Apple-inspired design principles: clean, calm, premium.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)

## Features

- **Upload Videos** — Drag & drop or file picker (MP4, MOV, WebM)
- **Auto Title** — File name is automatically converted to a clean title
- **Multi-Platform** — Publish to Facebook Reels, Instagram Reels, and YouTube Shorts
- **Schedule** — Post now or schedule for later
- **Queue Worker** — BullMQ processes jobs in the background
- **Team Management** — Admin adds staff by email
- **Status Tracking** — Draft → Scheduled → Publishing → Published / Failed
- **Error Logs** — Detailed logs per platform when publishing fails
- **Mock Mode** — Full testing without real API credentials

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth v5 (magic link) |
| Queue | BullMQ + Redis |
| Storage | Local (adapter for S3/Supabase) |

## Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- npm

### 1. Start Services

```bash
cd autoreel-lite
docker compose up -d
```

This starts:
- PostgreSQL on `localhost:5432`
- Redis on `localhost:6379`

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and set:
- `ADMIN_EMAIL` — your admin email
- `AUTH_SECRET` — generate with `openssl rand -base64 32`

For real publishing, see [docs/API_SETUP.md](docs/API_SETUP.md).

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Database Migration

```bash
npx prisma migrate dev --name init
```

### 5. Seed Admin User

```bash
npx prisma db seed
```

### 6. Start App

```bash
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000)

### 7. Start Queue Worker

In a separate terminal:

```bash
npm run worker
```

### Login Flow (Dev Mode)

1. Go to `http://localhost:3000/login`
2. Enter your `ADMIN_EMAIL`
3. Check your **terminal** for the magic link (printed to console in dev)
4. Click the link to sign in

## Project Structure

```
autoreel-lite/
├── app/                     # Next.js pages
│   ├── (dashboard)/         # Protected pages
│   │   ├── dashboard/       # Main dashboard
│   │   ├── create/          # Create reel
│   │   ├── posts/           # Posts list & detail
│   │   ├── team/            # Team management
│   │   └── settings/        # Social connections
│   ├── api/                 # API routes
│   └── login/               # Login page
├── components/              # UI components
├── lib/                     # Business logic
│   ├── auth/                # NextAuth config
│   ├── db/                  # Prisma client
│   ├── publishers/          # Publisher service
│   ├── queue/               # BullMQ setup
│   └── storage/             # File storage adapter
├── prisma/                  # Schema & seed
├── docs/                    # Documentation
└── worker.ts                # Queue worker entry
```

## User Roles

| Role | Permissions |
|------|------------|
| Admin | Everything: manage team, connect socials, view all posts |
| Staff | Upload videos, create & schedule posts, view own posts |

## Mock Mode

By default, `USE_MOCK_PUBLISHERS=true` in `.env`. This simulates publishing with:
- 3-second delay per platform
- 90% success rate (10% random failure for testing)

Set to `false` and configure real API credentials to publish for real.

## Scripts

| Command | Description |
|---------|------------|
| `npm run dev` | Start dev server |
| `npm run worker` | Start queue worker |
| `npm run build` | Build for production |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed admin user |
| `npm run db:studio` | Open Prisma Studio |

## License

MIT
