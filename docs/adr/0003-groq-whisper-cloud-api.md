# 0003. Use Groq Whisper Cloud API as STT Provider

The system requires zero-cost multilingual transcription (Vietnamese, English, Chinese) with automatic language identification that can be developed flexibly across multiple developer machines without running local GPU servers. We decided to use Groq's Cloud API (running Whisper Large-v3 on LPU hardware), accepting turn-based segment delivery (~0.3s response time per utterance) in exchange for free tier operations, sub-second latency, and zero infrastructure overhead.
