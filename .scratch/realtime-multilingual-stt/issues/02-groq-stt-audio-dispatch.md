# Issue 02: Groq STT Audio Dispatch Tracer (Single Utterance Recognition)
Status: done

## What to build

Implement a complete end-to-end audio recording and transcription vertical slice. Integrate Expo Audio recording configured with high-quality voice encoding. Setup client environment configuration for `EXPO_PUBLIC_GROQ_API_KEY`. When the user taps record and speaks a sentence in Vietnamese, English, or Chinese, encode the audio segment, dispatch it to the Groq Whisper Large-v3 endpoint, parse the transcription text along with the detected language, and append a live Speech Bubble into the message stream with the matching language badge.

## Acceptance criteria

- [ ] Audio recording captures user speech cleanly and exports compatible audio payload (m4a/wav).
- [ ] Groq API service client created to dispatch audio to `https://api.groq.com/openai/v1/audio/transcriptions`.
- [ ] Automatic language detection extracts language metadata (`vi`, `en`, `zh`).
- [ ] Real transcription text appears in the UI as a Speech Bubble within ~300ms-800ms of speech completion.
- [ ] Accurate language badge assigned automatically without manual user toggling.
- [ ] Graceful error handling if API key is invalid or network request fails.

## Blocked by

- `.scratch/realtime-multilingual-stt/issues/01-scaffold-expo-uiux-promax-shell.md`
