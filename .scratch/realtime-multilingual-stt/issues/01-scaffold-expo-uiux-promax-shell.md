# Issue 01: Scaffold Expo TypeScript App with UI/UX Pro Max Shell & Mock Bubbles
Status: done

## What to build

Initialize the React Native Expo project in TypeScript and establish the UI/UX Pro Max design system foundation. Configure NativeWind (Tailwind CSS) and Lucide icons. Build the core mobile screen using the Audio Dark Theme (`#0F172A` background, `#1E293B` bubble cards) displaying a scrollable feed of mock speech bubbles with distinct language badges for Vietnamese (Emerald), English (Sky), and Chinese (Amber). Verify the app renders cleanly in Expo Go on iOS.

## Acceptance criteria

- [x] Expo project initialized with TypeScript strict mode and runs with `npx expo start`.
- [x] NativeWind v4 (Tailwind CSS) configured and working with mobile utility classes.
- [x] UI/UX Pro Max dark theme implemented with `#0F172A` background and `#1E293B` card styling.
- [x] Mock speech bubbles render cleanly with dedicated language badges (`[VI]`, `[EN]`, `[ZH]`).
- [x] Mobile layout is responsive, respecting safe areas and status bar.
- [x] Touch targets and typography follow Apple Human Interface Guidelines and UI/UX Pro Max standards.

## Blocked by

None - can start immediately.

## Comments

- Initialized with pnpm package manager.
- Configured NativeWind v4, Tailwind CSS preset, and Lucide icons.
- Built responsive layout with dark OLED styling, language badges, and mock utterances.
- TypeScript strict typecheck passed cleanly with 0 errors.
