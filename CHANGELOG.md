# Changelog

All notable changes to the AutoReel Lite project will be documented in this file.

## [0.1.1] - 2026-06-04

### Added
- **Global Error Boundaries**: Added `app/error.tsx` and `app/global-error.tsx` to handle fatal application and UI crashes gracefully without exposing raw traces to the client.
- **Database Indexes**: Added `@index` on heavily filtered Prisma models:
  - `Post.createdById`, `Post.status`, `Post.scheduledAt`
  - `PostPlatform.postId`, `PostPlatform.status`
  - `PublishLog.postId`
  - `VideoAsset.createdById`
- **Token Encryption utility**: Added `lib/crypto.ts` for AES-256-GCM encryption and decryption. 

### Security
- **OAuth Token Storage (Critical Fix)**: Access tokens and refresh tokens from Meta and Google OAuth flows are now encrypted before being stored in the database, and decrypted in memory just-in-time when publishers use them.

### Fixed
- **Role Permission Logic Flaw in Worker (Critical Fix)**: Modified `lib/queue/worker.ts` so that when a Staff member creates a post, the worker correctly fetches the Social Accounts connected by an `ADMIN`, rather than attempting to find Social Accounts directly on the Staff's profile (which they don't have access to connect).
- **Edge Runtime Incompatibility**: Removed `middleware.ts` which crashed due to Node.js `stream` imports (from Prisma). Migrated route protection directly to `app/(dashboard)/layout.tsx` Server Component.

### Notes
- **Migration Required**: Because of schema changes, administrators must run `npx prisma db push` (or `migrate dev` when docker is up).
- **Environment Update**: Please add `TOKEN_ENCRYPTION_KEY` (a 32-character string) to your `.env` file.
- **Token Invalidation**: Any existing social accounts in the DB were stored in plain text and will now fail decryption. You must disconnect and reconnect them in the Settings page.
