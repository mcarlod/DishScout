# DishScout

Discover, save, and cook recipes from around the world.

Built with React 19 + Vite, backed by Supabase (auth, `public.recipes`, `public.profiles`, `public.saved_recipes`).

## Getting started

1. Install dependencies: `npm install`
2. Create `.env.local` in the project root with your Supabase project details:
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_PUBLISHABLE_KEY=...
   ```
3. Start the dev server: `npm run dev`

## Scripts

- `npm run dev` — start the dev server
- `npm run lint` — run ESLint
- `npm run build` — create a production build
