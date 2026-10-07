# 0002. Fast Utterance STT with Automatic Language Detection

The app requires low-latency, hands-free transcription across English, Vietnamese, and Chinese without requiring the wearer to manually select languages. We decided to use rapid utterance segmentation bounded by silence detection (VAD ~500ms) and dispatch audio clips to cloud inference with automatic language identification, accepting turn-based response intervals (~300ms post-utterance) in exchange for high multilingual accuracy, zero model maintenance, and full mobile client portability.
