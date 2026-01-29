# SiagaWarga Web

A lightweight, offline-first emergency check-in web application built for community-level preparedness.  
Developed for **IDCamp 2025 Developer Challenge: Small Apps for Big Preparedness**.

## Overview

**SiagaWarga Web** enables rapid, low-friction reporting of citizen safety status during emergencies (e.g. floods, earthquakes, fires).  
The system is designed to work reliably under poor network conditions and to minimize operational complexity for both citizens and coordinators.

This repository is published for **educational and reference purposes**.

## Core Design Principles

- **Offline-first**: user submissions are queued locally when offline
- **Low cognitive load**: no login required for citizens
- **Security by default**: read access restricted, App Check enforced
- **Minimal backend surface**: no custom server required
- **Deploy-fast architecture** suitable for rapid response scenarios

## System Architecture

### Client
- Single Page Application (SPA)
- Progressive Web App (PWA)
- LocalStorage-based offline queue
- Manual retry mechanism for failed submissions

### Backend (Managed)
- Firebase Firestore (data persistence)
- Firebase Authentication (admin access)
- Firebase App Check (anti-abuse protection)

### Deployment
- Vercel (static hosting + CDN)

## Feature Set

### Citizen Flow (Public)
- Status reporting:
  - `safe`
  - `help`
  - `unreachable`
- Optional contact and notes
- Offline queue with retry
- No authentication required

### Admin Flow (Protected)
- Email/password authentication
- Real-time Firestore subscription
- Region-based filtering
- CSV export
- Manual logout

## Technology Stack

- **Frontend:** React, TypeScript
- **Bundler:** Vite
- **Database:** Firebase Firestore
- **Auth:** Firebase Authentication
- **Abuse Prevention:** Firebase App Check (reCAPTCHA v3)
- **Offline Handling:** LocalStorage + retry logic
- **Deployment:** Vercel

## Repository Structure

```

src/
├── components/        # UI components
├── routes/            # Public & admin routes
├── utils/             # Offline queue, CSV, helpers
├── firebase.ts        # Firebase initialization
├── appCheck.ts        # Firebase App Check setup
├── styles.css         # Global styles
└── main.tsx           # App entry point

````

## Local Development

### Requirements
- Node.js >= 18
- Firebase project with Firestore enabled

### Installation
```bash
npm install
````

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_RECAPTCHA_V3_SITE_KEY=
```

### Run

```bash
npm run dev
```

---

## Firebase Configuration

### Firestore Rules

* Public users: `create` only
* Authenticated admin: `read`
* Updates and deletes blocked from public

See: `firestore.rules`

### Authentication

* Provider: Email / Password
* Only required for admin dashboard

### App Check

* Provider: reCAPTCHA v3
* Recommended flow:

  1. Monitoring
  2. Validate traffic
  3. Enforce for Cloud Firestore

---

## Deployment Notes (Vercel)

* Framework preset: **Vite**
* Build command: `npm run build`
* Output directory: `dist`
* Add production domain to:

  * Firebase Authentication → Authorized Domains
  * reCAPTCHA v3 domain allowlist

---

## License

This project is licensed under:

**Creative Commons Attribution–NonCommercial–NoDerivatives 4.0 International
(CC BY-NC-ND 4.0)**

You are free to:

* Share — copy and redistribute the material in any medium or format

Under the following terms:

* **Attribution** — You must give appropriate credit
* **NonCommercial** — You may not use the material for commercial purposes
* **NoDerivatives** — You may not distribute modified versions

Full license text:
[https://creativecommons.org/licenses/by-nc-nd/4.0/](https://creativecommons.org/licenses/by-nc-nd/4.0/)

---

## Author

**Erlangga Azhar**
📧 [azarrhost@gmail.com](mailto:azarrhost@gmail.com)

Developed as an individual project for educational and community preparedness purposes.

---

## Disclaimer

This software is provided **as-is**, without warranty of any kind.
Not intended for mission-critical emergency infrastructure without further hardening and review.