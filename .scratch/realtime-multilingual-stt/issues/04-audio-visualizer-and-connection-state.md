# Issue 04: Audio Visualizer & Connection State Indicator (UI/UX Pro Max Polish)
Status: ready-for-agent

## What to build

Polish the interface to meet full UI/UX Pro Max standards for high-end audio apps. Implement an audio state visualizer component featuring a pulsing halo/waveform animation that reacts dynamically to microphone input levels during speech and smoothly transitions into a subtle pulse during API dispatch. Add network and API connectivity status indicators in the header using Lucide icons. Provide inline toast/banner feedback for missing API keys or connectivity drops.

## Acceptance criteria

- [ ] Pulsing halo / wave visualizer responds smoothly to speech input states.
- [ ] Visualizer transitions cleanly between Idle, Listening, and Processing states.
- [ ] Header includes Lucide icon indicators for mic status and connection state.
- [ ] User-friendly error notifications display when API key is missing or network times out.
- [ ] All interactive elements feature smooth 150ms-250ms micro-transitions.
- [ ] Screen adheres to dark mode OLED contrast standards (>= 4.5:1 text contrast).

## Blocked by

- `.scratch/realtime-multilingual-stt/issues/03-handsfree-silence-vad-loop.md`
