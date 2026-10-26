# Development Workflow

## Development priorities
- Finish core functionality before major UI redesigns.
- Preserve existing working features.
- Reuse existing React components, Supabase services, and database tables.
- Maintain desktop and mobile responsiveness.
- Avoid unnecessary dependencies and refactoring.

## Feature development
1. Inspect the existing implementation.
2. Make the minimum changes needed for the requested feature.
3. Ask for approval before modifying database schemas, RLS policies, or performing destructive operations.
4. Do not implement unrelated features.

## Testing
1. Run lint, build, and relevant automated tests.
2. Check that existing features still work.
3. Clearly report anything that requires manual browser testing.
4. Never claim untested functionality has been verified.

## Git workflow
After each feature is completed and verified:

1. Review git status and diff.
2. Stage only feature-related changes.
3. Exclude credentials, `.env.local`, and unrelated files.
4. Create a descriptive conventional commit.
5. Push to `origin/mobile-app`.
6. Never modify or merge into `main`.
7. Never squash, amend, or rewrite existing commits.
8. Preserve unrelated uncommitted changes.
9. Do not commit incomplete or failing work without my approval.

## Completion report
After each feature, report:
- What was implemented.
- Tests performed and results.
- Remaining issues.
- Commit hash.
- Confirmation of successful GitHub push.

Then stop and wait for my next instruction.
