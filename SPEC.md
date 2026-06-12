# SPEC.md — Sage's Agent Dashboard

## Concept

Personal command center for Sage (audit agent + builder agent). Dark command center aesthetic — deep space navy, glass morphism, Linear/Vercel/Raycast polish. This is my active workspace, not a passive display.

---

## Design Language

### Colors
```
--bg-base:       #090E17  (deepest background)
--bg-surface:    #0F1623  (cards, panels)
--bg-elevated:    #162030  (hover states)
--bg-glass:       rgba(22,32,48,0.7) (glass)
--border:         rgba(255,255,255,0.06)
--border-bright:  rgba(255,255,255,0.12)
--text-primary:   #F0F4FF
--text-secondary: #8B9BB4
--text-muted:     #4A5568
--accent:         #10B981  (emerald — primary action)
--accent-hover:   #059669
--danger:         #EF4444
--warning:        #F59E0B
```

### Typography
- **Primary:** Inter
- **Mono:** JetBrains Mono
- **Scale:** 12/13/14/16/18/24/32px
- **Weight:** 400 (body), 500 (emphasis), 600 (headings)

### Motion
- 150ms ease for hovers
- 200ms ease-out for panels
- 300ms spring for toasts
- Subtle scale on hover (1.01-1.02)

---

## Pages

### `/` — Command Center
- Active audit (name, stage, last update)
- Active build (name, stage, last commit)
- Stats bar (active audits, active builds, scheduled today)
- Recent activity (last 10 actions across all workflows)
- Quick actions (New Audit, New Build, Upload File)

### `/audits` — Audit Pipeline
- Pipeline kanban: Prospect → Discovery → Research → Report → Review → Delivered
- Audit cards: business name, industry, stage, date
- Search + filter by stage, industry
- Click card → detail panel

### `/builds` — Build Queue
- Pipeline: Queued → Active → Review → Deployed → Archived
- Build cards: project name, client, stage, last update
- Quick add new build
- Link to deployed site

### `/schedule` — Calendar
- List view: upcoming audits, deadlines, follow-ups
- Date + time + event type + business name
- Next 7 days prioritized

### `/files` — File Vault
- Upload zone (drag-drop)
- File grid with type icons, names, dates
- Search by filename
- Click to preview/download

### `/agent` — Control Center
- Agent status (me: Sage)
- Memory viewer (what's in my vault)
- Context manager (files in my context)
- Cron jobs overview (active schedules)
- Prompt playground (test prompts)

---

## Technical

- **Stack:** Next.js 14 (App Router), TypeScript, Tailwind, shadcn/ui, Lucide icons
- **State:** localStorage for v1
- **Auth:** None (single user)
- **Repo:** Use existing emvy-dashboard directory

---

## Interaction Standards

- Every button works
- Real data, no placeholders
- Loading skeletons not spinners
- Meaningful empty states with actions
- Keyboard navigation (tab + enter)