# SUNOO - Feel The Music

The next generation of music streaming. This application features:
- A modern, dark-themed UI for music playback
- Supabase integration for music and cover art storage
- Real-time tracks and playlist handling
- Custom creator dashboard
- Firebase Authentication and Firestore Database

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the dev server with `npm run dev`

## Technologies utilized
- React
- Vite
- Tailwind CSS
- Supabase
- Firebase

## Vercel Deployment Instructions

When deploying this app to Vercel, the `firebase-applet-config.json` doesn't automatically carry over the secret keys or is not available. To deploy safely, you must provide your Firebase configuration explicitly in the Vercel Settings.

Go to your **Vercel Project > Settings > Environment Variables** and add the following keys with the values from your Firebase Project Settings:

1. `VITE_FIREBASE_PROJECT_ID`
2. `VITE_FIREBASE_APP_ID`
3. `VITE_FIREBASE_API_KEY`
4. `VITE_FIREBASE_AUTH_DOMAIN`
5. `VITE_FIREBASE_DATABASE_ID`
6. `VITE_FIREBASE_STORAGE_BUCKET`
7. `VITE_FIREBASE_MESSAGING_SENDER_ID`
8. `VITE_FIREBASE_MEASUREMENT_ID`

Also, ensure you add your Supabase variables for storage:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

After adding these variables, redeploy the project. The `src/firebase.ts` file is already configured to prioritize these `import.meta.env` variables if they are present.
