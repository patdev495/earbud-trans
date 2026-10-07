# 0005. Frontend Stack (TypeScript) and Styling Architecture

For the mobile application, we decided to use:

1. **Package Manager**: **pnpm** (fast, disk-efficient package management).
2. **TypeScript (Strict Mode)**: Enforces end-to-end type safety for audio buffer handling, Groq API response models, and UI state management.
3. **Styling Library**: **NativeWind (Tailwind CSS for React Native)** paired with a curated design token system compliant with the **UI/UX Pro Max** skill.
   - **Theme & Mode**: Sleek Dark Mode optimized for OLED displays and audio-centric apps (`#0F172A` background, `#1E293B` cards/bubbles).
   - **Language Badge Palette**:
     - `VI` (Tiếng Việt): Emerald (`#10B981`)
     - `EN` (English): Sky/Blue (`#0EA5E9`)
     - `ZH` (中文): Amber/Orange (`#F59E0B`)
   - **Audio State Visualizer**: Subtle pulsing halo/wave indicator using SVG micro-animations for listening and processing states.
   - **Accessibility & UX**: Minimum 4.5:1 text contrast, touch targets >= 44x44pt, smooth transitions (150-250ms).
4. **Icons**: **lucide-react-native** for clean, modern iconography (microphones, language badges, Bluetooth status), adhering to UI/UX Pro Max rule against emoji icons.
