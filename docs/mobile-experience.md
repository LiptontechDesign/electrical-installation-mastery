# Mobile experience

The responsive overrides in `app/mobile-experience.css` cover course navigation, guest and signed-in controls, lessons, the embedded book reader, practice and dialogs. CourseApp exposes its active view as a data attribute so the mobile Books workspace can reserve separate space for the header, guest banner, reading area and bottom navigation. PDF page controls stay outside the scrolling page content and above the navigation.

Phones retain playback settings, have touch-sized search/account/close controls, and avoid a duplicate course-map button. Text inputs use at least 16px type on small screens. Dialogs use dynamic viewport height, scroll internally and keep close controls accessible; opening a modal or course drawer prevents background document scrolling. Safe-area padding protects bottom controls. Touch focus no longer triggers a lingering hover tooltip; keyboard-visible focus still receives tooltips.

## Verification

`node scripts/test-mobile-browser.mjs` checks 320x740, 390x844, 430x932, 768x1024 and 844x390 in Chromium with mobile/touch emulation. It checks actual control hit targets and page overflow in guest home, lessons, maps, settings, search, sign-in invitation, book contents/page navigation and practice. At 390px it also checks a real PDF page renders. Local runs proxy only read-only book ranges from the production content endpoint. Set MOBILE_TEST_URL for a different server and MOBILE_TEST_CHANNEL for an installed Chromium channel. Screenshots are written to ignored work/mobile-verification.

`node scripts/test-mobile-account-browser.mjs` checks the signed-in home, account/settings, supplementary-video form, embedded supplementary lesson and notes at 320, 390 and 768px. It requires a local development server with fixture credentials: AUTH_SECRET=local-preview-only-0000000000000000000000, placeholder AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET, and a dummy DATABASE_URL. All personal API requests are intercepted in the browser; it neither signs into Google nor writes to production accounts. The script refuses non-local servers.

These are browser-emulated checks, not physical iPhone/Android certification. Actual operating-system keyboards, browser chrome and hardware playback controls still benefit from a device smoke test. Existing desktop course and practice browser suites remain the regression checks for larger layouts.
