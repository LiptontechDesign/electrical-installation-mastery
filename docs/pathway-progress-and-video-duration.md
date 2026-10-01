# Pathway progress and supplementary running times

Implemented 1 October 2026.

## Progress scope

- C2, C1 and Advanced tabs select the primary progress scope in the course map.
- The primary card names that pathway and shows watched/active videos, percentage and an accessible progress bar. Its accent follows the existing pathway colour.
- A quieter All pathways row retains the complete personal course total.
- The toolbar and My learning progress panel use the selected pathway and name it explicitly. My learning also shows the overall total. Settings retains the account-wide record and labels it All pathways / overall.
- Next unwatched and Suggested next step search the selected pathway. Completing it does not suggest an unrelated pathway.
- Required, optional and supplementary entries all count. Lesson filters do not change progress denominators. Archives and permanent removals are excluded; restores recover their retained watched marks. Cross-path moves change each pathway's membership while preserving the overall total.
- Loading a linked video follows its resolved personal module/pathway, including when account ordering arrives after the first render. Subsequent tab browsing remains available.
- Guest access and its absence of saved progress are unchanged.

## Running times

`app/supplementary-durations.json` records all 32 bundled supplementary videos' running times, verified directly against each video's public YouTube player metadata on 1 October 2026. The RCD/RCBO/MCB overview (`nVi5Idyt-jE`) is 526 seconds, displayed as **8:46**.

- Bundled durations are available before playback, including on existing saved courses. Adding this metadata does not alter their positions, IDs or edit revisions.
- Supplementary map rows use the existing compact metadata line and keep the channel name out of that line. The duration sits beside Supplementary and the watched/current/saved state; menu space remains reserved.
- The overview, supplementary lesson heading, Home resume/upcoming cards and next-video card use available supplementary durations.
- New additions save a validated optional `durationSeconds` field from automatic metadata lookup. Existing videos without it request only their missing duration when displayed, with at most two requests in flight and no personal-course write. Collapsed overview modules do not initiate those lookups.
- The existing embedded player can supply missing timing information. Unknown/unavailable durations use an em dash rather than an invented time or 0:00.
- Metadata lookup still requires sign-in. Outbound requests use a fixed YouTube host, validated video IDs, rejected redirects and timeouts. The page parser reads the matching video's JSON without executing HTML or scripts; active live streams and invalid durations do not become fixed running times.
- Successful public metadata responses are eligible for the existing daily server fetch cache. Private progress, notes and ordering are not part of that cache.

## Verification

- `node scripts/test-supplementary-duration.mjs`: all bundled times, old saved-course enrichment, new personal duration persistence, invalid values, authenticated fixed-host lookup, escaped player JSON, wrong video identities and unavailable metadata.
- `node scripts/test-pathway-progress-browser.mjs`: desktop and 320px mobile, all three scopes, overall totals, completion, next unwatched, watch/Undo, archive/Undo, cross-path move, deletion/reload, Home/header, duration before playback and menu spacing.
- Existing mixed-progress, reviewed-placement and earthing browser suites retain coverage of watched marks, restore/delete, filtered counts, backup/reset and course ordering.
- Theme/contrast, ESLint, TypeScript and the production Next build remain publishing checks.

Browser checks use simulated accounts and YouTube playback; no live learner database records are changed by them.
