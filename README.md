# SUNOO - Feel The Music

The next generation of music streaming. This application features:
- A modern, dark-themed UI for music playback
- Supabase integration for authentication, database, music, and cover art storage
- Real-time tracks and playlist handling
- Custom creator dashboard

## Getting Started

1. Set up a Supabase Project.
2. In your Supabase SQL Editor, run the `supabase-schema.sql` file generated in the project.
3. Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your environment variables.
4. Go to Supabase Auth settings and enable Email/Password and Google/GitHub providers if you wish to use them.

## Vercel Deployment Instructions

When deploying this app to Vercel, simply provide your Supabase variables for storage, database, and auth in the Vercel Settings:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
