# PRD: Realtime Multilingual Speech Recognition (Hands-Free Earbuds)

## 1. Objective

Deliver Phase 1 of the Hands-Free AI Earbuds application on iOS: enable wearers to speak hands-free via connected earbuds, transcribe speech in real-time across English, Vietnamese, and Chinese using zero-cost Groq Whisper Large-v3, and display transcriptions in a responsive, UI/UX Pro Max compliant dark-mode interface.

## 2. Architecture & Design Decisions

- **Domain Model**: Defined in [CONTEXT.md](../../CONTEXT.md) (**Wearer**, **Earbud Mic**, **Utterance**, **STT Service**, **STT Provider**, **Speech Bubble**).
- **Audio Capture**: Primary target is Bluetooth Earbud Mic via iOS `AVAudioSession` Bluetooth SCO ([ADR-0001](../../docs/adr/0001-bluetooth-audio-input.md)).
- **Utterance Segmentation**: Rapid client-side silence VAD (~500ms) with automatic language detection ([ADR-0002](../../docs/adr/0002-streaming-stt-with-auto-language-detection.md)).
- **STT Provider**: Groq Cloud API running Whisper Large-v3 for zero-cost, sub-second transcription ([ADR-0003](../../docs/adr/0003-groq-whisper-cloud-api.md)).
- **Client Architecture**: Serverless direct API integration via `EXPO_PUBLIC_GROQ_API_KEY` ([ADR-0004](../../docs/adr/0004-direct-client-api-integration.md)).
- **Frontend & Styling**: TypeScript + NativeWind (Tailwind CSS) + Lucide icons + UI/UX Pro Max Dark Theme ([ADR-0005](../../docs/adr/0005-frontend-tech-stack-and-styling.md)).

## 3. Implementation Plan (Vertical Slices)

1. [01-scaffold-expo-uiux-promax-shell.md](./issues/01-scaffold-expo-uiux-promax-shell.md) (AFK)
2. [02-groq-stt-audio-dispatch.md](./issues/02-groq-stt-audio-dispatch.md) (AFK)
3. [03-handsfree-silence-vad-loop.md](./issues/03-handsfree-silence-vad-loop.md) (AFK)
4. [04-audio-visualizer-and-connection-state.md](./issues/04-audio-visualizer-and-connection-state.md) (AFK)
5. [05-bluetooth-earbud-mic-native-routing.md](./issues/05-bluetooth-earbud-mic-native-routing.md) (HITL)
