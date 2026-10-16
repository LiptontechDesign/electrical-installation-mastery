# Course fullscreen player

Choose **Fullscreen lesson** beneath a video. Previous, Next, Auto-next and Exit remain available while the course changes videos, including transitions between core and supporting videos. The current title and module video position appear in the fullscreen controls. Controls and the five-second next-video prompt sit outside the embedded picture. The iframe fits a widescreen area within the available space, retaining a 200px height where space allows, so a tall portrait viewport does not stretch the player. Phone layouts use at least 44px control targets, a separate title row, a visible On/Off state and safe-area padding; short landscape screens use a compact row.

`CourseWatchView` owns the stable Learn container rather than placing the replaceable YouTube iframe into fullscreen. The container and its fullscreen toolbar persist across lesson changes. YouTube still provides playback, captions, seeking, sound and speed controls. Both embedded-player types use `playsinline=1` and the supported `fs=0` parameter so the course fullscreen control provides consistent navigation. Existing video identities, personal order, watched records and notes are unchanged. Manual navigation requests playback without marking the previous video watched.

On a touch device, entering native fullscreen attempts `screen.orientation.lock('landscape')` when available. Rotation is optional and may be refused by the browser or operating system; the site does not change the phone's rotation setting or request motion-sensor access. Exiting, browser cancellation and leaving Learn release only the course's orientation request. Request-generation checks prevent a cancelled or unmounted view from reopening after a late fullscreen response.

Standard and prefixed WebKit fullscreen APIs are detected at runtime. If native fullscreen is unavailable or rejected, the same controls work in an expanded viewport view, explicitly labelled **Expanded view**. This fallback cannot remove browser chrome or guarantee a landscape orientation. Escape and Exit restore the lesson page and keyboard focus, including when the original launch button was replaced during a core/supporting transition.

Auto-next continues inside the persistent course fullscreen container. Hidden-tab pauses and safe-exit handling for an independently fullscreen iframe remain in place. The five-second prompt can be cancelled, the next video can be selected immediately, and Auto-next can be switched off. Browser autoplay rules still apply: if playback is blocked, use the embedded Play control.

## Primary API references

- [Fullscreen requests and user activation](https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullscreen).
- [Screen orientation locking and its availability limits](https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation/lock).
- [YouTube player parameters, including inline playback and fullscreen-button visibility](https://developers.google.com/youtube/player_parameters).
- [YouTube player events and autoplay blocking](https://developers.google.com/youtube/iframe_api_reference).
- [Embedded-player functionality and unobstructed controls](https://developers.google.com/youtube/terms/required-minimum-functionality).
- [Container-relative dimensions for fitting the player](https://developer.mozilla.org/en-US/docs/Web/CSS/length#container_query_length_units).

## Verification

`npm run test:course-watch-view` exercises native and prefixed fullscreen, core/supporting transitions, persistent toolbar identity, sequence boundaries, rotation rejection, rejected or missing fullscreen support, Escape, late cancellation, unmount cleanup and focus restoration. `node scripts/test-navigation.mjs` also checks manual Previous/Next without premature watched marks. Existing guest, progress, account, theme and architecture checks remain applicable.

Browser checks use the actual course components and native fullscreen API with local sample records and a clickable YouTube-event fixture. This allows testing the five-second transition from core to supporting videos and back without modifying production learning records. Responsive geometry and controls were checked at 320x740, 390x844, 568x320, 844x390, 768x1024 and 1280x900: the video and toolbar fit without overlap and button targets are at least 44px. The phone countdown uses a separate title and action row; Next now retains fullscreen. Escape restores the current lesson's launch button even after a mixed-video transition. Orientation acceptance/rejection is covered by API-contract tests; emulation does not certify a physical phone's operating-system rotation behaviour. Fullscreen screenshots of the production guest player are also captured and visually reviewed.
