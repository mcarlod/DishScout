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

## Development guidelines

### Priorities
- Finish all core application functionality before major UI redesigns.
- Preserve existing working features when implementing new ones.
- Reuse existing React components and Supabase services.
- Follow the existing desktop and mobile Figma designs where practical.
- Avoid unnecessary dependencies and database migrations.
- Explain important architectural decisions briefly.

### Supabase
- Never disable RLS or use a service-role key in the frontend.
- User IDs must come from the authenticated Supabase session, never from the UI.
- Do not recreate tables, change the schema, or modify existing records without the project owner's approval. Share any SQL for review before it is applied.
- `cuisine`, `ingredients` and `cooking_method` are Python-style list strings and `tags` is comma-separated text. Parse them in the frontend (`src/services/recipeService.js`) rather than converting the columns.

### Git workflow
After completing each feature:

1. Run the relevant tests, lint checks and production build.
2. Review the Git diff for unintended changes.
3. Verify that no credentials or `.env.local` files are staged.
4. If checks pass, stage only the files related to the completed feature.
5. Create one descriptive Git commit using conventional commit messages, such as `feat: add made recipe tracking`.
6. Do not amend existing commits.
7. Do not push to GitHub unless the project owner explicitly requests it.
8. Do not commit incomplete or failing features without the project owner's approval.
9. After committing, report the commit hash and a brief summary of changes.
10. Wait for approval before beginning another feature.

If tests fail or a feature is incomplete, explain the issue and do not commit until it is resolved or an exception is approved.
