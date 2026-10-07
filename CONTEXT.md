# Hands-Free Earbuds Realtime Speech System

Realtime multilingual speech-to-text and translation system powered by wearable Bluetooth earbuds.

## Language

**Wearer**:
The primary user wearing the Bluetooth earbuds whose speech is captured and who reads the live transcription.
_Avoid_: Speaker, client, subscriber.

**Earbud Mic**:
The onboard microphone of the connected Bluetooth earbud used as the primary audio capture source.
_Avoid_: Device mic, phone microphone, internal mic.

**STT Service**:
The external speech-to-text service that consumes audio segments and returns transcribed text with detected language metadata.
_Avoid_: Offline recognizer, dictation engine.

**STT Provider**:
The specific API provider powering the **STT Service** — finalized as Groq Cloud API (Whisper Large-v3) for zero-cost, high-speed multilingual recognition.
_Avoid_: Paid proprietary provider, self-hosted GPU requirement.

**Utterance**:
A continuous spoken audio segment captured between silence boundaries (VAD threshold ~500ms).
_Avoid_: Turn, sentence, voice clip.

**Transcription**:
The text produced from recognized speech in the detected spoken language.
_Avoid_: Subtitle, translation, script.

**Language Detection**:
The automatic identification of the spoken language tag (e.g., English, Vietnamese, Chinese) per utterance without manual intervention.
_Avoid_: Manual language toggle, locale picker.

**Speech Bubble**:
The finalized UI element rendering an utterance along with its detected language badge.
_Avoid_: Message card, chat tile.

## Relationships

- A **Wearer** speaks into an **Earbud Mic**
- An **Earbud Mic** captures audio into an **Utterance** bounded by speech silence
- Each **Utterance** is dispatched to the **STT Service** backed by the Groq **STT Provider**
- The **STT Service** performs automatic **Language Detection** on the **Utterance** to produce a **Transcription**
- Each finalized **Transcription** is rendered as a **Speech Bubble** on the mobile display

## Example dialogue

> **Dev:** "Do we need a running local GPU server when developing on a new machine?"
> **Domain expert:** "No — the **STT Service** uses the Groq **STT Provider** via API key, enabling zero-cost development anywhere."
> **Dev:** "Does the **Wearer** need to switch languages when switching between Vietnamese and English?"
> **Domain expert:** "No — automatic **Language Detection** resolves the language per **Utterance**."

## Flagged ambiguities

- "Microphone" was ambiguous between phone microphone and Bluetooth headset microphone — resolved: **Earbud Mic** is the exclusive input source.
- "Language selection" was ambiguous between user manual selection and automatic detection — resolved: **Language Detection** is fully automatic per **Utterance**.
- "STT Backend" was ambiguous between local GPU server and paid cloud API — resolved: Groq Cloud API (**STT Provider**) provides zero-cost, high-speed multilingual processing across development environments.
