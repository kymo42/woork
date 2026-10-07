# woork - Teen Employment Platform

A modern, mobile-first job platform designed specifically for Australian teenagers (13-17) to find employment, build professional profiles, and connect with employers.

## Features

### The Training Game (`/play`)

Before a teenager hands their details to an adult stranger, woork makes them play both
sides of the desk. The game is the qualification gate for the real job market.

- **Play the worker** - what you're owed, spotting a bad job ad, the questions an
  employer may not ask you, unpaid trials, payslips, and refusing unsafe work.
- **Play the employer** - write a lawful job ad, set junior rates correctly, roster
  around school hours, issue payslips, and induce a young worker safely.
- **The Mirror** - four anonymous applications, one of which is yours. You shortlist
  on merit, then find out whether you would have hired yourself.
- **Identity Shield** - every identifying field starts hidden. Nothing about the
  player is visible until they turn it on themselves, one choice at a time.
- **Qualification** - finish both tracks, beat every trap, and face the Mirror to
  unlock the real job market.

Design constraints that are not negotiable, because every player is under 18:

1. **No leaderboard, ever.** There is nothing to rank and nobody to rank against.
2. **No identity stored.** Progress is a single anonymous record in `localStorage`.
   No name, email, date of birth, school or server sync.
3. **No hard-coded pay figures.** Minimum wages and junior rates change with the
   annual wage review, so the game teaches the rule and points at the live
   Fair Work Pay Calculator instead of a stale dollar amount.
4. **Honest about what isn't known.** Where a state's child-employment rules could
   not be verified to a standard safe enough to tell a teenager, the game says so
   and names the regulator rather than inventing a limit.

> **Pitfalls matter.** Getting a decision wrong shows the trap, explains the real
> consequence, and lets the player take the other road. Nobody is permanently
> penalised for not knowing something they were never taught - but a trap left
> standing blocks entry to the job market.

Legal content is grounded in Fair Work Ombudsman, Fair Work Commission, ATO,
Safe Work Australia and state regulator sources. See
`src/lib/game/jurisdictions.ts` for the source list and verification dates.

### For Teenagers
- 📱 Mobile-first design with Instagram-meets-LinkedIn aesthetic
- 🎯 Smart job matching based on skills, location, and availability
- 📋 Visual profile builder with skills badges and achievements
- 🛡️ Parent approval system for applications (under 16)
- 💬 Safe messaging with AI moderation

### For Parents
- 👁️ Full visibility into teen's job search activity
- ✅ Approve or reject job applications for under-16s
- 💼 Monitor communications with employers
- 📊 Track skills development and achievements

### For Employers
- 👔 Verified candidate profiles with age verification
- 🎯 Skills-first matching algorithm
- ⚖️ Built-in Fair Work compliance guidance
- 💰 Free job posts (1/month on free tier)

## Tech Stack

- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Hosting**: Firebase App Hosting

## Getting Started

### Prerequisites

- Node.js 18+
- Firebase account
- Google Cloud project with Firestore enabled

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd woork
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment file:
```bash
cp .env.local.example .env.local
```

4. Configure Firebase:
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication (Email/Password, Google, GitHub):
     - Go to Authentication → Sign-in method
     - Enable "Email/Password" (toggle to ON, enable Email/Password, not just Email link)
     - Enable "Google" (toggle to ON, add your email as a provider)
     - Enable "GitHub" (optional, requires GitHub OAuth app)
   - Enable Firestore Database
   - Enable Storage
   - Add your domain to Authorized Domains:
     - Go to Authentication → Settings → Authorized domains
     - Add your production domain (e.g., your-app.vercel.app) and localhost
   - Copy your config to `.env.local`

5. Run the development server:
```bash
npm run dev
```

6. Open http://localhost:3000 in your browser

## Verifying the game

The game's rules (scoring, gauges, trap handling, the qualification gate, and the
content itself) are covered by a headless harness that plays the game end to end.
It needs no browser and no dev server:

```bash
npm run check:game       # 447 assertions: structure, play-throughs, content guards
npm run check:modules    # every game module imports and initialises
npx tsc --noEmit         # types across the app
```

`check/game-check.ts` is worth reading before changing scenario content. It fails
the build if a beat loses its citation, gains two correct answers, hard-codes a
stale pay figure, or if the qualification gate can be passed without beating the
traps.

The harness plays four ways and asserts the intended shape:

| Play style | Informs | Qualifies |
| --- | --- | --- |
| Perfect, first time | 96% | yes |
| Wrong first, then works it out | 74% | yes |
| Falls for every trap and stays there | 25% | no |
| Half-finished | 25% | no |

## Project Structure

```
woork/
├── src/
│   ├── app/
│   │   ├── page.tsx            # Landing page
│   │   ├── layout.tsx          # Root layout
│   │   ├── globals.css         # Global styles
│   │   ├── play/               # TRAINING GAME (onboarding, hub, stage runner)
│   │   └── jobs/               # Real job market, gated by the game
│   ├── components/
│   │   ├── providers.tsx       # Auth context (useAuth) - there is no auth-context.tsx
│   │   └── game/               # Game UI: BeatCard, MirrorStage, IdentityShield, MarketGate
│   └── lib/
│       ├── firebase.ts         # Firebase configuration
│       ├── types.ts            # Platform TypeScript definitions
│       └── game/
│           ├── types.ts        # Game type system
│           ├── engine.ts       # Scoring, gauges, licence gate, persistence
│           ├── scenarios.ts    # 8 stages, 24 beats, 37 real-world traps
│           ├── jurisdictions.ts# State/territory rules + cited live sources
│           ├── identity.ts     # Identity Shield rules
│           └── useGameProgress.ts
├── check/                      # Headless verification harness (dev only, excluded from tsc)
├── public/                     # Static assets
├── firestore.rules             # Firestore security rules
├── firebase.json               # Firebase configuration
└── package.json                # Dependencies
```

Note: the repo uses hand-rolled Tailwind plus `lucide-react`. There is no
`src/components/ui/` directory and no shadcn/ui setup, despite older references in
this README.

## Configuration

### Environment Variables

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

## License

MIT License - see LICENSE for details.

---

Built with ❤️ for Australian teenagers and their future employers.
