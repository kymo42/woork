# woork - Teen Employment Platform

A modern, mobile-first job platform designed specifically for Australian teenagers (13-17) to find employment, build professional profiles, and connect with employers.

## Features

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

## Project Structure

```
woork/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── page.tsx        # Landing page
│   │   ├── layout.tsx      # Root layout
│   │   └── globals.css     # Global styles
│   ├── components/         # React components
│   │   ├── auth-context.tsx
│   │   └── ui/             # Reusable UI components
│   └── lib/                # Utilities and configs
│       ├── firebase.ts     # Firebase configuration
│       └── types.ts        # TypeScript definitions
├── public/                 # Static assets
├── firestore.rules        # Firestore security rules
├── firebase.json          # Firebase configuration
└── package.json           # Dependencies
```

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
