# AI Receptionist — Template Setup Guide

## Overview

The AI Receptionist template is a self-contained phone agent system. One Convex project per client. No external calendar dependencies.

**Stack:** Retell AI → n8n webhook → Convex → Twilio SMS + Gmail notification

---

## Step 1 — Convex Project

```bash
cd emvy-receptionist
npm install
npx convex dev
```

Create project at [dashboard.convex.dev](https://dashboard.convex.dev). When prompted, choose "create new project". Deploy your Convex URL — it goes into `.env.local` as `NEXT_PUBLIC_CONVEX_URL`.

Schema is pre-defined in `convex/schema.ts`. Tables: `calls`, `bookings`, `availability`.

---

## Step 2 — Retell AI Agent

1. Sign up at [retellai.com](https://retellai.com)
2. Create a new agent
3. Set model: GPT-4o-mini (default)
4. Set voice: select a voice you like
5. Set system prompt (see `docs/faq-prompt-template.md`)
6. Set webhook URL: `https://your-n8n-instance/webhook/ai-receptionist`
7. Get a phone number in Retell dashboard
8. Copy: API key, phone number, agent ID → `docs/.env`

---

## Step 3 — n8n Workflow

1. Sign up at [n8n.io](https://n8n.io) (self-hosted or cloud)
2. Import `n8n/ai-receptionist-webhook.json`
3. Set environment variables in n8n:
   - `CONVEX_ADMIN_KEY` — from Convex dashboard → Settings → API Keys
   - `TWILIO_ACCOUNT_SID` — from Twilio console
   - `TWILIO_AUTH_TOKEN` — from Twilio console
   - `TWILIO_PHONE_NUMBER` — your Twilio SMS number
   - `GMAIL_USER` — your Gmail address
   - `GMAIL_APP_PASSWORD` — Google app password
4. Activate the workflow

---

## Step 4 — Twilio

1. Sign up at [twilio.com](https://twilio.com)
2. Get a phone number with SMS capability
3. Copy Account SID, Auth Token, phone number → n8n env vars

---

## Step 5 — Gmail Notifications

1. Enable 2FA on your Google account
2. Go to [myaccount.google.com/app-passwords](https://myaccount.google.com/app-passwords)
3. Generate an App Password for "Mail"
4. Copy app password → n8n env var `GMAIL_APP_PASSWORD`

---

## Step 6 — Deploy Admin Dashboard

```bash
cd emvy-receptionist
npx vercel deploy --prod
```

Or connect the GitHub repo to Vercel for auto-deploy on push.

Set environment variable:
- `NEXT_PUBLIC_CONVEX_URL` — your Convex deployment URL

---

## Step 7 — Quick Test

1. Call the Retell phone number
2. Wait 10 seconds
3. Check the admin dashboard at `your-app.vercel.app`
4. Verify: call appears in Calls log, SMS sent to owner phone

---

## Updating the System Prompt

Edit the system prompt in Retell dashboard. Common changes:
- Business name and industry
- FAQ answers (specific to the client)
- Booking flow instructions
- Escalation behavior

See `docs/faq-prompt-template.md` for the full prompt template.

---

## Per-Client Replication Checklist

- [ ] Create new Convex project
- [ ] Configure Retell agent with client's business info
- [ ] Import n8n workflow
- [ ] Set environment variables (Twilio, Gmail, Convex)
- [ ] Deploy dashboard to Vercel
- [ ] Seed availability (Mon–Fri 9am–5pm default)
- [ ] Test with a live call
- [ ] Hand off dashboard URL + credentials to client
