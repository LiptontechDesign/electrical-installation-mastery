# Overview / Standards Companion — Section 2 horizontal shell

Baseline for this section: `ba898fa423a970b4bfe2088e7c4a3715ee3b8f66`.

Section 2 implements the reusable learner-facing shell only. It does not publish C2-01 or later stage content and does not introduce any assessment engine.

## Two horizontal navigation levels

The first tab strip is fixed to the canonical eight-page sequence:

`System Model → Definitions → Relationships → Engineering Rules → Application → Verification → Common Confusions → Sources`

The Definitions page contains a second horizontal term strip. Only one focused canonical definition card is rendered at a time. Both strips support buttons for previous/next navigation, keyboard Left/Right/Home/End movement, horizontal scrolling, mobile scroll snapping and reduced-motion preferences.

## Focused definition card

The card can display:

- canonical term;
- authority badge;
- Kenya status badge;
- standards meaning;
- plain meaning;
- practical example;
- Do not confuse with relationships;
- related concepts;
- related formulas;
- bibliographic source information;
- exact `Open source page` action only when the Section 1 source resolver verifies an exact reader mapping;
- external source website when a safe HTTPS source is available;
- related lesson action;
- short unscored Explain it aloud prompt.

The component reads canonical records; definitions are not authored in React.

## Integration

`LessonOverview` asks `overviewSectionForLesson(lessonId)` for an authored section. Because Section 1 intentionally contains no learner-facing sections yet, the current site remains visually unchanged. The first content commit, C2-01, will make the shell appear automatically for lessons mapped to its reviewed Overview section.

This keeps Section 2 architectural and lets each later stage commit focus on audited content rather than mixing UI construction with electrical-authoring work.
