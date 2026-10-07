# Issue 03: Automated Silence VAD Loop (Hands-Free Utterance Segmentation)
Status: ready-for-agent

## What to build

Implement a hands-free continuous listening loop using voice activity detection (VAD). Monitor audio input levels and detect speech silence pauses (~500ms - 800ms threshold). When the wearer stops speaking, automatically segment the completed utterance, push it to an asynchronous dispatch queue for Groq transcription, and immediately resume listening for the next utterance without dropping spoken audio. Auto-scroll the speech bubble list as new transcriptions arrive.

## Acceptance criteria

- [ ] Continuous listening session operates without requiring repeated manual button presses.
- [ ] Silence detection threshold (~500ms) reliably detects end-of-speech pauses between utterances.
- [ ] Utterances are queued and dispatched sequentially to prevent race conditions or dropped transcriptions.
- [ ] Continuous multi-turn dialogue automatically appends new speech bubbles in order.
- [ ] Speech bubble list smoothly auto-scrolls to the newest transcription.
- [ ] Wearer can switch between English, Vietnamese, and Chinese across consecutive sentences seamlessly.

## Blocked by

- `.scratch/realtime-multilingual-stt/issues/02-groq-stt-audio-dispatch.md`
