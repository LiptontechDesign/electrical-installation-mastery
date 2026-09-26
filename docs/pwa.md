# Installable app

The production Next.js app supports browser installation with `/manifest.webmanifest`, app icons and a root-scoped service worker. `/install` provides a native install button when the browser exposes `beforeinstallprompt`, plus Safari, Android and computer instructions. Links are available in the course overview, settings and practice footer. Installation is optional and never prompts automatically.

The installed app opens the existing course in a standalone window. This is an online course: installation does not download videos or books. Account sign-in can be required again in a standalone browser container. Practice working remains in page memory; download it before closing or reloading.

## Privacy and offline behavior

`public/sw.js` caches only `/offline.html`, a public reconnect page without learner records. It does not cache account pages, API responses, PDFs, videos or Next.js assets. Same-origin page navigations use the network and fall back only when the request fails. HTTP error responses are preserved. API routes, authentication callbacks, non-navigation requests and external requests bypass the worker entirely.

The worker registers only in production. HTTPS is required outside localhost. `/sw.js` has no-store response headers and registrations use `updateViaCache: 'none'`. New workers wait for old clients to close; there is no `skipWaiting`, forced reload or automatic update interruption. Activation deletes only obsolete `electrical-offline-` caches. Increment the cache version when changing the offline screen.

Installation state stays in memory. No install analytics, localStorage flags, push notifications or account fields were added. Clearing website data removes the public fallback and registration. The normal website remains usable in browsers without installation support.

## Verification

- `npm run test:pwa`: worker lifecycle, cache isolation, API/auth/media bypass, network-first responses and offline fallback.
- `npm run test:pwa-browser`: run against a production server at port 3002, or set `PWA_TEST_URL`. Uses an isolated temporary Edge profile to check Chromium installation requirements, icon dimensions, responsive layouts, prompt-state handling, actual offline navigation, reconnect and cache contents. Screenshots are written to ignored `work/pwa-verification/`.
- Production verification: `node node_modules/next/dist/bin/next build`, then `node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3002`.

Automated prompt events test UI state; they do not install the app on a physical device. Real iPhone/Android home-screen installation, standalone Google sign-in and OS-specific controls still need device testing. No offline video or offline book support is claimed.
