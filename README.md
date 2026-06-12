# AI Receptionist — Admin Dashboard

A Linear-style dark dashboard for managing your AI phone receptionist.

## Stack

- **Next.js 16** — app router, TypeScript
- **Convex** — real-time backend database
- **Tailwind CSS v4** — design system

## Quick Start

```bash
npm install
npx convex dev        # Authenticate with Convex, create project
npm run dev            # Start at localhost:3000
```

**First-time Convex setup:** Run `npx convex dev` on your local machine (not VPS) to authenticate with Convex and create the project. This will give you a `NEXT_PUBLIC_CONVEX_URL` to add to `.env.local`.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Call log — all inbound calls |
| `/bookings` | Appointments booked through the AI |
| `/availability` | Weekly availability grid |
| `/settings` | API credentials for Retell, Twilio, Gmail |

## Convex Tables

- `calls` — every inbound call (callId, callerNumber, outcome, duration, booked)
- `bookings` — confirmed appointments (dayOfWeek, timeSlot, caller info)
- `availability` — weekly time slots (Mon–Fri 9am–5pm every 30 min)

## Environment Variables

```bash
NEXT_PUBLIC_CONVEX_URL=https://your-convex-project.convex.cloud
```

See `.env.local` for all required variables.

## Deploy

```bash
npx vercel deploy --prod
```

Set `NEXT_PUBLIC_CONVEX_URL` in Vercel project settings.

## Files

```
emvy-receptionist/
├── app/
│   ├── layout.tsx       # Sidebar layout
│   ├── page.tsx         # Calls log
│   ├── bookings/        # Bookings page
│   ├── availability/    # Availability grid
│   └── settings/        # API credentials
├── convex/
│   ├── schema.ts        # Database schema
│   └── functions.ts     # Queries + mutations
├── n8n/
│   └── ai-receptionist-webhook.json  # n8n workflow
└── docs/
    ├── SETUP.md         # Full setup guide
    └── faq-prompt-template.md  # Retell system prompt
```
